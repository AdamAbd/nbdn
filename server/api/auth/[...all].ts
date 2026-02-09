import { toWebRequest } from 'h3'
import { auth } from '#server/utils/auth'

export default defineEventHandler((event) => {
  return auth.handler(toWebRequest(event))
})

defineRouteMeta({
  openAPI: {
    tags: ['Auth'],
    summary: 'Better Auth Handler',
    description: 'Handles all authentication related requests (login, register, session, etc).',
  },
})
