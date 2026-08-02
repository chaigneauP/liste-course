# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# Architecture

This project follows Clean Architecture under `src/`.

- Full documentation: [docs/architecture.md](docs/architecture.md)
- Cursor AI rules: `.cursor/rules/` (layers, dependencies, styles, routes)

Dependency direction: `domain` ← `application` ← `infrastructure` / `presentation` ← `app`.
Presentation must never import infrastructure. Domain must stay framework-free.
