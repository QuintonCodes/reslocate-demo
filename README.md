# Reslocate Learner Pathway Service: Case 4 Build

**Builder:** Quinton
**Case:** 4, "NSFAS says approved" (Ayanda, Durban)
**Due:** Friday, 30 October 2026 at 16:00 (pull request already opened and ready for review)

Your full task is in the PDF sent to you by email. This file is the short version.

## What you are building

A full-stack web app for Case 4, built from **your own final paper design** (step table, information list, handoff card, reply rules and tests).

- **Learner screen:** a learner asks a funding question and gets a reply.
- **Staff screen:** a Reslocate staff member sees every case that was handed over to a person.
- **Back end:** your six agents (Safety Gate, Coordinator, Privacy & Identity, Information, Explainer, Checker) as separate parts of the code, working in the order of your step table.
- **Database:** the mock SQL database in `/database`. Use it. Do not connect to any real system.

## Product goals

1. Be as helpful as possible: every learner should leave with a clear answer.
2. The database is the source of truth for every learner's situation.
3. Replies must be short, warm and in simple English.
4. Every case that needs a person must appear on the staff screen.

## How to work

1. Build most of the app in **Z.ai (Full-Stack mode)**. Download your project often (at least every 30 minutes).
2. **Clone** this repository in VS Code. Never fork it and never press "Publish to GitHub".
3. Create your branch: `quinton-build`. Work only on that branch.
4. Fix and polish in VS Code. You may use any AI tool, but every use goes in `AI_LOG.md`.
5. Commit and push to `quinton-build` at least once a day.
6. When you are done, open a pull request from `quinton-build` into `main`.

## Hand-in checklist (in your pull request)

- [ ] The app runs. The steps to run it are written at the bottom of this README.
- [ ] `AI_LOG.md`: every AI tool you used, and what you fixed yourself.
- [ ] `TESTS.md`: all six tests, with what happened and a screenshot.
- [ ] `CHANGES.md`: anything you changed in the files you were given, and why.
- [ ] A screen recording of the app, at most 3 minutes (a link is fine).
- [ ] Your final paper design (Case 4) in `/docs`.

## Rules

- Fake data only. Never add real names, ID numbers, phone numbers or marks.
- No passwords, API keys or tokens in the code. Use a `.env` file (it is already ignored by git).
- Do not connect to NSFAS, a university or any real system.

## How to run the app

Ensure you have Node.js and npm installed on your machine

1. Open your terminal in the root directory of the repository
2. Navigate into the Next.js application directory by running:
   `cd src`
3. Install the required dependencies by running:
   `npm install`
4. Start the local development server by running:
   `npm run dev`
5. Open your web browser and navigate to:

- **Learner Screen:** `http://localhost:3000`
- **Staff Dashboard:** `http://localhost:3000/staff`

_Note: The application's database is located at `../database/reslocate_mock.db`_
