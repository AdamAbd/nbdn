import type { H3Event } from 'h3'
import { createError, getRequestHeaders } from 'h3'
import { auth } from '@/lib/auth'

export const requireUser = async (event: H3Event) => {
  const session = await auth.api.getSession({
    headers: new Headers(getRequestHeaders(event)),
  })

  if (!session?.user?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  return session.user
}
