<script setup lang="ts">
  import { useForm, Field as VeeField } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import { z } from 'zod'

  import { createTodoSchema, type TodoItem } from '~~/shared/schemas/todo'

  definePageMeta({
    layout: 'default',
  })

  const todos = ref<TodoItem[]>([])
  const editingId = ref<string | null>(null)
  const apiError = ref('')
  const isLoading = ref(true)
  const isSaving = ref(false)
  const fileInput = ref<HTMLInputElement | null>(null)

  const formSchema = toTypedSchema(
    z.object({
      title: createTodoSchema.shape.title,
      description: createTodoSchema.shape.description,
      jsonText: z
        .string()
        .optional()
        .transform((val) => val || '')
        .refine(
          (val) => {
            if (!val.trim()) return true
            try {
              JSON.parse(val)
              return true
            } catch {
              return false
            }
          },
          { message: 'JSON tidak valid. Contoh: {"prioritas":"tinggi"}' }
        ),
      photoDataUrl: z.string().nullable().optional(),
    })
  )

  const {
    handleSubmit: handleFormSubmit,
    setValues,
    resetForm: resetVeeForm,
    values: formValues,
    setFieldValue,
  } = useForm({
    validationSchema: formSchema,
    initialValues: {
      title: '',
      description: '',
      jsonText: '',
      photoDataUrl: null,
    },
  })

  const isEditing = computed(() => editingId.value !== null)
  const totalDone = computed(() => todos.value.filter((todo) => todo.completed).length)

  const resetForm = () => {
    resetVeeForm()
    editingId.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }

  const setApiError = (message = '') => {
    apiError.value = message
  }

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) {
      setFieldValue('photoDataUrl', null)
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setFieldValue('photoDataUrl', typeof reader.result === 'string' ? reader.result : null)
    }
    reader.readAsDataURL(file)
  }

  const clearPhoto = () => {
    setFieldValue('photoDataUrl', null)
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }

  const fetchTodos = async () => {
    isLoading.value = true
    setApiError('')
    try {
      const data = await $fetch<TodoItem[]>('/api/todos', {
        credentials: 'include',
      })
      todos.value = data
    } catch {
      setApiError('Gagal memuat todo. Pastikan sudah login.')
    } finally {
      isLoading.value = false
    }
  }

  const onSubmit = handleFormSubmit(async (values) => {
    isSaving.value = true
    setApiError('')

    const jsonValue = values.jsonText ? JSON.parse(values.jsonText) : null

    try {
      if (editingId.value) {
        const updated = await $fetch<TodoItem>(`/api/todos/${editingId.value}`, {
          method: 'PATCH',
          credentials: 'include',
          body: {
            title: values.title.trim(),
            description: values.description?.trim(),
            jsonValue,
            photoUrl: values.photoDataUrl,
          },
        })
        const index = todos.value.findIndex((todo) => todo.id === editingId.value)
        if (index !== -1) {
          todos.value[index] = updated
        }
      } else {
        const created = await $fetch<TodoItem>('/api/todos', {
          method: 'POST',
          credentials: 'include',
          body: {
            title: values.title.trim(),
            description: values.description?.trim(),
            jsonValue,
            photoUrl: values.photoDataUrl,
          },
        })
        todos.value.unshift(created)
      }

      resetForm()
    } catch {
      setApiError('Gagal menyimpan todo. Pastikan sudah login.')
    } finally {
      isSaving.value = false
    }
  })

  const startEdit = (todo: TodoItem) => {
    editingId.value = todo.id
    setValues({
      title: todo.title,
      description: todo.description ?? '',
      jsonText: todo.jsonValue !== null ? JSON.stringify(todo.jsonValue, null, 2) : '',
      photoDataUrl: todo.photoUrl,
    })
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }

  const cancelEdit = () => {
    resetForm()
  }

  const removeTodo = async (id: string) => {
    setApiError('')
    try {
      await $fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      todos.value = todos.value.filter((todo) => todo.id !== id)
      if (editingId.value === id) {
        resetForm()
      }
    } catch {
      setApiError('Gagal menghapus todo.')
    }
  }

  const toggleCompleted = async (id: string) => {
    const todo = todos.value.find((item) => item.id === id)
    if (!todo) return
    setApiError('')
    try {
      const updated = await $fetch<TodoItem>(`/api/todos/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        body: {
          completed: !todo.completed,
        },
      })
      const index = todos.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        todos.value[index] = updated
      }
    } catch {
      setApiError('Gagal mengubah status todo.')
    }
  }

  onMounted(() => {
    fetchTodos()
  })
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
        <UiCard class="border-0 shadow-md sm:border sm:shadow-sm">
          <UiCardHeader class="space-y-1">
            <UiCardTitle class="text-xl font-semibold">
              {{ isEditing ? 'Edit Todo' : 'Tambah Todo' }}
            </UiCardTitle>
            <UiCardDescription> Isi judul, deskripsi, JSON opsional, dan foto. </UiCardDescription>
          </UiCardHeader>
          <UiCardContent>
            <form id="todo-form" class="space-y-4" @submit="onSubmit">
              <VeeField v-slot="{ componentField, errors }" name="title">
                <UiField :data-invalid="!!errors.length">
                  <UiFieldLabel for="todo-title">Judul</UiFieldLabel>
                  <UiInput
                    id="todo-title"
                    v-bind="componentField"
                    type="text"
                    placeholder="Contoh: Belanja mingguan"
                    :aria-invalid="!!errors.length"
                  />
                  <UiFieldError v-if="errors.length" :errors="errors" />
                </UiField>
              </VeeField>

              <VeeField v-slot="{ field, errors }" name="description">
                <UiField :data-invalid="!!errors.length">
                  <UiFieldLabel for="todo-description">Deskripsi</UiFieldLabel>
                  <textarea
                    id="todo-description"
                    v-bind="field"
                    rows="3"
                    placeholder="Catatan tambahan"
                    class="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                    :aria-invalid="!!errors.length"
                  />
                  <UiFieldError v-if="errors.length" :errors="errors" />
                </UiField>
              </VeeField>

              <VeeField v-slot="{ field, errors }" name="jsonText">
                <UiField :data-invalid="!!errors.length">
                  <UiFieldLabel for="todo-json">Nilai JSON (opsional)</UiFieldLabel>
                  <textarea
                    id="todo-json"
                    v-bind="field"
                    rows="4"
                    placeholder='{"prioritas":"tinggi","label":["rumah","urgent"]}'
                    class="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                    :aria-invalid="!!errors.length"
                  />
                  <UiFieldError v-if="errors.length" :errors="errors" />
                </UiField>
              </VeeField>

              <div class="space-y-2">
                <UiLabel for="todo-photo">Upload Foto (opsional)</UiLabel>
                <input
                  id="todo-photo"
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="border-input file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 file:bg-muted w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none file:mr-3 file:rounded-md file:border-0 file:px-3 file:py-1.5 file:text-xs focus-visible:ring-[3px]"
                  @change="handleFileChange"
                />
                <div v-if="formValues.photoDataUrl" class="space-y-2">
                  <img
                    :src="formValues.photoDataUrl"
                    alt="Preview foto todo"
                    class="h-36 w-full rounded-md object-cover"
                  />
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
                <UiButton type="submit" form="todo-form" class="w-full" :disabled="isSaving">
                  {{ isSaving ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Tambah Todo' }}
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
