import { randomUUID } from 'crypto'
import { createError } from 'h3'
import { TodoRepository } from '#server/repositories/todo.repository'
import { serializeTodo } from '#server/utils/todo'
import { createTodoSchema, updateTodoSchema } from '~~/shared/schemas/todo'

export const TodoService = {
  async getTodos(userId: string) {
    const rows = await TodoRepository.findAllByUserId(userId)
    return rows.map(serializeTodo)
  },

  async createTodo(userId: string, data: unknown) {
    const result = createTodoSchema.safeParse(data)
    if (!result.success) {
      throw createError({
        statusCode: 400,
        statusMessage: result.error.errors[0].message,
      })
    }

    const val = result.data

    const created = await TodoRepository.create({
      id: randomUUID(),
      userId,
      title: val.title,
      description: val.description ?? null,
      jsonValue: val.jsonValue ?? null,
      photoUrl: val.photoUrl ?? null,
      completed: val.completed ?? false,
    })

    if (!created) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Gagal membuat todo.',
      })
    }

    return serializeTodo(created)
  },

  async updateTodo(id: string, userId: string, data: unknown) {
    const result = updateTodoSchema.safeParse(data)
    if (!result.success) {
      throw createError({
        statusCode: 400,
        statusMessage: result.error.errors[0].message,
      })
    }

    const updates = result.data

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
