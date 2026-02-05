import type { Environment } from 'vitest/environments'
import nuxtEnvironment from '@nuxt/test-utils/vitest-environment'

const { transformMode: _transformMode, ...rest } = nuxtEnvironment as Environment & {
  transformMode?: 'ssr' | 'web'
}

export default {
  ...rest,
  // Vitest 4 replaces transformMode with viteEnvironment ("web" -> "client").
  viteEnvironment: 'client',
} satisfies Environment
