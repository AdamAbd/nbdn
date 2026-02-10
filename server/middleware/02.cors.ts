export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const allowedOrigins = config.corsAllowedOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  handleCors(event, {
    // `credentials: true` cannot be used with wildcard origin (`*`).
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: '86400', // 24 hours
  })

  // If handleCors returns a response (like for OPTIONS), we stop here
  if (event.method === 'OPTIONS') {
    return null
  }
})
