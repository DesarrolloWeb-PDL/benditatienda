import {
  type RateLimitOptions,
  type RateLimitResult,
  createFallbackConsume,
} from '@/lib/rate-limit-core'

const fallback = createFallbackConsume('__cymRlStore')

export function consumeRateLimitEdge(options: RateLimitOptions): RateLimitResult {
  return fallback.consume(options)
}

export function resetRateLimitStore() {
  fallback.reset()
}
