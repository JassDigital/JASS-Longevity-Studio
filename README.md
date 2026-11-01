# JASS Longevity Studio

**Live better. Age healthier. Stay independent.**

JASS Longevity Studio is a local-first, evidence-informed healthy-ageing workspace for everyone, with particular attention to adults aged 50+. It combines a source-linked research library with optional personal planning, goals, habit logs, journal entries, wellbeing observations and descriptive progress views.

## Requirements

- Node.js 20.9+ (Node.js 22 LTS recommended)
- npm
- A supported build environment for `better-sqlite3` if a prebuilt native binary is unavailable

## Install and run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run check
npm run build
npm start
```

## Main modules

- Overview dashboard
- Research library with category filters, side-by-side study comparison, source details and limitations
- Research JSON import and CSV/JSON export
- Daily planner and habit checklist
- Personal goals and goal completion
- Nutrition, movement, sleep, and brain/social-connection workspaces
- Wellbeing observation logs
- Personal journal with optional mood label
- Descriptive progress and activity summaries
- Local keyword-based research retrieval assistant
- Profile and accessibility settings
- Full personal-data JSON backup
- SQLite database backup script

## Data storage

SQLite is created at `data/longevity.sqlite` by default. Set `DATABASE_PATH` to use another location. Profile, theme and text-size preferences are stored in browser localStorage. The `data/` and `backups/` directories are excluded from Git.

Use Settings → Full data backup for a JSON export of research and personal entries. Keep this file private.

## Research content

The bundled starter collection contains concise educational summaries and public source links. These are not a systematic review, formal GRADE assessments, or individual medical recommendations. Evidence labels are descriptive starter labels and require editorial review. Research import supports up to 500 records per request; imported sources should be verified before publication.

## Research import format

Paste a JSON array or `{ "items": [...] }` into Research Library → Import research records. Each record requires `title` and an `http(s)` `source_url`. Optional fields: `slug`, `category`, `summary`, `evidence_level`, `study_type`, `population`, `limitations`, `source_name`, `published_year`, `doi`, `pmid`, `sample_size`, `review_status`, `last_reviewed`.

## Privacy and deployment boundary

This release is designed for a single-person local installation. API routes do not include authentication or multi-user authorisation. **Do not expose this app or its API directly to the public internet.** A hosted product requires authentication, authorisation, secure session handling, rate limiting, encryption in transit, access controls, retention/deletion workflows and an independent security review.

## Health and safety notice

The application provides general educational and self-reflection tools. It does not diagnose, treat, prevent or predict disease or lifespan. It does not prescribe exercise, diet, supplements or medication. Adapt activities to personal circumstances and consult a qualified health professional for individual medical decisions.

## Project identity

- Product: JASS Longevity Studio
- Developer: JASS Digital Lab
- Release: v1.0.0 — Complete Local-First Edition
- License: MIT
