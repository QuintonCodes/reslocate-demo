-- Reslocate Learner Pathway Service: mock database (SQLite)
-- All people, schools and numbers in this database are made up for training.

PRAGMA foreign_keys = ON;

CREATE TABLE schools (
    id            INTEGER PRIMARY KEY,
    name          TEXT NOT NULL,
    district      TEXT NOT NULL,
    province      TEXT NOT NULL
);

CREATE TABLE institutions (
    id            INTEGER PRIMARY KEY,
    name          TEXT NOT NULL,
    type          TEXT NOT NULL,          -- University, TVET College
    province      TEXT NOT NULL,
    financial_aid_email TEXT
);

CREATE TABLE learners (
    id            INTEGER PRIMARY KEY,
    first_name    TEXT NOT NULL,
    last_name     TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    grade_or_level TEXT NOT NULL,         -- e.g. Grade 12, First-year applicant
    school_id     INTEGER REFERENCES schools(id),
    institution_id INTEGER REFERENCES institutions(id),
    district      TEXT NOT NULL,
    province      TEXT NOT NULL,
    phone         TEXT,
    email         TEXT,
    preferred_language TEXT DEFAULT 'English',
    data_mode     TEXT NOT NULL DEFAULT 'standard',
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE contacts (
    id            INTEGER PRIMARY KEY,
    learner_id    INTEGER NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
    full_name     TEXT NOT NULL,
    relationship  TEXT NOT NULL,
    phone         TEXT,
    source        TEXT,                   -- where the contact came from
    can_view_records INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE funding_status (
    id            INTEGER PRIMARY KEY,
    learner_id    INTEGER NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
    scheme        TEXT NOT NULL,          -- NSFAS, bursary name
    status        TEXT NOT NULL,
    registration_confirmed INTEGER NOT NULL DEFAULT 0,
    expected_payment_date TEXT,
    allowance_paid INTEGER NOT NULL DEFAULT 0,
    updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE messages (
    id            INTEGER PRIMARY KEY,
    learner_id    INTEGER REFERENCES learners(id) ON DELETE CASCADE,
    channel       TEXT NOT NULL,          -- web, whatsapp, sms
    sender        TEXT NOT NULL,          -- learner, contact, agent, staff
    body          TEXT NOT NULL,
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
