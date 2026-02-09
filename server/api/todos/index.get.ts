import { requireUser } from '#server/utils/auth'
import { TodoService } from '#server/services/todo.service'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  return TodoService.getTodos(user.id)
})

defineRouteMeta({
  openAPI: {
    tags: ['Todos'],
    summary: 'Get all todos',
    description: 'Mengambil semua daftar todo milik user yang sudah login.',
    responses: {
      200: {
        description: 'Daftar todo berhasil diambil.',
      },
      401: {
        description: 'Unauthorized - User belum login.',
      },
    },
  },
})
