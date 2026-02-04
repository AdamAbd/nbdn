# NBDN

Nuxt 4 project dengan ESLint dan Prettier yang sudah dikonfigurasi.

## Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com/)
- **Package Manager**: [Bun](https://bun.sh/)
- **Linting**: [@nuxt/eslint](https://eslint.nuxt.com/)
- **Formatting**: [Prettier](https://prettier.io/)
- **Performance**: [@nuxt/hints](https://github.com/nuxt/hints)

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

## Resources

- [Nuxt Documentation](https://nuxt.com/docs)
- [Nuxt ESLint Documentation](https://eslint.nuxt.com/)
- [Nuxt Hints Documentation](https://nuxt.com/modules/hints)
- [Prettier Documentation](https://prettier.io/docs/en/)

