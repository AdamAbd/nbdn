<script setup lang="ts">
  import { useForm, Field as VeeField } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import { z } from 'zod'

  import { createTodoSchema, type TodoItem } from '~~/shared/schemas/todo'

  type SaveTodoPayload = {
    title: string
    description?: string
    jsonValue: TodoItem['jsonValue']
    photoUrl: string | null
  }

  const props = defineProps<{
    editingTodo: TodoItem | null
    createTodo: (payload: SaveTodoPayload) => Promise<TodoItem | null>
    updateTodo: (id: string, payload: SaveTodoPayload) => Promise<TodoItem | null>
    setApiError: (message?: string) => void
  }>()

  const emit = defineEmits<{
    (e: 'saved'): void
    (e: 'cancel-edit'): void
  }>()

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

  const isEditing = computed(() => Boolean(props.editingTodo))

  const resetForm = () => {
    resetVeeForm()
    if (fileInput.value) {
      fileInput.value.value = ''
    }
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

  const onSubmit = handleFormSubmit(async (values) => {
    isSaving.value = true
    props.setApiError('')

    try {
      const jsonValue = values.jsonText ? JSON.parse(values.jsonText) : null
      const payload = {
        title: values.title.trim(),
        description: values.description?.trim(),
        jsonValue,
        photoUrl: values.photoDataUrl ?? null,
      }

      const saved = props.editingTodo
        ? await props.updateTodo(props.editingTodo.id, payload)
        : await props.createTodo(payload)

      if (!saved) return

      resetForm()
      emit('saved')
    } catch {
      props.setApiError('Gagal memproses input todo.')
    } finally {
      isSaving.value = false
    }
  })

  const cancelEdit = () => {
    resetForm()
    emit('cancel-edit')
  }

  watch(
    () => props.editingTodo,
    (todo) => {
      if (!todo) {
        resetForm()
        return
      }

      setValues({
        title: todo.title,
        description: todo.description ?? '',
        jsonText: todo.jsonValue !== null ? JSON.stringify(todo.jsonValue, null, 2) : '',
        photoDataUrl: todo.photoUrl,
      })

      if (fileInput.value) {
        fileInput.value.value = ''
      }
    },
    { immediate: true }
  )
</script>

<template>
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

        <VeeField v-slot="{ componentField, errors }" name="description">
          <UiField :data-invalid="!!errors.length">
            <UiFieldLabel for="todo-description">Deskripsi</UiFieldLabel>
            <UiTextarea
              id="todo-description"
              v-bind="componentField"
              rows="3"
              placeholder="Catatan tambahan"
              :aria-invalid="!!errors.length"
            />
            <UiFieldError v-if="errors.length" :errors="errors" />
          </UiField>
        </VeeField>

        <VeeField v-slot="{ componentField, errors }" name="jsonText">
          <UiField :data-invalid="!!errors.length">
            <UiFieldLabel for="todo-json">Nilai JSON (opsional)</UiFieldLabel>
            <UiTextarea
              id="todo-json"
              v-bind="componentField"
              rows="4"
              placeholder='{"prioritas":"tinggi","label":["rumah","urgent"]}'
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
</template>
