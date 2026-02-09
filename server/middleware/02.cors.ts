export default defineEventHandler((event) => {
  const config = useRuntimeConfig()

  // Basic CORS configuration
  // In production, you should specify allowed origins
  handleCors(event, {
    origin: '*', // Adjust this to your needs
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
