import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import RegisterPage from '../../app/pages/register.vue'

describe('register page', () => {
  it('renders the form and key fields', async () => {
    const wrapper = await mountSuspended(RegisterPage)

    expect(wrapper.text()).toContain('Buat Akun Baru')
    expect(wrapper.get('form#register-form')).toBeTruthy()
    expect(wrapper.get('#register-form-email')).toBeTruthy()
    expect(wrapper.get('#register-form-password')).toBeTruthy()
  })

  it('links to the login page', async () => {
    const wrapper = await mountSuspended(RegisterPage)
    const link = wrapper.getComponent({ name: 'NuxtLink' })

    expect(link.text()).toContain('Masuk sekarang')
    expect(link.props('to')).toBe('/login')
  })
})
