import { toWebRequest } from 'h3'
import { getAuth } from '#server/utils/auth'

export default defineEventHandler((event) => {
  return getAuth().handler(toWebRequest(event))
})

defineRouteMeta({
  openAPI: {
    tags: ['Auth'],
    summary: 'Better Auth Handler',
    description: 'Handles all authentication related requests (login, register, session, etc).',
  },
})
