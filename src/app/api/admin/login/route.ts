import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createAdminSessionToken,
  extractJtiFromCookie,
  getAdminAuthConfigError,
  getAdminPassword,
  persistAdminSession,
  revokeAdminSession,
} from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

const HASH_KEY = 'admin_password_hash'
const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 15 * 60 * 1000

async function checkRateLimit(ip: string): Promise<{ allowed: boolean; retryAfter?: number }> {
  const record = await prisma.loginAttempt.findUnique({ where: { ip } })
  if (!record) return { allowed: true }
  if (record.lockedUntil && record.lockedUntil > new Date()) {
    return { allowed: false, retryAfter: record.lockedUntil.getTime() - Date.now() }
  }
  if (record.lockedUntil && record.lockedUntil <= new Date()) {
    await prisma.loginAttempt.update({ where: { ip }, data: { attempts: 1, lockedUntil: null } })
    return { allowed: true }
  }
  return { allowed: record.attempts < MAX_ATTEMPTS }
}

async function recordAttempt(ip: string, success: boolean) {
  if (success) {
    await prisma.loginAttempt.deleteMany({ where: { ip } })
    return
  }
  const record = await prisma.loginAttempt.findUnique({ where: { ip } })
  if (!record) {
    await prisma.loginAttempt.create({ data: { ip, attempts: 1 } })
    return
  }
  const newAttempts = record.attempts + 1
  const lockUntil = newAttempts >= MAX_ATTEMPTS ? new Date(Date.now() + LOCKOUT_MS) : null
  await prisma.loginAttempt.update({ where: { ip }, data: { attempts: newAttempts, lockedUntil: lockUntil } })
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { allowed, retryAfter } = await checkRateLimit(ip)

    if (!allowed) {
      return NextResponse.json(
        { error: `Cuenta bloqueada temporalmente. Intentá de nuevo en ${Math.ceil((retryAfter || 0) / 60000)} minutos.` },
        { status: 429 }
      )
    }

    const adminPassword = getAdminPassword()
    const { password } = await req.json()

    if (!password) {
      return NextResponse.json({ error: 'Contraseña requerida' }, { status: 400 })
    }

    // Check stored hash first, then fall back to env var
    const storedHash = await prisma.siteConfig.findUnique({ where: { key: HASH_KEY } })
    let passwordValid = false

    if (storedHash?.value) {
      passwordValid = await bcrypt.compare(password, storedHash.value)
    } else if (adminPassword) {
      // Fallback to env var (legacy)
      passwordValid = password.length === adminPassword.length &&
        timingSafeEqual(Buffer.from(password), Buffer.from(adminPassword))
    }

    if (!passwordValid) {
      await recordAttempt(ip, false)
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
    }

    await recordAttempt(ip, true)

    const sessionToken = await createAdminSessionToken()
    if (!sessionToken) {
      return NextResponse.json({ error: getAdminAuthConfigError() }, { status: 503 })
    }

    const jti = extractJtiFromCookie({ get: () => ({ value: sessionToken }) })
    if (jti) {
      await persistAdminSession(jti)
    }

    const response = NextResponse.json({ ok: true })
    response.cookies.set(ADMIN_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: ADMIN_SESSION_MAX_AGE,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const jti = extractJtiFromCookie(req.cookies)
  if (jti) {
    await revokeAdminSession(jti)
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  })
  return response
}
