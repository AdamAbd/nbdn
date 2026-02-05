<script setup lang="ts">
  import type { TodoItem } from '~/lib/types'

  definePageMeta({
    layout: 'default',
  })

  const todos = ref<TodoItem[]>([])
  const editingId = ref<string | null>(null)
  const titleError = ref('')
  const jsonError = ref('')
  const fileInput = ref<HTMLInputElement | null>(null)

  const form = reactive({
    title: '',
    description: '',
    jsonText: '',
    photoDataUrl: null as string | null,
  })

  const isEditing = computed(() => editingId.value !== null)
  const totalDone = computed(() => todos.value.filter((todo) => todo.completed).length)

  const nowIso = () => new Date().toISOString()

  const resetForm = () => {
    form.title = ''
    form.description = ''
    form.jsonText = ''
    form.photoDataUrl = null
    editingId.value = null
    titleError.value = ''
    jsonError.value = ''
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }

  const validateTitle = () => {
    if (!form.title.trim()) {
      titleError.value = 'Judul wajib diisi.'
      return false
    }
    titleError.value = ''
    return true
  }

  const parseJson = () => {
    const raw = form.jsonText.trim()
    if (!raw) {
      jsonError.value = ''
      return null
    }
    try {
      const parsed = JSON.parse(raw)
      jsonError.value = ''
      return parsed
    } catch {
      jsonError.value = 'JSON tidak valid. Contoh: {"prioritas":"tinggi"}'
      return null
    }
  }

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) {
      form.photoDataUrl = null
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      form.photoDataUrl = typeof reader.result === 'string' ? reader.result : null
    }
    reader.readAsDataURL(file)
  }

  const clearPhoto = () => {
    form.photoDataUrl = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }

  const handleSubmit = () => {
    const titleOk = validateTitle()
    const jsonValue = parseJson()
    if (!titleOk || jsonError.value) {
      return
    }

    if (editingId.value) {
      const index = todos.value.findIndex((todo) => todo.id === editingId.value)
      const current = todos.value[index]
      if (current) {
        todos.value[index] = {
          ...current,
          title: form.title.trim(),
          description: form.description.trim(),
          jsonValue,
          photoUrl: form.photoDataUrl,
          updatedAt: nowIso(),
        }
      }
    } else {
      todos.value.unshift({
        id: `todo-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title: form.title.trim(),
        description: form.description.trim(),
        jsonValue,
        photoUrl: form.photoDataUrl,
        completed: false,
        createdAt: nowIso(),
        updatedAt: null,
      })
    }

    resetForm()
  }

  const startEdit = (todo: TodoItem) => {
    editingId.value = todo.id
    form.title = todo.title
    form.description = todo.description
    form.jsonText = todo.jsonValue !== null ? JSON.stringify(todo.jsonValue, null, 2) : ''
    form.photoDataUrl = todo.photoUrl
    titleError.value = ''
    jsonError.value = ''
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }

  const cancelEdit = () => {
    resetForm()
  }

  const removeTodo = (id: string) => {
    todos.value = todos.value.filter((todo) => todo.id !== id)
    if (editingId.value === id) {
      resetForm()
    }
  }

  const toggleCompleted = (id: string) => {
    const todo = todos.value.find((item) => item.id === id)
    if (!todo) return
    todo.completed = !todo.completed
    todo.updatedAt = nowIso()
  }

  watch(
    () => form.title,
    () => {
      if (titleError.value) {
        validateTitle()
      }
    }
  )

  watch(
    () => form.jsonText,
    () => {
      if (jsonError.value) {
        parseJson()
      }
    }
  )
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

      <div class="grid gap-6 lg:grid-cols-[380px,1fr]">
        <UiCard class="border-0 shadow-md sm:border sm:shadow-sm">
          <UiCardHeader class="space-y-1">
            <UiCardTitle class="text-xl font-semibold">
              {{ isEditing ? 'Edit Todo' : 'Tambah Todo' }}
            </UiCardTitle>
            <UiCardDescription> Isi judul, deskripsi, JSON opsional, dan foto. </UiCardDescription>
          </UiCardHeader>
          <UiCardContent>
            <form class="space-y-4" @submit.prevent="handleSubmit">
              <div class="space-y-2">
                <UiLabel for="todo-title">Judul</UiLabel>
                <UiInput
                  id="todo-title"
                  v-model="form.title"
                  type="text"
                  placeholder="Contoh: Belanja mingguan"
                />
                <p v-if="titleError" class="text-destructive text-xs">{{ titleError }}</p>
              </div>

              <div class="space-y-2">
                <UiLabel for="todo-description">Deskripsi</UiLabel>
                <textarea
                  id="todo-description"
                  v-model="form.description"
                  rows="3"
                  placeholder="Catatan tambahan"
                  class="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                />
              </div>

              <div class="space-y-2">
                <UiLabel for="todo-json">Nilai JSON (opsional)</UiLabel>
                <textarea
                  id="todo-json"
                  v-model="form.jsonText"
                  rows="4"
                  placeholder='{"prioritas":"tinggi","label":["rumah","urgent"]}'
                  class="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                />
                <p v-if="jsonError" class="text-destructive text-xs">{{ jsonError }}</p>
              </div>

              <div class="space-y-2">
                <UiLabel for="todo-photo">Upload Foto (opsional)</UiLabel>
                <input
                  id="todo-photo"
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="border-input file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 file:bg-muted w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none file:mr-3 file:rounded-md file:border-0 file:px-3 file:py-1.5 file:text-xs focus-visible:ring-[3px]"
                  @change="handleFileChange"
                >
                <div v-if="form.photoDataUrl" class="space-y-2">
                  <img
                    :src="form.photoDataUrl"
                    alt="Preview foto todo"
                    class="h-36 w-full rounded-md object-cover"
                  >
                  <UiButton
                    type="button"
                    variant="outline"
                    size="sm"
                    class="w-full"
                    @click="clearPhoto"
                  >
                    Hapus Foto
                  </UiButton>
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <UiButton type="submit" class="w-full">
                  {{ isEditing ? 'Simpan Perubahan' : 'Tambah Todo' }}
                </UiButton>
                <UiButton
                  v-if="isEditing"
                  type="button"
                  variant="ghost"
                  class="w-full"
                  @click="cancelEdit"
                >
                  Batal
                </UiButton>
              </div>
            </form>
          </UiCardContent>
        </UiCard>

        <div class="space-y-1">
          <div class="text-xl font-semibold">Daftar Todo</div>
          <span> Lihat, update status, edit, atau hapus todo di sini. </span>
        </div>
        <div>
          <div v-if="!todos.length" class="text-muted-foreground text-sm">
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
