import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export const dynamic = 'force-static'

export async function GET() {
  const eggPath = path.join(process.cwd(), 'public', 'favicon-egg.svg')
  const buffer = await readFile(eggPath)

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
