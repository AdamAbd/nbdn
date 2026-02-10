import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import NotFoundPage from '../../app/pages/[...slug].vue'

const { backMock, replaceMock } = vi.hoisted(() => ({
  backMock: vi.fn(),
  replaceMock: vi.fn(async () => undefined),
}))

mockNuxtImport('useRouter', () => () => ({
  back: backMock,
  replace: replaceMock,
  resolve: (to: string) => ({ href: to }),
}))

mockNuxtImport('useRoute', () => () => ({
  path: '/halaman-tidak-ada',
}))

mockNuxtImport('useRequestEvent', () => () => undefined)

const UiButtonStub = {
  template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
  emits: ['click'],
}

describe('not found page', () => {
  beforeEach(() => {
    backMock.mockReset()
    replaceMock.mockReset()
  })

  it('renders custom 404 content', async () => {
    const wrapper = await mountSuspended(NotFoundPage, {
      global: {
        stubs: { UiButton: UiButtonStub },
      },
    })

    expect(wrapper.text()).toContain('Error 404')
    expect(wrapper.text()).toContain('Halaman tidak ditemukan')
    expect(wrapper.text()).toContain('/halaman-tidak-ada')

    const homeLink = wrapper.getComponent({ name: 'NuxtLink' })
    expect(homeLink.props('to')).toBe('/')
  })

  it('navigates back when clicking Halaman sebelumnya', async () => {
    const wrapper = await mountSuspended(NotFoundPage, {
      global: {
        stubs: { UiButton: UiButtonStub },
      },
    })

    const backButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Halaman sebelumnya'))

    expect(backButton).toBeTruthy()

    await backButton!.trigger('click')

    expect(backMock).toHaveBeenCalledTimes(1)
  })
})
