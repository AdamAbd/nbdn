<script setup lang="ts">
  import { authClient } from '@/lib/auth-client'

  const sessionState = authClient.useSession()
  const session = computed(() => sessionState.value.data)
  const isSessionPending = computed(() => sessionState.value.isPending)
  const router = useRouter()
  const isLoggingOut = ref(false)

  const handleLogout = async () => {
    isLoggingOut.value = true
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/login')
          },
        },
      })
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      isLoggingOut.value = false
    }
  }
</script>

<template>
  <div class="bg-background min-h-screen font-sans antialiased">
    <!-- Header -->
    <header
      class="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur"
    >
      <div class="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <div class="flex items-center gap-2">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <span class="text-primary text-xl font-bold tracking-tight">NBDN Todo</span>
          </NuxtLink>
        </div>

        <nav class="flex items-center gap-4">
          <template v-if="isSessionPending">
            <div class="hidden items-center gap-2 sm:flex">
              <div class="flex flex-col items-end gap-1">
                <UiSkeleton class="h-4 w-28" />
                <UiSkeleton class="h-3 w-36" />
              </div>
            </div>
            <UiSkeleton class="h-8 w-20" />
          </template>
          <template v-else-if="session">
            <div class="hidden items-center gap-2 sm:flex">
              <div class="flex flex-col items-end">
                <p class="text-sm leading-none font-medium">{{ session.user.name }}</p>
                <p class="text-muted-foreground text-xs">{{ session.user.email }}</p>
              </div>
            </div>
            <UiButton variant="outline" size="sm" :disabled="isLoggingOut" @click="handleLogout">
              <template v-if="isLoggingOut"> Keluar... </template>
              <template v-else> Keluar </template>
            </UiButton>
          </template>
          <template v-else>
            <NuxtLink to="/login">
              <UiButton variant="ghost" size="sm"> Masuk </UiButton>
            </NuxtLink>
            <NuxtLink to="/register">
              <UiButton size="sm"> Daftar </UiButton>
            </NuxtLink>
          </template>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer (Optional) -->
    <footer class="border-t py-6 md:px-8 md:py-0">
      <div
        class="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row"
      >
        <p class="text-muted-foreground text-center text-sm leading-loose md:text-left">
          &copy; {{ new Date().getFullYear() }} NBDN Todo. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>
