import { createError, getRouterParam, readBody } from 'h3'
import { requireUser } from '#server/utils/auth'
import { TodoService } from '#server/services/todo.service'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Todo id tidak valid.',
    })
  }

  const body = await readBody(event)
  return TodoService.updateTodo(id, user.id, body)
})

defineRouteMeta({
  openAPI: {
    tags: ['Todos'],
    summary: 'Update todo',
    description: 'Memperbarui data todo.',
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' },
      },
    ],
    responses: {
      200: {
        description: 'Todo berhasil diperbarui.',
      },
      404: {
        description: 'Todo tidak ditemukan.',
      },
    },
  },
})
