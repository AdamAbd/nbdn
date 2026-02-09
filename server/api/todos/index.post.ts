import { readBody } from 'h3'
import { requireUser } from '#server/utils/auth'
import { TodoService } from '#server/services/todo.service'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const body = await readBody(event)

  return TodoService.createTodo(user.id, {
    title: body?.title,
    description: body?.description,
    jsonValue: body?.jsonValue,
    photoUrl: body?.photoUrl,
  })
})

defineRouteMeta({
  openAPI: {
    tags: ['Todos'],
    summary: 'Create todo',
    description: 'Membuat todo baru.',
    responses: {
      201: {
        description: 'Todo berhasil dibuat.',
      },
      400: {
        description: 'Bad Request - Validasi gagal.',
      },
      401: {
        description: 'Unauthorized.',
      },
    },
  },
})
