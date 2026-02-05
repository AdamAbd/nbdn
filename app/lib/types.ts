export type TodoItem = {
  id: string
  title: string
  description: string
  jsonValue: unknown | null
  photoUrl: string | null
  completed: boolean
  createdAt: string
  updatedAt: string | null
}
