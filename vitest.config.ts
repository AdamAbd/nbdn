import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

const nuxtProject = await defineVitestProject({
  test: {
    name: 'nuxt',
    include: ['test/nuxt/*.{test,spec}.ts'],
    environmentOptions: {
      nuxt: {
        rootDir: fileURLToPath(new URL('.', import.meta.url)),
        domEnvironment: 'happy-dom',
      },
    },
  },
})

if (!nuxtProject.test) {
  throw new Error('Nuxt Vitest project missing test configuration.')
}

nuxtProject.test.environment = './test/nuxt-vitest-environment.ts'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['test/unit/*.{test,spec}.ts'],
          environment: 'node',
        },
      },
      nuxtProject,
    ],
    coverage: {
      enabled: true,
      provider: 'v8',
    },
  },
})
