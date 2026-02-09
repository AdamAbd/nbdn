import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import type { H3Event } from 'h3'
import { createError, getRequestHeaders } from 'h3'
import { db } from '#server/db'
import * as schema from '#server/db/schema'

export const auth = betterAuth({
  secret: useRuntimeConfig().betterAuthSecret,
  baseURL: useRuntimeConfig().betterAuthUrl,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
})

export const requireUser = async (event: H3Event) => {
  const session = await auth.api.getSession({
    headers: new Headers(getRequestHeaders(event) as Record<string, string>),
  })

  if (!session?.user?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  return session.user
}
