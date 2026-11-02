-- Mock data for training. Every person and number here is made up.
PRAGMA foreign_keys = ON;

INSERT INTO schools VALUES (1, 'Umlazi Comprehensive High', 'Umlazi', 'KwaZulu-Natal');
INSERT INTO schools VALUES (2, 'Mamelodi East Secondary', 'Tshwane', 'Gauteng');
INSERT INTO schools VALUES (3, 'Giyani Senior Secondary', 'Mopani', 'Limpopo');
INSERT INTO schools VALUES (4, 'Thohoyandou Technical High', 'Vhembe', 'Limpopo');
INSERT INTO schools VALUES (5, 'Mthatha Academy', 'OR Tambo', 'Eastern Cape');
INSERT INTO schools VALUES (6, 'Khayelitsha Senior Secondary', 'City of Cape Town', 'Western Cape');

INSERT INTO institutions VALUES (1, 'Durban University of Technology', 'University', 'KwaZulu-Natal', 'finaid@dut.example.ac.za');
INSERT INTO institutions VALUES (2, 'University of KwaZulu-Natal', 'University', 'KwaZulu-Natal', 'finaid@ukzn.example.ac.za');
INSERT INTO institutions VALUES (3, 'Tshwane University of Technology', 'University', 'Gauteng', 'finaid@tut.example.ac.za');
INSERT INTO institutions VALUES (4, 'Vhembe TVET College', 'TVET College', 'Limpopo', 'finaid@vhembe.example.ac.za');
INSERT INTO institutions VALUES (5, 'Walter Sisulu University', 'University', 'Eastern Cape', 'finaid@wsu.example.ac.za');

INSERT INTO learners (id, first_name, last_name, date_of_birth, grade_or_level, school_id, institution_id, district, province, phone, email, preferred_language) VALUES (1, 'Ayanda', 'Mthembu', '2007-03-14', 'First-year applicant', 1, 1, 'eThekwini', 'KwaZulu-Natal', '+27 70 000 0101', 'ayanda.m@example.com', 'isiZulu');
INSERT INTO learners (id, first_name, last_name, date_of_birth, grade_or_level, school_id, institution_id, district, province, phone, email, preferred_language) VALUES (2, 'Sibusiso', 'Ndlovu', '2007-08-02', 'First-year applicant', 1, 2, 'eThekwini', 'KwaZulu-Natal', '+27 70 000 0102', 'sibu.n@example.com', 'isiZulu');
INSERT INTO learners (id, first_name, last_name, date_of_birth, grade_or_level, school_id, institution_id, district, province, phone, email, preferred_language) VALUES (3, 'Karabo', 'Molefe', '2008-01-22', 'Grade 12', 2, NULL, 'Tshwane', 'Gauteng', '+27 70 000 0103', 'karabo.m@example.com', 'Setswana');
INSERT INTO learners (id, first_name, last_name, date_of_birth, grade_or_level, school_id, institution_id, district, province, phone, email, preferred_language) VALUES (4, 'Tshepo', 'Maluleke', '2007-11-30', 'First-year applicant', 3, 4, 'Mopani', 'Limpopo', '+27 70 000 0104', 'tshepo.m@example.com', 'Xitsonga');
INSERT INTO learners (id, first_name, last_name, date_of_birth, grade_or_level, school_id, institution_id, district, province, phone, email, preferred_language) VALUES (5, 'Rendani', 'Netshitenzhe', '2007-06-09', 'First-year applicant', 4, 4, 'Vhembe', 'Limpopo', '+27 70 000 0105', 'rendani.n@example.com', 'Tshivenda');
INSERT INTO learners (id, first_name, last_name, date_of_birth, grade_or_level, school_id, institution_id, district, province, phone, email, preferred_language) VALUES (6, 'Lwazi', 'Mqhayi', '2008-04-17', 'Grade 12', 5, NULL, 'OR Tambo', 'Eastern Cape', '+27 70 000 0106', 'lwazi.m@example.com', 'isiXhosa');
INSERT INTO learners (id, first_name, last_name, date_of_birth, grade_or_level, school_id, institution_id, district, province, phone, email, preferred_language) VALUES (7, 'Zanele', 'Mabaso', '2008-09-05', 'Grade 12', 6, NULL, 'City of Cape Town', 'Western Cape', '+27 70 000 0107', 'zanele.m@example.com', 'isiXhosa');
INSERT INTO learners (id, first_name, last_name, date_of_birth, grade_or_level, school_id, institution_id, district, province, phone, email, preferred_language) VALUES (8, 'Nomvula', 'Khumalo', '2007-02-27', 'First-year applicant', 1, 1, 'eThekwini', 'KwaZulu-Natal', '+27 70 000 0108', 'nomvula.k@example.com', 'isiZulu');
INSERT INTO learners (id, first_name, last_name, date_of_birth, grade_or_level, school_id, institution_id, district, province, phone, email, preferred_language) VALUES (9, 'Thabiso', 'Mokoena', '2007-12-12', 'First-year applicant', 2, 3, 'Tshwane', 'Gauteng', '+27 70 000 0109', 'thabiso.m@example.com', 'Sesotho');
INSERT INTO learners (id, first_name, last_name, date_of_birth, grade_or_level, school_id, institution_id, district, province, phone, email, preferred_language) VALUES (10, 'Precious', 'Baloyi', '2007-05-19', 'First-year applicant', 3, 4, 'Mopani', 'Limpopo', '+27 70 000 0110', 'precious.b@example.com', 'Xitsonga');
INSERT INTO learners (id, first_name, last_name, date_of_birth, grade_or_level, school_id, institution_id, district, province, phone, email, preferred_language) VALUES (11, 'Anele', 'Gqirana', '2007-10-03', 'First-year applicant', 5, 5, 'OR Tambo', 'Eastern Cape', '+27 70 000 0111', 'anele.g@example.com', 'isiXhosa');
INSERT INTO learners (id, first_name, last_name, date_of_birth, grade_or_level, school_id, institution_id, district, province, phone, email, preferred_language) VALUES (12, 'Kagiso', 'Sebola', '2007-07-25', 'First-year applicant', 4, 4, 'Vhembe', 'Limpopo', '+27 70 000 0112', 'kagiso.s@example.com', 'Sepedi');

INSERT INTO contacts (learner_id, full_name, relationship, phone, source) VALUES (1, 'Thandiwe Mthembu', 'Mother', '+27 70 000 0201', 'Learner sign-up form');
INSERT INTO contacts (learner_id, full_name, relationship, phone, source) VALUES (1, 'Mr R. Naidoo', 'Landlord', '+27 70 000 0202', 'Learner sign-up form');
INSERT INTO contacts (learner_id, full_name, relationship, phone, source) VALUES (2, 'Bongani Ndlovu', 'Father', '+27 70 000 0203', 'School upload');
INSERT INTO contacts (learner_id, full_name, relationship, phone, source) VALUES (3, 'Lerato Molefe', 'Sister', '+27 70 000 0204', 'School upload');
INSERT INTO contacts (learner_id, full_name, relationship, phone, source) VALUES (8, 'Sipho Khumalo', 'Uncle', '+27 70 000 0205', 'School upload');
INSERT INTO contacts (learner_id, full_name, relationship, phone, source) VALUES (9, 'Mpho Mokoena', 'Guardian', '+27 70 000 0206', 'Learner sign-up form');
INSERT INTO contacts (learner_id, full_name, relationship, phone, source) VALUES (11, 'Ms N. Dyantyi', 'Teacher', '+27 70 000 0207', 'School upload');

INSERT INTO funding_status (learner_id, scheme, status, registration_confirmed, expected_payment_date) VALUES (1, 'NSFAS', 'Approved', 0, NULL);
INSERT INTO funding_status (learner_id, scheme, status, registration_confirmed, expected_payment_date) VALUES (2, 'NSFAS', 'approved', 1, '2026-10-30');
INSERT INTO funding_status (learner_id, scheme, status, registration_confirmed, expected_payment_date) VALUES (4, 'NSFAS', 'Provisionally approved', 0, NULL);
INSERT INTO funding_status (learner_id, scheme, status, registration_confirmed, expected_payment_date) VALUES (5, 'NSFAS', 'APPROVED ', 1, '2026-10-30');
INSERT INTO funding_status (learner_id, scheme, status, registration_confirmed, expected_payment_date) VALUES (8, 'NSFAS', 'funded', 1, '2026-10-30');
INSERT INTO funding_status (learner_id, scheme, status, registration_confirmed, expected_payment_date) VALUES (9, 'NSFAS', 'Application under review', 0, NULL);
INSERT INTO funding_status (learner_id, scheme, status, registration_confirmed, expected_payment_date) VALUES (10, 'NSFAS', 'Provisionally approved', 0, NULL);
INSERT INTO funding_status (learner_id, scheme, status, registration_confirmed, expected_payment_date) VALUES (11, 'NSFAS', 'Approved', 0, NULL);
INSERT INTO funding_status (learner_id, scheme, status, registration_confirmed, expected_payment_date) VALUES (12, 'Funza Lushaka Bursary', 'approved', 1, NULL);

INSERT INTO messages (learner_id, channel, sender, body) VALUES (1, 'whatsapp', 'learner', 'Hi, my NSFAS status says approved. Can you confirm my allowance will be paid this month? I need to sign a lease for a room in Glenwood.');
INSERT INTO messages (learner_id, channel, sender, body) VALUES (2, 'web', 'learner', 'When does NSFAS pay the book allowance?');
INSERT INTO messages (learner_id, channel, sender, body) VALUES (4, 'sms', 'learner', 'Does provisionally approved mean I will get money?');
