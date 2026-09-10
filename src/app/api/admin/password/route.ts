import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { getAdminPassword, revokeAllAdminSessions, extractJtiFromCookie, revokeAdminSession } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

const HASH_KEY = 'admin_password_hash'
const BCRYPT_ROUNDS = 12

// Rate limiting: max 5 attempts per 15 minutes per IP
const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 15 * 60 * 1000

async function checkRateLimit(ip: string): Promise<{ allowed: boolean; retryAfter?: number }> {
  const record = await prisma.loginAttempt.findUnique({ where: { ip } })

  if (!record) return { allowed: true }

  if (record.lockedUntil && record.lockedUntil > new Date()) {
    return { allowed: false, retryAfter: record.lockedUntil.getTime() - Date.now() }
  }

  // Reset if lockout expired
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

  await prisma.loginAttempt.update({
    where: { ip },
    data: { attempts: newAttempts, lockedUntil: lockUntil },
  })
}

async function getStoredHash(): Promise<string | null> {
  const row = await prisma.siteConfig.findUnique({ where: { key: HASH_KEY } })
  return row?.value ?? null
}

async function setStoredHash(hash: string): Promise<void> {
  await prisma.siteConfig.upsert({
    where: { key: HASH_KEY },
    update: { value: hash },
    create: { key: HASH_KEY, value: hash },
  })
}

/**
 * POST /api/admin/password — change password
 * Body: { currentPassword, newPassword }
 */
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { allowed, retryAfter } = await checkRateLimit(ip)

    if (!allowed) {
      return NextResponse.json(
        { error: `Demasiados intentos. Intentá de nuevo en ${Math.ceil((retryAfter || 0) / 60000)} minutos.` },
        { status: 429 }
      )
    }

    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    // Password strength validation
    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'La nueva contraseña debe tener al menos 8 caracteres' }, { status: 400 })
    }
    if (!/[A-Z]/.test(newPassword)) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos una mayúscula' }, { status: 400 })
    }
    if (!/[a-z]/.test(newPassword)) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos una minúscula' }, { status: 400 })
    }
    if (!/[0-9]/.test(newPassword)) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos un número' }, { status: 400 })
    }

    // Verify current password
    const storedHash = await getStoredHash()
    const envPassword = getAdminPassword()

    let currentValid = false

    if (storedHash) {
      currentValid = await bcrypt.compare(currentPassword, storedHash)
    } else if (envPassword) {
      currentValid = currentPassword === envPassword
    }

    if (!currentValid) {
      await recordAttempt(ip, false)
      return NextResponse.json({ error: 'La contraseña actual es incorrecta' }, { status: 401 })
    }

    // Hash new password
    const newHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS)
    await setStoredHash(newHash)
    await recordAttempt(ip, true)

    // Revoke all sessions for security
    await revokeAllAdminSessions()

    return NextResponse.json({ ok: true, message: 'Contraseña actualizada. Todas las sesiones anteriores fueron cerradas.' })
  } catch (e) {
    console.error('Password change error:', e)
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 })
  }
}
