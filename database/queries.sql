-- Example queries to help you get started.

-- 1. Find a learner by phone number
SELECT * FROM learners WHERE phone = '+27 70 000 0101';

-- 2. Funding status for a learner
SELECT l.first_name, l.last_name, f.scheme, f.status, f.expected_payment_date, f.allowance_paid
FROM funding_status f
JOIN learners l ON l.id = f.learner_id
WHERE l.id = 1;

-- 3. All learners whose NSFAS funding is approved
SELECT l.first_name, l.last_name, f.status
FROM funding_status f
JOIN learners l ON l.id = f.learner_id
WHERE f.scheme = 'NSFAS' AND lower(f.status) = 'approved';

-- 4. People linked to a learner
SELECT c.full_name, c.relationship, c.phone
FROM contacts c
WHERE c.learner_id = 1 AND c.can_view_records = 1;
