# Setup Better Auth + Drizzle ORM + Neon Postgres (Nuxt)

Dokumen ini merangkum setup yang sudah dilakukan di project ini.

## Prasyarat

- Bun terpasang
- Database Neon Postgres aktif dan memiliki connection string

## Environment Variables

Buat `.env` di root project dan isi minimal:

```bash
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your-secret
BETTER_AUTH_URL=http://localhost:3000
```

Catatan:
- `BETTER_AUTH_URL` harus sesuai base URL aplikasi pada environment yang dipakai.

## Dependensi

Sudah terpasang:

- `better-auth`
- `drizzle-orm`
- `@neondatabase/serverless`
- `drizzle-kit` (dev)
- `tsx` (dev)
- `dotenv`

## Struktur File Penting

- `app/lib/auth.ts` → konfigurasi Better Auth
- `server/api/auth/[...all].ts` → handler API Better Auth
- `server/db/index.ts` → koneksi Neon + Drizzle
- `auth-schema.ts` → schema Drizzle hasil generate Better Auth
- `drizzle.config.ts` → config Drizzle Kit
- `app/lib/auth-client.ts` → client helper Better Auth untuk Nuxt
- `nuxt.config.ts` → runtime config untuk env (Nuxt)

## Konfigurasi Drizzle Kit

`drizzle.config.ts`:

```ts
import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle',
  schema: './auth-schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

## Runtime Config (Nuxt)

`nuxt.config.ts`:\n
```ts
export default defineNuxtConfig({
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    betterAuthSecret: process.env.BETTER_AUTH_SECRET,
    betterAuthUrl: process.env.BETTER_AUTH_URL,
  },
})
```

## Konfigurasi DB Client (Neon + Drizzle)

`server/db/index.ts`:

```ts
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../../auth-schema'

const config = useRuntimeConfig()

const sql = neon(config.databaseUrl)

export const db = drizzle({ client: sql, schema })
```

## Konfigurasi Better Auth

`app/lib/auth.ts`:

```ts
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '../../server/db'
import * as schema from '../../auth-schema'

const config = useRuntimeConfig()

export const auth = betterAuth({
  secret: config.betterAuthSecret,
  baseURL: config.betterAuthUrl,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
})
```

## Handler API

`server/api/auth/[...all].ts`:

```ts
import { toWebRequest } from 'h3'
import { auth } from '@/lib/auth'

export default defineEventHandler((event) => {
  return auth.handler(toWebRequest(event))
})
```

## Auth Client (Nuxt)

`app/lib/auth-client.ts`:

```ts
import { createAuthClient } from 'better-auth/vue'

export const authClient = createAuthClient()
```

## Generate Schema Better Auth

```bash
bunx @better-auth/cli@latest generate --yes
```

Hasilnya akan membuat file `auth-schema.ts` di root project.

## Migration Drizzle

Generate migration dari schema:

```bash
bun run db:generate
```

Jalankan migration ke database:

```bash
bun run db:migrate
```

## Contoh Pemakaian (Login)

```ts
const { error } = await authClient.signIn.email({
  email: values.email,
  password: values.password,
})
```

## Contoh Pemakaian (Register)

```ts
const { error } = await authClient.signUp.email({
  name: values.name,
  email: values.email,
  password: values.password,
})
```
