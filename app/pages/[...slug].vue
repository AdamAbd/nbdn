<script setup lang="ts">
  const route = useRoute()
  const router = useRouter()
  const event = useRequestEvent()

  if (event) {
    setResponseStatus(event, 404, 'Halaman tidak ditemukan')
  }

  useHead({
    title: '404 - Halaman tidak ditemukan',
  })

  const goBack = () => {
    router.back()
  }
</script>

<template>
  <main class="bg-background flex min-h-screen items-center justify-center px-4 py-16">
    <section class="bg-card w-full max-w-xl space-y-6 rounded-xl border p-8 text-center shadow-sm">
      <p class="text-muted-foreground text-sm font-semibold">Error 404</p>

      <div class="space-y-2">
        <h1 class="text-2xl font-semibold tracking-tight">Halaman tidak ditemukan</h1>
        <p class="text-muted-foreground">
          Maaf, halaman dengan URL
          <span class="text-foreground font-medium">{{ route.path }}</span>
          tidak tersedia atau sudah dipindahkan.
        </p>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <NuxtLink to="/" class="w-full sm:w-auto">
          <UiButton class="w-full sm:w-auto">Kembali ke beranda</UiButton>
        </NuxtLink>
        <UiButton type="button" variant="outline" class="w-full sm:w-auto" @click="goBack">
          Halaman sebelumnya
        </UiButton>
      </div>
    </section>
  </main>
</template>
