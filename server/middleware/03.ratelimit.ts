// Simple in-memory rate limiter
// For production scale, consider using Redis or a similar store

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_REQUESTS = 100 // Limit each IP to 100 requests per window
const CLEANUP_INTERVAL_MS = 60 * 1000 // Run cleanup at most once per minute

let lastCleanupAt = 0

function cleanupExpiredEntries(now: number) {
  if (now - lastCleanupAt < CLEANUP_INTERVAL_MS) {
    return
  }

  for (const [clientAddress, data] of rateLimitMap.entries()) {
    if (now >= data.resetTime) {
      rateLimitMap.delete(clientAddress)
    }
  }

  lastCleanupAt = now
}

export default defineEventHandler((event) => {
  // Only apply to API routes
  if (!event.path.startsWith('/api/')) {
    return
  }

  const clientAddress = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const now = Date.now()
  cleanupExpiredEntries(now)

  const clientData = rateLimitMap.get(clientAddress)

  if (!clientData || now >= clientData.resetTime) {
    // Initialize or reset window
    rateLimitMap.set(clientAddress, {
      count: 1,
      resetTime: now + WINDOW_MS,
    })
    return
  }

  if (clientData.count >= MAX_REQUESTS) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      message: 'You have exceeded the rate limit. Please try again later.',
    })
  }

  clientData.count++
})
