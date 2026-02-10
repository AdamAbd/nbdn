import type { TodoItem } from '~~/shared/schemas/todo'

type SaveTodoPayload = {
  title: string
  description?: string
  jsonValue: TodoItem['jsonValue']
  photoUrl: string | null
}

export const useTodos = () => {
  const apiError = ref('')

  const {
    data,
    pending: isLoading,
    error,
  } = useFetch<TodoItem[]>('/api/todos', {
    credentials: 'include',
    default: () => [],
  })

  const todos = computed({
    get: () => data.value ?? [],
    set: (value: TodoItem[]) => {
      data.value = value
    },
  })

  watch(
    error,
    (value) => {
      if (value) {
        apiError.value = 'Gagal memuat todo. Pastikan sudah login.'
      }
    },
    { immediate: true }
  )

  const setApiError = (message = '') => {
    apiError.value = message
  }

  const createTodo = async (payload: SaveTodoPayload) => {
    setApiError('')
    try {
      const created = await $fetch<TodoItem>('/api/todos', {
        method: 'POST',
        credentials: 'include',
        body: payload,
      })
      todos.value = [created, ...todos.value]
      return created
    } catch {
      setApiError('Gagal menyimpan todo. Pastikan sudah login.')
      return null
    }
  }

  const updateTodo = async (id: string, payload: SaveTodoPayload) => {
    setApiError('')
    try {
      const updated = await $fetch<TodoItem>(`/api/todos/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        body: payload,
      })
      todos.value = todos.value.map((todo) => (todo.id === id ? updated : todo))
      return updated
    } catch {
      setApiError('Gagal menyimpan todo. Pastikan sudah login.')
      return null
    }
  }

  const removeTodo = async (id: string) => {
    setApiError('')
    try {
      await $fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      todos.value = todos.value.filter((todo) => todo.id !== id)
      return true
    } catch {
      setApiError('Gagal menghapus todo.')
      return false
    }
  }

  const toggleCompleted = async (id: string) => {
    const todo = todos.value.find((item) => item.id === id)
    if (!todo) return false

    setApiError('')
    try {
      const updated = await $fetch<TodoItem>(`/api/todos/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        body: {
          completed: !todo.completed,
        },
      })
      todos.value = todos.value.map((item) => (item.id === id ? updated : item))
      return true
    } catch {
      setApiError('Gagal mengubah status todo.')
      return false
    }
  }

  return {
    todos,
    isLoading,
    apiError,
    setApiError,
    createTodo,
    updateTodo,
    removeTodo,
    toggleCompleted,
  }
}
