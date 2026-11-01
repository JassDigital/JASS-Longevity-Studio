# Data dictionary

| Table | Purpose | Personal data |
|---|---|---|
| research_items | Curated research summaries and bibliographic metadata | No, unless imported by the operator |
| habit_logs | Dated checklist state | Yes, behavioural record |
| goals | User-created goals | Yes |
| journal_entries | User reflections and optional mood label | Yes, potentially sensitive |
| wellness_logs | User-entered observations | Yes |
| app_settings | Future server-side preferences | May be |
| assistant_messages | Reserved for future assistant history | May be |

Profile, theme and font-size preferences currently live in browser localStorage, not in SQLite. No login or multi-user account model is included in this local release.
