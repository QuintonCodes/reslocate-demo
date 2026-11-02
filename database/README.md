# Mock database

A small SQLite database for training. Every person, school and number in it is made up.

## Files

| File | What it is |
|---|---|
| `schema.sql` | Creates the tables |
| `seed.sql` | Fills the tables with mock data |
| `reslocate_mock.db` | The ready-made database (schema + seed already loaded) |
| `queries.sql` | Example queries to get you started |

## Rebuild the database

```bash
rm -f reslocate_mock.db
sqlite3 reslocate_mock.db < schema.sql
sqlite3 reslocate_mock.db < seed.sql
```

## Tables

| Table | What it holds |
|---|---|
| `schools` | Schools learners come from |
| `institutions` | Universities and TVET colleges, with their financial aid contact |
| `learners` | Learners and first-year applicants |
| `contacts` | People linked to a learner (family, teachers and others) |
| `funding_status` | Funding records (NSFAS and bursaries) |
| `messages` | Messages received and sent |
