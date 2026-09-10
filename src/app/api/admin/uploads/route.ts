import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { hasAdminSession } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'])
const MAX_SIZE = 5 * 1024 * 1024

function getFileExtension(file: File) {
  const byMime: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
  }
  return file.name.split('.').pop()?.toLowerCase() || byMime[file.type] || 'jpg'
}

export async function POST(req: NextRequest) {
  try {
    if (!(await hasAdminSession(req.cookies))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'Archivo no válido' }, { status: 400 })
    }

    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json({ error: 'Formato no soportado. Usa JPG, PNG o WEBP' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'La imagen supera 5MB' }, { status: 400 })
    }

    const ext = getFileExtension(file)
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const blob = await put(`productos/${filename}`, file, {
      access: 'public',
      contentType: file.type,
    })

    return NextResponse.json({ url: blob.url, filePath: filename })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: `Error al subir imagen: ${errorMsg}` }, { status: 500 })
  }
}
