# Trista Monolith

This is a monolithic version of the Trista project, converted from a microfrontends architecture to a single Vite project with a feature-based (screaming) architecture.

## Architecture

- `src/core`: Shared logic, components (Sidebar), router, and i18n services.
- `src/features`: Feature-based separation of business logic (Dashboard, Invoices, Products).
- `src/assets`: Global assets.

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Run in development mode:
   ```bash
   pnpm dev
   ```
3. Build for production:
   ```bash
   pnpm build
   ```

## Features

- **Dashboard**: Overview and analytics.
- **Invoices**: Manage and create invoices.
- **Products**: Product and service management.
- **Micro-animations**: Smooth transitions and HSL-tailored color palettes.
- **Internationalization**: Full support for Spanish (default).
# trista-monolith
