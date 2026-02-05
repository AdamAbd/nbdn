import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './server/db'
import * as schema from './auth-schema'

const betterAuthSecret = process.env.BETTER_AUTH_SECRET
const betterAuthUrl = process.env.BETTER_AUTH_URL

if (!betterAuthSecret) {
  throw new Error('BETTER_AUTH_SECRET is not set')
}

if (!betterAuthUrl) {
  throw new Error('BETTER_AUTH_URL is not set')
}

export const auth = betterAuth({
  secret: betterAuthSecret,
  baseURL: betterAuthUrl,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
})
