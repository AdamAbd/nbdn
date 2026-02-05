<script setup lang="ts">
  import type { TodoItem } from '~/lib/types'

  defineProps<{
    todo: TodoItem
  }>()

  const emit = defineEmits<{
    (e: 'toggle', id: string): void
    (e: 'edit', todo: TodoItem): void
    (e: 'remove', id: string): void
  }>()

  const formatDate = (iso: string) => new Date(iso).toLocaleString('id-ID')
</script>

<template>
  <div class="bg-background space-y-3 rounded-lg border p-4 shadow-sm">
    <div v-if="todo.photoUrl" class="overflow-hidden rounded-md border">
      <img :src="todo.photoUrl" alt="Foto todo" class="h-40 w-full object-cover" />
    </div>

    <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div class="space-y-2">
        <div class="flex items-start gap-2">
          <input
            :id="`todo-${todo.id}`"
            type="checkbox"
            :checked="todo.completed"
            class="accent-primary mt-1 size-4"
            @change="emit('toggle', todo.id)"
          />
          <div>
            <label
              :for="`todo-${todo.id}`"
              :class="[
                'text-lg font-semibold',
                todo.completed ? 'text-muted-foreground line-through' : 'text-foreground',
              ]"
            >
              {{ todo.title }}
            </label>
            <p v-if="todo.description" class="text-muted-foreground text-sm">
              {{ todo.description }}
            </p>
          </div>
        </div>
        <div class="text-muted-foreground text-xs">
          Dibuat: {{ formatDate(todo.createdAt) }}
          <span v-if="todo.updatedAt">• Diubah: {{ formatDate(todo.updatedAt) }}</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <UiButton variant="outline" size="sm" @click="emit('edit', todo)"> Edit </UiButton>
        <UiButton variant="destructive" size="sm" @click="emit('remove', todo.id)">
          Hapus
        </UiButton>
      </div>
    </div>

    <div v-if="todo.jsonValue !== null" class="bg-muted/40 rounded-md p-3 text-xs">
      <div class="text-muted-foreground mb-2">Nilai JSON</div>
      <pre class="text-foreground wrap-break-word whitespace-pre-wrap">{{
        JSON.stringify(todo.jsonValue, null, 2)
      }}</pre>
    </div>
  </div>
</template>
