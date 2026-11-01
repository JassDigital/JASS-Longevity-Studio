# User guide

## Start the application
Run `npm install`, then `npm run dev`, and open `http://localhost:3000`.

## Main areas
- Overview: a summary of local research and personal workspace activity.
- Research library: search, filter, inspect, import and export research records.
- Daily planner: tick optional wellbeing prompts; entries are saved by date.
- Goals & habits: create personal goals and mark them completed or active.
- Nutrition, Movement, Sleep, Brain & connection: browse related starter evidence and record personal observations.
- Wellbeing journal: save dated notes and optional mood labels.
- Progress & reports: review simple counts and recent self-recorded activity.
- Research assistant: keyword retrieval over the local research library. This is not a generative AI clinician.
- Profile and Settings: browser-local preferences, theme and text-size controls.

## Backup
Use Settings → Full data backup to download a JSON backup containing research records and personal entries. Keep it private. The SQLite database is stored in `data/longevity.sqlite` by default.

## Research imports
The Research Library accepts a JSON array or `{ "items": [...] }`. Each record needs `title` and an `http(s)` `source_url`. Optional fields include `slug`, `category`, `summary`, `evidence_level`, `study_type`, `population`, `limitations`, `source_name`, `published_year`, `doi`, `pmid`, `sample_size`, `review_status` and `last_reviewed`. Maximum 500 records per import.

## Limitations
The starter evidence records are concise educational summaries, not formal systematic reviews. Evidence labels are descriptive and not formal GRADE ratings. Verify original sources and review records before relying on them.
