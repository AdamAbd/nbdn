export default defineEventHandler((event) => {
  const start = Date.now()
  const { method, url } = event.node.req

  event.node.res.on('finish', () => {
    const duration = Date.now() - start
    const statusCode = event.node.res.statusCode
    console.log(`[${new Date().toISOString()}] ${method} ${url} - ${statusCode} (${duration}ms)`)
  })
})
