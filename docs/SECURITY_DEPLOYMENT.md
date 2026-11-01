# Security and deployment boundary

This release is designed for one person using a local installation.

- API routes do not include user authentication or multi-user authorisation.
- Do not expose the development server or this database API directly to the public internet.
- For hosted deployment, implement authentication, authorisation, CSRF protections where applicable, rate limiting, secure cookie/session handling, database access isolation, encrypted transport, secrets management, retention and deletion controls, and an independent security review.
- Backups contain personal journal and wellbeing data. Store them in a private, encrypted location.
- Do not store passwords, payment data, government identifiers or highly sensitive clinical records in this application.
- The app does not connect to medical records or health-provider accounts.
