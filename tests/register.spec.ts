import { expect, test } from '@nuxt/test-utils/playwright'

test.describe('Register page', () => {
  test('renders register form', async ({ page, goto }) => {
    await goto('/register', { waitUntil: 'hydration' })

    await expect(page.getByRole('heading', { name: 'Buat Akun Baru' })).toBeVisible()
    await expect(page.locator('#register-form-email')).toBeVisible()
    await expect(page.locator('#register-form-password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Daftar' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Masuk sekarang' })).toHaveAttribute(
      'href',
      '/login'
    )
  })

  test('submits valid data and enters loading state', async ({ page, goto }) => {
    await goto('/register', { waitUntil: 'hydration' })

    await page.locator('#register-form-email').fill('user@example.com')
    await page.locator('#register-form-password').fill('password123')

    const submitButton = page.getByRole('button', { name: 'Daftar' })
    await expect(submitButton).toBeEnabled()
    await submitButton.click()
    await expect(submitButton).toBeDisabled()
  })
})
