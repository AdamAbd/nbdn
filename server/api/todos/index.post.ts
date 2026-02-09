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
