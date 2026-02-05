import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../../auth-schema'

const config = useRuntimeConfig()

const sql = neon(config.databaseUrl)

export const db = drizzle({ client: sql, schema })
