import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import IndexPage from '../../app/pages/index.vue'

const UiButtonStub = {
  template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
  emits: ['click'],
}

const stubs = {
  UiCard: { template: '<div><slot /></div>' },
  UiCardHeader: { template: '<div><slot /></div>' },
  UiCardTitle: { template: '<div><slot /></div>' },
  UiCardDescription: { template: '<div><slot /></div>' },
  UiCardContent: { template: '<div><slot /></div>' },
  UiLabel: { template: '<label v-bind="$attrs"><slot /></label>' },
  UiInput: { template: '<input v-bind="$attrs" />' },
  UiButton: UiButtonStub,
}

describe('index page', () => {
  it('renders heading and empty state', async () => {
    const wrapper = await mountSuspended(IndexPage, {
      global: { stubs },
    })

    expect(wrapper.text()).toContain('Simple CRUD Todo')
    expect(wrapper.text()).toContain('Belum ada todo')
    expect(wrapper.text()).toContain('Total: 0')
    expect(wrapper.text()).toContain('Selesai: 0')
  })

  it('renders form fields', async () => {
    const wrapper = await mountSuspended(IndexPage, {
      global: { stubs },
    })

    expect(wrapper.get('form')).toBeTruthy()
    expect(wrapper.get('#todo-title')).toBeTruthy()
    expect(wrapper.get('#todo-description')).toBeTruthy()
    expect(wrapper.get('#todo-json')).toBeTruthy()
    expect(wrapper.get('#todo-photo')).toBeTruthy()
  })
})
