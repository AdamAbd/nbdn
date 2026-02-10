import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '#server/db/schema'

const createDb = () => {
  const config = useRuntimeConfig()
  const sql = neon(config.databaseUrl)
  return drizzle({ client: sql, schema })
}

type DbClient = ReturnType<typeof createDb>
let dbInstance: DbClient | null = null

export const getDb = (): DbClient => {
  if (dbInstance) {
    return dbInstance
  }

  dbInstance = createDb()
  return dbInstance
}
