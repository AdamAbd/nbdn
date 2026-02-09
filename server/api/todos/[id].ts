import type { InferInsertModel } from 'drizzle-orm'
import { and, eq } from 'drizzle-orm'
import { createError, getMethod, getRouterParam, readBody } from 'h3'
import { todo } from '#server/db/schema'
import { requireUser } from '#server/utils/auth'
import { serializeTodo } from '#server/utils/todo'
import { db } from '#server/db'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const method = getMethod(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Todo id tidak valid.',
    })
  }

  if (method === 'PATCH') {
    const body = await readBody(event)
    const updates: Partial<InferInsertModel<typeof todo>> = {}

    if (body?.title !== undefined) {
      const title = typeof body.title === 'string' ? body.title.trim() : ''
      if (!title) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Judul wajib diisi.',
        })
      }
      updates.title = title
    }

    if (body?.description !== undefined) {
      const description = typeof body.description === 'string' ? body.description.trim() : ''
      updates.description = description || null
    }

    if (Object.prototype.hasOwnProperty.call(body ?? {}, 'jsonValue')) {
      updates.jsonValue = body?.jsonValue ?? null
    }

    if (Object.prototype.hasOwnProperty.call(body ?? {}, 'photoUrl')) {
      updates.photoUrl = typeof body?.photoUrl === 'string' ? body.photoUrl : null
    }

    if (Object.prototype.hasOwnProperty.call(body ?? {}, 'completed')) {
      updates.completed = Boolean(body?.completed)
    }

    if (Object.keys(updates).length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tidak ada data yang diubah.',
      })
    }

    updates.updatedAt = new Date()

    const [updated] = await db
      .update(todo)
      .set(updates)
      .where(and(eq(todo.id, id), eq(todo.userId, user.id)))
      .returning()

    if (!updated) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Todo tidak ditemukan.',
      })
    }

    return serializeTodo(updated)
  }

  if (method === 'DELETE') {
    const deleted = await db
      .delete(todo)
      .where(and(eq(todo.id, id), eq(todo.userId, user.id)))
      .returning({ id: todo.id })

    if (!deleted.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Todo tidak ditemukan.',
      })
    }

    return { success: true }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method Not Allowed',
  })
})
