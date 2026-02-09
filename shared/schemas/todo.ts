import { z } from 'zod'

export const todoSchema = z.object({
  title: z.string().trim().min(1, 'Judul wajib diisi.').max(255, 'Judul terlalu panjang.'),
  description: z.string().trim().optional().nullable(),
  jsonValue: z.any().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
  completed: z.boolean().optional().default(false),
})

export const createTodoSchema = todoSchema
export const updateTodoSchema = todoSchema.partial()

export const todoItemSchema = todoSchema.extend({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
})

export type TodoItem = z.infer<typeof todoItemSchema>
export type CreateTodoInput = z.infer<typeof createTodoSchema>
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>
