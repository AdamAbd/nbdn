import { randomUUID } from 'crypto'
import { createError } from 'h3'
import { TodoRepository } from '#server/repositories/todo.repository'
import { serializeTodo } from '#server/utils/todo'
import type { InferInsertModel } from 'drizzle-orm'
import type { todo } from '#server/db/schema'

export const TodoService = {
  async getTodos(userId: string) {
    const rows = await TodoRepository.findAllByUserId(userId)
    return rows.map(serializeTodo)
  },

  async createTodo(
    userId: string,
    data: { title: string; description?: string; jsonValue?: any; photoUrl?: string }
  ) {
    const title = data.title?.trim()
    if (!title) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Judul wajib diisi.',
      })
    }

    const description = data.description?.trim() || null
    const jsonValue = data.jsonValue ?? null
    const photoUrl = data.photoUrl ?? null

    const created = await TodoRepository.create({
      id: randomUUID(),
      userId,
      title,
      description,
      jsonValue,
      photoUrl,
      completed: false,
    })

    if (!created) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Gagal membuat todo.',
      })
    }

    return serializeTodo(created)
  },

  async updateTodo(id: string, userId: string, data: Partial<InferInsertModel<typeof todo>>) {
    const updates: Partial<InferInsertModel<typeof todo>> = {}

    if (data.title !== undefined) {
      const title = typeof data.title === 'string' ? data.title.trim() : ''
      if (!title) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Judul wajib diisi.',
        })
      }
      updates.title = title
    }

    if (data.description !== undefined) {
      const description = typeof data.description === 'string' ? data.description.trim() : ''
      updates.description = description || null
    }

    if (Object.prototype.hasOwnProperty.call(data, 'jsonValue')) {
      updates.jsonValue = data.jsonValue ?? null
    }

    if (Object.prototype.hasOwnProperty.call(data, 'photoUrl')) {
      updates.photoUrl = typeof data.photoUrl === 'string' ? data.photoUrl : null
    }

    if (Object.prototype.hasOwnProperty.call(data, 'completed')) {
      updates.completed = Boolean(data.completed)
    }

    if (Object.keys(updates).length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tidak ada data yang diubah.',
      })
    }

    const updated = await TodoRepository.update(id, userId, updates)

    if (!updated) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Todo tidak ditemukan.',
      })
    }

    return serializeTodo(updated)
  },

  async deleteTodo(id: string, userId: string) {
    const deleted = await TodoRepository.delete(id, userId)

    if (!deleted) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Todo tidak ditemukan.',
      })
    }

    return { success: true }
  },
}
