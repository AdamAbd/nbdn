import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { TodoItem } from '../../app/lib/types'
import TodoCard from '../../app/components/app/TodoCard.vue'

const UiButtonStub = {
  template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
  emits: ['click'],
}

const baseTodo: TodoItem = {
  id: 'todo-1',
  title: 'Belanja mingguan',
  description: 'Beli sayur dan buah',
  jsonValue: { prioritas: 'tinggi' },
  photoUrl: 'https://example.com/todo.jpg',
  completed: false,
  createdAt: '2024-01-01T10:00:00.000Z',
  updatedAt: null,
}

describe('TodoCard component', () => {
  it('renders todo details', async () => {
    const wrapper = await mountSuspended(TodoCard, {
      props: { todo: baseTodo },
      global: { stubs: { UiButton: UiButtonStub } },
    })

    expect(wrapper.text()).toContain(baseTodo.title)
    expect(wrapper.text()).toContain(baseTodo.description)
    expect(wrapper.text()).toContain('Dibuat:')
    expect(wrapper.text()).toContain('Nilai JSON')
    expect(wrapper.text()).toContain('prioritas')

    const image = wrapper.get('img[alt="Foto todo"]')
    expect(image.attributes('src')).toBe(baseTodo.photoUrl)
  })

  it('emits toggle, edit, and remove events', async () => {
    const wrapper = await mountSuspended(TodoCard, {
      props: { todo: baseTodo },
      global: { stubs: { UiButton: UiButtonStub } },
    })

    await wrapper.get('input[type="checkbox"]').trigger('change')

    const buttons = wrapper.findAll('button')
    const editButton = buttons.find((button) => button.text() === 'Edit')
    const removeButton = buttons.find((button) => button.text() === 'Hapus')

    expect(editButton).toBeTruthy()
    expect(removeButton).toBeTruthy()

    await editButton!.trigger('click')
    await removeButton!.trigger('click')

    expect(wrapper.emitted('toggle')?.[0]).toEqual([baseTodo.id])
    expect(wrapper.emitted('edit')?.[0]).toEqual([baseTodo])
    expect(wrapper.emitted('remove')?.[0]).toEqual([baseTodo.id])
  })
})
