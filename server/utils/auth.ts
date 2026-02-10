import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import type { H3Event } from 'h3'
import { createError, getRequestHeaders } from 'h3'
import { getDb } from '#server/db'
import * as schema from '#server/db/schema'

const createAuth = () => {
  const config = useRuntimeConfig()

  return betterAuth({
    secret: config.betterAuthSecret,
    baseURL: config.betterAuthUrl,
    database: drizzleAdapter(getDb(), {
      provider: 'pg',
      schema,
    }),
    emailAndPassword: {
      enabled: true,
    },
  })
}

type AuthInstance = ReturnType<typeof createAuth>
let authInstance: AuthInstance | null = null

export const getAuth = (): AuthInstance => {
  if (authInstance) {
    return authInstance
  }

  authInstance = createAuth()
  return authInstance
}

export const requireUser = async (event: H3Event) => {
  const session = await getAuth().api.getSession({
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
