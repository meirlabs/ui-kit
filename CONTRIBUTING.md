# Contributing to @meirlabs/ui-kit

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

```bash
git clone https://github.com/meirlabs/ui-kit.git
cd ui-kit
pnpm install
pnpm dev
```

This starts tsup in watch mode and rebuilds CSS on changes.

## Adding a New Component

1. Create the component file at `src/components/MyComponent.tsx`.
2. Add a story at `src/components/MyComponent.stories.tsx`.
3. Add tests at `src/components/MyComponent.test.tsx`.
4. Export the component from `src/index.ts`.
5. Document the component in `README.md` and `AGENTS.md`.

## Testing

Run the full test suite:

```bash
pnpm test
```

Run tests in watch mode during development:

```bash
pnpm test:watch
```

## Commit Conventions

This project follows [Conventional Commits](https://www.conventionalcommits.org/). Use prefixes like:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `refactor:` for code restructuring
- `test:` for adding or updating tests
- `chore:` for tooling and config changes

Example: `feat: add StatusPill component`
