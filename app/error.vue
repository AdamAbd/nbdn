<script setup lang="ts">
  import type { NuxtError } from '#app'

  const props = defineProps<{ error: NuxtError }>()

  const statusCode = computed(() => props.error?.status ?? props.error?.status ?? 500)
  const normalizedErrorText = computed(() =>
    `${props.error?.message ?? ''} ${props.error?.message ?? ''}`.toLowerCase()
  )
  const isNavigationFailure = computed(() =>
    ['navigation', 'navigasi', 'aborted', 'cancelled'].some((keyword) =>
      normalizedErrorText.value.includes(keyword)
    )
  )

  const title = computed(() => {
    if (statusCode.value === 404) {
      return 'Halaman tidak ditemukan'
    }

    if (isNavigationFailure.value) {
      return 'Navigasi gagal'
    }

    if (statusCode.value >= 500) {
      return 'Terjadi gangguan server'
    }

    return 'Terjadi kesalahan saat membuka halaman'
  })

  const message = computed(() => {
    if (isNavigationFailure.value) {
      return 'Permintaan pindah halaman gagal diproses. Silakan coba lagi.'
    }

    if (statusCode.value >= 500) {
      return 'Server sedang bermasalah atau API gagal merespons. Silakan coba lagi beberapa saat.'
    }

    if (props.error?.message) {
      return props.error.message
    }

    if (props.error?.message) {
      return props.error.message
    }

    return 'Navigasi gagal diproses. Silakan coba lagi.'
  })

  const detailMessage = computed(() => {
    const detail = props.error?.message?.trim()
    return detail && detail !== message.value ? detail : ''
  })

  useHead(() => ({
    title: `${statusCode.value} - ${title.value}`,
  }))

  const retry = () => {
    clearError()
  }

  const goHome = () => {
    clearError({ redirect: '/' })
  }
</script>

<template>
  <main class="bg-background flex min-h-screen items-center justify-center px-4 py-16">
    <section class="bg-card w-full max-w-lg space-y-6 rounded-xl border p-8 text-center shadow-sm">
      <p class="text-muted-foreground text-sm font-semibold">Error {{ statusCode }}</p>

      <div class="space-y-2">
        <h1 class="text-2xl font-semibold tracking-tight">
          {{ title }}
        </h1>
        <p class="text-muted-foreground">
          {{ message }}
        </p>
        <p v-if="detailMessage" class="text-muted-foreground text-sm">
          {{ detailMessage }}
        </p>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <UiButton type="button" class="w-full sm:w-auto" @click="retry"> Coba lagi </UiButton>
        <UiButton type="button" variant="outline" class="w-full sm:w-auto" @click="goHome">
          Kembali ke beranda
        </UiButton>
      </div>
    </section>
  </main>
</template>
