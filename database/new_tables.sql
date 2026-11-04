-- New tables for the improvement task (added 2 November 2026).
-- Load into your database with:  sqlite3 database/reslocate_mock.db < database/new_tables.sql
-- (or the Python / Node equivalent). Read every column before you use it.

-- 1. People who can log in to the staff screen
CREATE TABLE IF NOT EXISTS staff_users (
    id          INTEGER PRIMARY KEY,
    full_name   TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE,
    password    TEXT NOT NULL,
    role        TEXT NOT NULL,
    active      INTEGER NOT NULL DEFAULT 1,
    started_on  TEXT,
    left_on     TEXT
);
INSERT INTO staff_users (id, full_name, email, password, role, active, started_on, left_on) VALUES
 (1, 'Nandi Khoza',    'nandi.k@reslocate.example',   'Nandi@2026',   'Funding Officer', 1, '2026-02-01', NULL),
 (2, 'Pieter van Wyk', 'pieter.vw@reslocate.example', 'reslocate123', 'Compliance Officer', 1, '2025-06-15', NULL),
 (3, 'Lindiwe Zulu',   'lindiwe.z@reslocate.example', 'Welcome1',     'Funding Officer', 1, '2026-01-10', NULL),
 (4, 'Kabelo Seema',   'kabelo.s@reslocate.example',  'kabelo2025',   'Funding Officer', 0, '2025-03-01', '2026-08-31');

-- 2. A record of who did what, and when
CREATE TABLE IF NOT EXISTS audit_log (
    id          INTEGER PRIMARY KEY,
    happened_at TEXT NOT NULL DEFAULT (datetime('now')),
    staff_id    INTEGER REFERENCES staff_users(id),
    action      TEXT NOT NULL,
    learner_id  INTEGER,
    details     TEXT
);
INSERT INTO audit_log (happened_at, staff_id, action, learner_id, details) VALUES
 ('2026-10-21 09:12:00', 1, 'viewed_record', 1, 'Opened record'),
 ('2026-10-21 09:15:00', 1, 'decision',      1, 'Told learner to contact DUT financial aid before signing lease'),
 ('2026-10-27 11:40:00', 2, 'note',          2, 'Called learner on +27 70 000 0102, confirmed NSFAS status by phone');

-- 3. Official financial aid contacts at each institution
CREATE TABLE IF NOT EXISTS financial_aid_contacts (
    id              INTEGER PRIMARY KEY,
    institution_id  INTEGER NOT NULL REFERENCES institutions(id),
    contact_name    TEXT,
    email           TEXT NOT NULL,
    phone           TEXT,
    verified        INTEGER NOT NULL DEFAULT 1,
    source          TEXT
);
INSERT INTO financial_aid_contacts (institution_id, contact_name, email, phone, verified, source) VALUES
 (1, 'DUT Financial Aid Office', 'finaid@dut.example.ac.za',   '+27 31 000 1001', 1, 'Institution website, Oct 2026'),
 (2, 'UKZN Financial Aid Office','finaid@ukzn.example.ac.za',  '+27 31 000 2001', 1, 'Institution website, Oct 2026'),
 (1, 'Mr S. Pillay',             'spillay.dut@gmail.com',      '+27 82 000 3001', 0, 'Shared in a WhatsApp group'),
 (4, 'Vhembe TVET Bursary Desk', 'bursary@vhembe.example.ac.za', NULL,            1, 'Institution website, Oct 2026');

-- 4. Learners asking about leases and accommodation
CREATE TABLE IF NOT EXISTS lease_enquiries (
    id                  INTEGER PRIMARY KEY,
    learner_id          INTEGER NOT NULL REFERENCES learners(id),
    landlord_contact_id INTEGER REFERENCES contacts(id),
    question            TEXT NOT NULL,
    share_with_landlord INTEGER NOT NULL DEFAULT 1,
    status              TEXT NOT NULL DEFAULT 'open',
    created_at          TEXT NOT NULL DEFAULT (datetime('now'))
);
INSERT INTO lease_enquiries (learner_id, landlord_contact_id, question, status, created_at) VALUES
 (1, 2, 'My landlord wants proof that NSFAS will pay. Can you send it to him?', 'open', '2026-10-26 18:05:00'),
 (8, NULL, 'Can I sign a lease before registration?', 'open', '2026-10-28 10:20:00');
