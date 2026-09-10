import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

function isAccelerateUrl(url: string): boolean {
  return url.startsWith('prisma://') || url.startsWith('prisma+postgres://')
}

export function createConfiguredPrismaClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL

  if (!dbUrl) {
    throw new Error('DATABASE_URL no está configurada en el entorno')
  }

  // Accelerate (remote Postgres via Prisma)
  if (isAccelerateUrl(dbUrl)) {
    return new PrismaClient({
      accelerateUrl: dbUrl,
    }).$extends(withAccelerate()) as unknown as PrismaClient
  }

  // SQLite with better-sqlite3
  if (dbUrl.startsWith('file:')) {
    const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
    const rawPath = dbUrl.replace('file:', '')
    const absPath = path.isAbsolute(rawPath)
      ? rawPath
      : path.resolve(__dirname, '..', '..', rawPath)
    const dbPath = absPath.replace(/\\/g, '/')
    const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` })
    return new PrismaClient({ adapter }) as unknown as PrismaClient
  }

  // PostgreSQL with adapter
  const { PrismaPg } = require('@prisma/adapter-pg')
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: dbUrl }),
  })
}
