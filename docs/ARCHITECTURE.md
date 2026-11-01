# Architecture

## LS1 architecture

- Next.js App Router provides the web application and API routes.
- React components implement the dashboard and module navigation.
- SQLite stores research records and daily habit logs locally.
- better-sqlite3 is used only in Node.js server routes.
- The research API exposes read-only search and listing.
- The habits API reads and writes daily checklist state.

## Design boundaries

Research content is distinct from personal activity records. Future AI features must retrieve approved source records and cite them. AI output must not be treated as clinical advice.

## Planned expansion

Use module-level services and repositories as the application grows. Keep AI providers behind an adapter interface. Add authentication only when a multi-user or hosted deployment is explicitly required.
