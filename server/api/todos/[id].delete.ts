import { createError, getRouterParam } from 'h3'
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

  return TodoService.deleteTodo(id, user.id)
})
