import { expect, test } from '@nuxt/test-utils/playwright'

test.describe('Login page', () => {
  test('renders login form', async ({ page, goto }) => {
    await goto('/login', { waitUntil: 'hydration' })

    await expect(page.getByRole('heading', { name: 'Masuk ke Akun' })).toBeVisible()
    await expect(page.locator('#login-form-email')).toBeVisible()
    await expect(page.locator('#login-form-password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Masuk' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Daftar sekarang' })).toHaveAttribute(
      'href',
      '/register'
    )
  })

  test('shows validation errors on invalid submit', async ({ page, goto }) => {
    await goto('/login', { waitUntil: 'hydration' })

    await page.locator('#login-form-email').fill('not-an-email')
    await page.locator('#login-form-password').fill('123')
    await page.getByRole('button', { name: 'Masuk' }).click()

    await expect(page.getByText('Email tidak valid')).toBeVisible()
    await expect(page.getByText('Password minimal 8 karakter')).toBeVisible()
  })
})
