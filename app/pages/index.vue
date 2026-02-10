<script setup lang="ts">
  import type { TodoItem } from '~~/shared/schemas/todo'
  import { useTodos } from '@/composables/useTodos'

  definePageMeta({
    layout: 'default',
    middleware: ['auth'],
  })

  const {
    todos,
    isLoading,
    apiError,
    setApiError,
    createTodo,
    updateTodo,
    removeTodo: deleteTodo,
    toggleCompleted,
  } = useTodos()

  const editingTodo = ref<TodoItem | null>(null)
  const totalDone = computed(() => todos.value.filter((todo) => todo.completed).length)

  const startEdit = (todo: TodoItem) => {
    editingTodo.value = todo
  }

  const stopEdit = () => {
    editingTodo.value = null
  }

  const removeTodo = async (id: string) => {
    const isRemoved = await deleteTodo(id)
    if (!isRemoved) return
    if (editingTodo.value?.id === id) {
      stopEdit()
    }
  }
</script>

<template>
  <div class="min-h-screen bg-gray-50/50 p-6 dark:bg-gray-900/50">
    <div class="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Simple CRUD Todo</h1>
          <p class="text-muted-foreground text-sm">
            Kelola todo dengan foto dan nilai JSON secara cepat.
          </p>
        </div>
        <div class="text-muted-foreground text-sm">
          Total: {{ todos.length }} • Selesai: {{ totalDone }}
        </div>
      </div>
      <p v-if="apiError" class="text-destructive text-sm">
        {{ apiError }}
      </p>

      <div class="grid gap-6 lg:grid-cols-[380px,1fr]">
        <AppTodoForm
          :editing-todo="editingTodo"
          :create-todo="createTodo"
          :update-todo="updateTodo"
          :set-api-error="setApiError"
          @saved="stopEdit"
          @cancel-edit="stopEdit"
        />

        <div class="space-y-1">
          <div class="text-xl font-semibold">Daftar Todo</div>
          <span> Lihat, update status, edit, atau hapus todo di sini. </span>
        </div>
        <div>
          <div v-if="isLoading" class="text-muted-foreground text-sm">Memuat todo...</div>
          <div v-else-if="!todos.length" class="text-muted-foreground text-sm">
            Belum ada todo. Tambahkan todo baru di panel kiri.
          </div>
          <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AppTodoCard
              v-for="todo in todos"
              :key="todo.id"
              :todo="todo"
              @toggle="toggleCompleted"
              @edit="startEdit"
              @remove="removeTodo"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
