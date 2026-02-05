import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import LoginPage from '../../app/pages/login.vue'

describe('login page', () => {
  it('renders the form and key fields', async () => {
    const wrapper = await mountSuspended(LoginPage)

    expect(wrapper.text()).toContain('Masuk ke Akun')
    expect(wrapper.get('form#login-form')).toBeTruthy()
    expect(wrapper.get('#login-form-email')).toBeTruthy()
    expect(wrapper.get('#login-form-password')).toBeTruthy()
  })

  it('links to the register page', async () => {
    const wrapper = await mountSuspended(LoginPage)
    const link = wrapper.getComponent({ name: 'NuxtLink' })

    expect(link.text()).toContain('Daftar sekarang')
    expect(link.props('to')).toBe('/register')
  })
})
