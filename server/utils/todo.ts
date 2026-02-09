import type { InferSelectModel } from 'drizzle-orm'
import type { todo } from '#server/db/schema'
import type { TodoItem } from '~~/shared/schemas/todo'

export type TodoRow = InferSelectModel<typeof todo>

export const serializeTodo = (row: TodoRow): TodoItem => ({
  id: row.id,
  title: row.title,
  description: row.description ?? '',
  jsonValue: row.jsonValue ?? null,
  photoUrl: row.photoUrl ?? null,
  completed: row.completed,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt ? row.updatedAt.toISOString() : null,
})
