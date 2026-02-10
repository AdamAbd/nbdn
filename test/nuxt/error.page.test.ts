import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import type { NuxtError } from '#app'
import ErrorPage from '../../app/error.vue'

const { clearErrorMock } = vi.hoisted(() => ({
  clearErrorMock: vi.fn(),
}))

mockNuxtImport('clearError', () => clearErrorMock)

const UiButtonStub = {
  template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
  emits: ['click'],
}

const createError = (overrides: Partial<NuxtError> = {}): NuxtError =>
  ({
    statusCode: 500,
    status: 500,
    statusMessage: 'Internal Server Error',
    message: 'Unexpected failure',
    ...overrides,
  }) as NuxtError

describe('error page', () => {
  beforeEach(() => {
    clearErrorMock.mockReset()
  })

  it('renders friendly content for API/server 500 errors', async () => {
    const wrapper = await mountSuspended(ErrorPage, {
      props: {
        error: createError({
          statusCode: 500,
          message: 'Database connection timeout',
        }),
      },
      global: {
        stubs: { UiButton: UiButtonStub },
      },
    })

    expect(wrapper.text()).toContain('Error 500')
    expect(wrapper.text()).toContain('Terjadi gangguan server')
    expect(wrapper.text()).toContain(
      'Server sedang bermasalah atau API gagal merespons. Silakan coba lagi beberapa saat.'
    )
    expect(wrapper.text()).toContain('Database connection timeout')
  })

  it('renders navigation failure message even when Nuxt returns status 500', async () => {
    const wrapper = await mountSuspended(ErrorPage, {
      props: {
        error: createError({
          statusCode: 500,
          status: 500,
          statusMessage: 'Internal Server Error',
          message: 'Navigation aborted by middleware',
        }),
      },
      global: {
        stubs: { UiButton: UiButtonStub },
      },
    })

    expect(wrapper.text()).toContain('Error 500')
    expect(wrapper.text()).toContain('Navigasi gagal')
    expect(wrapper.text()).toContain('Permintaan pindah halaman gagal diproses. Silakan coba lagi.')
  })

  it('retries when user clicks Coba lagi', async () => {
    const wrapper = await mountSuspended(ErrorPage, {
      props: {
        error: createError(),
      },
      global: {
        stubs: { UiButton: UiButtonStub },
      },
    })

    const retryButton = wrapper.findAll('button').find((button) => button.text().includes('Coba lagi'))

    expect(retryButton).toBeTruthy()

    await retryButton!.trigger('click')

    expect(clearErrorMock).toHaveBeenCalledTimes(1)
    expect(clearErrorMock).toHaveBeenCalledWith()
  })

  it('redirects home when user clicks Kembali ke beranda', async () => {
    const wrapper = await mountSuspended(ErrorPage, {
      props: {
        error: createError(),
      },
      global: {
        stubs: { UiButton: UiButtonStub },
      },
    })

    const homeButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Kembali ke beranda'))

    expect(homeButton).toBeTruthy()

    await homeButton!.trigger('click')

    expect(clearErrorMock).toHaveBeenCalledTimes(1)
    expect(clearErrorMock).toHaveBeenCalledWith({ redirect: '/' })
  })
})
