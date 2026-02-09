import { randomUUID } from 'crypto'
import { desc, eq } from 'drizzle-orm'
import { createError, getMethod, readBody } from 'h3'
import { db } from '#server/db'
import { todo } from '#server/db/schema'
import { requireUser } from '#server/utils/auth'
import { serializeTodo } from '#server/utils/todo'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const method = getMethod(event)

  if (method === 'GET') {
    const rows = await db
      .select()
      .from(todo)
      .where(eq(todo.userId, user.id))
      .orderBy(desc(todo.createdAt))

    return rows.map(serializeTodo)
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const title = typeof body?.title === 'string' ? body.title.trim() : ''
    if (!title) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Judul wajib diisi.',
      })
    }

    const description = typeof body?.description === 'string' ? body.description.trim() : ''
    const jsonValue = body?.jsonValue ?? null
    const photoUrl = typeof body?.photoUrl === 'string' ? body.photoUrl : null

    const [created] = await db
      .insert(todo)
      .values({
        id: randomUUID(),
        userId: user.id,
        title,
        description: description || null,
        jsonValue,
        photoUrl,
        completed: false,
      })
      .returning()

    if (!created) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Gagal membuat todo.',
      })
    }

    return serializeTodo(created)
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method Not Allowed',
  })
})
