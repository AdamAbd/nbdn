# NBDN

Nuxt 4 project dengan ESLint dan Prettier yang sudah dikonfigurasi.

## Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com/)
- **Package Manager**: [Bun](https://bun.sh/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn-vue](https://www.shadcn-vue.com/)
- **Utilities**: [VueUse](https://vueuse.org/) via [@vueuse/nuxt](https://nuxt.com/modules/vueuse)
- **Linting**: [@nuxt/eslint](https://eslint.nuxt.com/)
- **Formatting**: [Prettier](https://prettier.io/)
- **Performance**: [@nuxt/hints](https://github.com/nuxt/hints)
- **Testing**: [@nuxt/test-utils/module](https://nuxt.com/modules/test-utils) untuk integrasi test dengan Nuxt

## Setup

Install dependencies:

```bash
bun install
```

## Development

Start the development server on `http://localhost:3000`:

```bash
bun run dev
```

## Code Quality

### Linting

Check for linting errors:

```bash
bun run lint
```

Auto-fix linting errors:

```bash
bun run lint:fix
```

### Formatting

Format all files with Prettier:

```bash
bun run format
```

Check formatting without making changes:

```bash
bun run format:check
```

## Testing

Project ini menggunakan tiga jenis testing:

- **Unit Test**: `vitest` (project `unit`)
- **Nuxt Test**: `vitest` (project `nuxt`) dengan `@nuxt/test-utils/module` dan `happy-dom` sebagai DOM environment
- **E2E Test**: `@playwright/test`

Jalankan per tipe:

```bash
bun run test:unit
bun run test:nuxt
bun run test:e2e
```

## Production

Build the application for production:

```bash
bun run build
```

Preview production build locally:

```bash
bun run preview
```

## Configuration

### ESLint

ESLint dikonfigurasi melalui `@nuxt/eslint` module dengan custom rules di `eslint.config.mjs`:

- **Vue Rules**: `multi-word-component-names` off, `require-default-prop`, `require-prop-types`, dll.
- **TypeScript Rules**: `no-unused-vars` (ignore `_` prefix), `no-explicit-any`
- **General Rules**: `no-console` (allow warn/error), `prefer-const`, `eqeqeq`, dll.

### Prettier

Konfigurasi Prettier ada di `.prettierrc`:

| Option | Value |
|--------|-------|
| `semi` | `false` |
| `singleQuote` | `true` |
| `tabWidth` | `2` |
| `trailingComma` | `es5` |
| `printWidth` | `100` |

### Nuxt Hints

`@nuxt/hints` adalah module yang memberikan hints untuk berbagai aspek aplikasi seperti Performance, Security, dan lainnya langsung di Nuxt DevTools.

**Fitur utama:**

- 🚀 **Rich DevTools UI**: Tab khusus di Nuxt DevTools untuk visualisasi issues dan rekomendasi
- ⚡️ **Web Vitals Analysis**: Metrics real-time untuk LCP, INP, dan CLS dengan tips optimasi
- 💧 **Hydration Inspector**: Side-by-side diff untuk debugging hydration mismatch
- 📦 **Third-Party Script Auditing**: Dashboard untuk monitor performa dan keamanan script eksternal
- 💡 **Actionable Console Warnings**: Pesan console yang jelas untuk panduan best practices

Untuk mengakses, buka Nuxt DevTools dan klik icon Nuxt Hints.

### Nuxt Test Utils

`@nuxt/test-utils/module` menyediakan integrasi testing untuk Nuxt sehingga environment test lebih dekat dengan runtime Nuxt asli. Module ini sudah ditambahkan di `nuxt.config.ts`.

### Tailwind CSS

Project ini menggunakan [Tailwind CSS v4](https://tailwindcss.com/) dengan `@tailwindcss/vite` plugin.

**Setup:**

1. Tailwind dikonfigurasi sebagai Vite plugin di `nuxt.config.ts`:

```typescript
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  vite: {
    plugins: [tailwindcss()],
  },
})
```

2. CSS import di `app/assets/css/main.css`:

```css
@import "tailwindcss";
```

**Penggunaan:**

```vue
<template>
  <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
</template>
```

### VueUse

[VueUse](https://vueuse.org/) adalah collection of essential Vue Composition Utilities. Project ini menggunakan `@vueuse/nuxt` module untuk integrasi yang seamless dengan Nuxt.

**Instalasi:**

```bash
bun add @vueuse/nuxt @vueuse/core
```

**Konfigurasi di `nuxt.config.ts`:**

```typescript
export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    // ... modules lainnya
  ],
})
```

**Penggunaan:**

```vue
<script setup>
const { x, y } = useMouse()
const { copy, copied } = useClipboard()
const isDark = useDark()
</script>
```

> 💡 Semua composables dari VueUse otomatis auto-imported, tidak perlu import manual!

### shadcn-vue

[shadcn-vue](https://www.shadcn-vue.com/) adalah kumpulan komponen UI yang beautifully designed, accessible, dan customizable. Komponen-komponen ini bukan dependency yang di-install, melainkan code yang di-copy ke project Anda.

**Instalasi:**

```bash
bunx shadcn-vue@latest init
```

Ikuti prompt yang muncul untuk mengkonfigurasi project Anda.

**Menambahkan Komponen:**

```bash
bunx shadcn-vue@latest add button
bunx shadcn-vue@latest add card
bunx shadcn-vue@latest add input
# atau tambahkan semua komponen sekaligus
bunx shadcn-vue@latest add --all
```

**Penggunaan:**

```vue
<script setup>
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Hello World</CardTitle>
    </CardHeader>
    <CardContent>
      <Button>Click me</Button>
    </CardContent>
  </Card>
</template>
```

**Lokasi Komponen:**

Komponen shadcn-vue akan ditambahkan ke folder `app/components/ui/`.

## Resources

- [Nuxt Documentation](https://nuxt.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Nuxt ESLint Documentation](https://eslint.nuxt.com/)
- [Nuxt Hints Documentation](https://nuxt.com/modules/hints)
- [Prettier Documentation](https://prettier.io/docs/en/)
- [VueUse Documentation](https://vueuse.org/)
- [shadcn-vue Documentation](https://www.shadcn-vue.com/)
