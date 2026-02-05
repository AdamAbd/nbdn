<script setup lang="ts">
  import { useForm, Field as VeeField } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import { z } from 'zod'
  import { Loader2 } from 'lucide-vue-next'
  import { authClient } from '@/lib/auth-client'

  definePageMeta({
    layout: 'default',
  })

  const isLoading = ref(false)
  const formError = ref<string | null>(null)
  const router = useRouter()

  const formSchema = toTypedSchema(
    z.object({
      email: z.string().email({ message: 'Email tidak valid' }),
      password: z.string().min(8, { message: 'Password minimal 8 karakter' }),
    })
  )

  const { handleSubmit } = useForm({
    validationSchema: formSchema,
    initialValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    isLoading.value = true
    formError.value = null
    try {
      const { error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      })

      if (error) {
        formError.value = error.message ?? 'Email atau password salah'
        return
      }

      await router.push('/')
    } catch (error) {
      formError.value = error instanceof Error ? error.message : 'Gagal masuk. Coba lagi.'
    } finally {
      isLoading.value = false
    }
  })
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50/50 p-4 dark:bg-gray-900/50">
    <UiCard class="w-full max-w-md border-0 shadow-xl sm:border sm:shadow-sm">
      <UiCardHeader class="space-y-1 text-center">
        <UiCardTitle class="text-2xl font-bold tracking-tight"> Masuk ke Akun </UiCardTitle>
        <UiCardDescription> Masukkan email dan password untuk melanjutkan </UiCardDescription>
      </UiCardHeader>
      <UiCardContent class="space-y-4">
        <form id="login-form" class="space-y-4" @submit="onSubmit">
          <UiFieldGroup>
            <VeeField v-slot="{ field, errors }" name="email">
              <UiField :data-invalid="!!errors.length">
                <UiFieldLabel for="login-form-email">Email</UiFieldLabel>
                <UiInput
                  id="login-form-email"
                  type="email"
                  :model-value="field.value"
                  placeholder="nama@email.com"
                  autocomplete="email"
                  :aria-invalid="!!errors.length"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                />
                <UiFieldError v-if="errors.length" :errors="errors" />
              </UiField>
            </VeeField>

            <VeeField v-slot="{ field, errors }" name="password">
              <UiField :data-invalid="!!errors.length">
                <UiFieldLabel for="login-form-password">Password</UiFieldLabel>
                <UiInput
                  id="login-form-password"
                  type="password"
                  :model-value="field.value"
                  placeholder="••••••••"
                  autocomplete="current-password"
                  :aria-invalid="!!errors.length"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                />
                <UiFieldError v-if="errors.length" :errors="errors" />
              </UiField>
            </VeeField>
          </UiFieldGroup>

          <p v-if="formError" class="text-sm text-red-600">
            {{ formError }}
          </p>

          <UiButton type="submit" form="login-form" class="w-full" :disabled="isLoading">
            <Loader2 v-if="isLoading" class="animate-spin" />
            Masuk
          </UiButton>
        </form>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t" />
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-background text-muted-foreground px-2"> Atau lanjutkan dengan </span>
          </div>
        </div>

        <UiButton variant="outline" class="w-full" type="button">
          <svg class="size-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </UiButton>
      </UiCardContent>
      <UiCardFooter class="flex justify-center">
        <p class="text-muted-foreground text-sm">
          Belum punya akun?
          <NuxtLink to="/register" class="text-primary font-medium hover:underline">
            Daftar sekarang
          </NuxtLink>
        </p>
      </UiCardFooter>
    </UiCard>
  </div>
</template>
