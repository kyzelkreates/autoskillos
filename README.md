# AutoSkill OS™

**Manufacturing Training Control Dashboard + Employee Learning PWA**

> Powered by 4P3X Intelligent AI™ · Created by Kyzel Kreates™

---

## Project Identity

| Field | Value |
|---|---|
| **Product Name** | AutoSkill OS™ |
| **Type** | Local-first manufacturing training platform |
| **Dashboard** | Control Dashboard — supervisor, trainer, manager |
| **PWA** | Employee Learning PWA — employee, trainee |
| **AI Engine** | Powered by 4P3X Intelligent AI™ |
| **Creator** | Kyzel Kreates™ |
| **Data Model** | Local-first SSOT (IndexedDB / localStorage) |
| **Sync** | Local queue → Control Dashboard → future backend |
| **Build Plan** | 8-run refactor completed |

---

## Short Description

Local-first manufacturing training dashboard and employee learning PWA for process learning, safety checks, competency tracking, supervisor review, demo/live mode switching, and backend-ready workflows.

---

## The Product Phrase

> **Demo Mode shows the product. Live Mode runs the product.**

---

## Main Features

### Control Dashboard
- Manufacturing Training Centre overview
- Employee progress table (by employee, department, pathway)
- Training Pathways panel
- Department & Manufacturing Stations panel
- Safety Acknowledgement panel
- Supervisor Review Queue
- Training Evidence panel
- Dashboard Alerts panel
- **Reports & Evidence Centre** (7 report types — local-first, SSOT-driven)
- **Employee PWA Sync Queue** (local queue processing)
- Demo / Live Mode status panel
- Backend Provider Settings (with 4P3X API Config Guard™)

### Employee Learning PWA
- Installs as a PWA (Add to Home Screen)
- Offline-first local storage
- 3 manufacturing training modules (15 lessons total)
- Module 1 — Site Orientation & Induction
- Module 2 — Quality Control & PPE
- Module 3 — Competency Assessment & Final Check
- Interactive skill checkpoints per lesson
- Safety acknowledgement flow
- Training progress tracker with XP
- Supervisor review request button
- Local sync queue (queues activity for Control Dashboard)
- Demo Mode / Live Mode awareness
- Install guidance in-app

### Sync Queue
- Employee PWA actions generate local queue records
- Control Dashboard reads, displays, and processes queue items
- Event types: lesson_started, lesson_completed, checkpoint_submitted, safety_acknowledged, supervisor_review_requested
- Conflict-safe local merge
- Demo items ignored in Live Mode
- Backend-ready payload shape for future Supabase / Firebase / REST

### Reports & Evidence Centre (7 reports)
1. Training Overview Report
2. Employee Training Summary Report
3. Pathway Completion Report
4. Safety Acknowledgement Report
5. Supervisor Review Report
6. Employee PWA Sync Queue Report
7. Demo / Live Readiness Report

All reports: local-first, SSOT-driven, printable, copyable, JSON-exportable.

### Backend Settings Layer
- Local-only mode (default)
- Supabase (public-safe anon key only)
- Firebase (public web config only)
- AWS / Amplify (public endpoint only)
- Custom REST endpoint
- 4P3X API Config Guard™ — blocks all forbidden backend-only secrets

### 4P3X API Config Guard™
Blocks the following terms from being saved in frontend settings:

```
SUPABASE_SERVICE_ROLE_KEY  OPENAI_API_KEY  GROQ_API_KEY
STRIPE_SECRET_KEY  DATABASE_URL  JWT_SECRET  PRIVATE_KEY
WEBHOOK_SECRET  service_role  service account  private_key
AWS_SECRET_ACCESS_KEY  secretAccessKey  client_secret
admin token
```

---

## Demo / Live Mode

| Mode | Behaviour |
|---|---|
| **Demo Mode ON** | Shows sample manufacturing training records (marked `isDemo: true`). All dashboard panels and reports are populated. No backend needed. |
| **Demo Mode OFF (Live)** | Hides demo records. Shows live-ready empty states. Real records must come from live employee sessions or a configured backend. |

Demo data can be reset safely from the Demo / Live panel in the dashboard.

---

## Backend Configuration

Demo/local mode works completely without a backend.

When you are ready for live deployment, connect one of:

| Provider | Config needed in frontend |
|---|---|
| **Supabase** *(recommended)* | `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` (public only) |
| **Firebase** | Public web app config (no service account) |
| **AWS / Amplify** | Public API Gateway endpoint + region |
| **Custom REST** | API base URL + optional public token |

> **NEVER** place `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `JWT_SECRET`, `PRIVATE_KEY`, `WEBHOOK_SECRET`, service account JSON, or admin tokens in any frontend `.env` file or browser-accessible config.

Full Supabase schema SQL is in `supabase/sql/` — for server-side / Supabase Dashboard use only.
> See `supabase/docs/` for schema docs, frontend mapping, and RLS policy notes.

---

## Safety & Legal Disclaimer

> AutoSkill OS™ supports training awareness, supervisor review, and evidence capture. It does not replace workplace safety procedures, legal duties, qualified supervision, employer responsibility, or site-specific training.

Reports, safety acknowledgements, supervisor reviews, and competency records produced by AutoSkill OS™ are training management tools only. They do not constitute legal compliance records, official certifications, or safety approvals.

---

## Project Structure

```
4p3x_carelink/
├── ap3x/
│   ├── demo/
│   │   └── clinician-demo.html      ← Control Dashboard (single-file app)
│   ├── patient-pwa/
│   │   ├── index.html               ← PWA shell
│   │   ├── patient-app.js           ← PWA logic (~1800 lines)
│   │   ├── patient.css              ← PWA styles
│   │   ├── manifest.json            ← PWA manifest
│   │   └── ap3x-sw.js               ← Service worker (v5)
│   └── shared/
│       ├── data-model.js            ← SSOT / manufacturing data model
│       ├── constants.js
│       ├── auth.js
│       ├── lesson-content.js
│       └── sync-service.js
├── docs/
│   └── AUTOSKILL_SUPABASE_SETUP_SQL.txt  ← Legacy (superseded by supabase/)
├── supabase/
│   ├── sql/
│   │   ├── 001_autoskill_full_backend_setup.sql
│   │   ├── 002_autoskill_seed_demo_live_data.sql
│   │   ├── 099_autoskill_verification_queries.sql
│   │   └── 999_autoskill_rollback_notes.sql
│   └── docs/
│       ├── autoskill_backend_schema.md
│       ├── autoskill_frontend_mapping.md
│       └── autoskill_rls_policy_notes.md
├── icons/                           ← PWA icons (72–512px)
├── .env.example                     ← Public-safe env template
├── vercel.json                      ← Deployment config
├── index.html                       ← Root redirect
└── README.md                        ← This file
```

---

## Local Development

This is a static HTML/JS project — no bundler or Node.js build step required for the core app.

**To run locally:**

```bash
# Option 1: Python local server (no install needed)
cd 4p3x_carelink
python3 -m http.server 8080

# Option 2: Node.js serve (install once)
npx serve .

# Option 3: VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

**Access:**
- Root: `http://localhost:8080/` → redirects to demo
- Control Dashboard: `http://localhost:8080/ap3x/demo/clinician-demo.html`
- Employee Learning PWA: `http://localhost:8080/ap3x/patient-pwa/`

> PWA install and service worker require HTTPS or localhost. Use `localhost` for local testing.

---

## Deployment — Vercel / Netlify / Static Host

### Vercel (recommended)

1. Push project to GitHub.
2. Connect repo to Vercel.
3. Framework preset: **Other** (static site).
4. Output directory: `.` (root) or leave blank.
5. Add public environment variables only:

```
VITE_AUTOSKILL_APP_NAME=AutoSkill OS
VITE_AUTOSKILL_DATA_MODE=demo
VITE_SUPABASE_URL=your_public_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_public_anon_key
```

6. Deploy.
7. Verify demo/live toggle works after deployment.
8. Verify PWA install prompt appears on HTTPS.
9. Confirm no backend secrets appear in any frontend config.

### Netlify

1. Drag the `4p3x_carelink` folder into Netlify Drop, or connect GitHub repo.
2. Build command: *(leave blank — static site)*
3. Publish directory: `.`
4. Add public env vars as above.

### Routing

The `vercel.json` handles SPA routing. Netlify users add a `_redirects` file if needed.

---

## Post-Deployment Validation Checklist

- [ ] Control Dashboard loads at `/ap3x/demo/clinician-demo.html`
- [ ] Employee Learning PWA loads at `/ap3x/patient-pwa/`
- [ ] Demo Mode ON — demo employee/pathway/lesson data appears
- [ ] Demo Mode OFF — live-ready empty states appear
- [ ] Backend settings panel opens
- [ ] Forbidden secrets are blocked by 4P3X API Config Guard™
- [ ] At least one lesson opens and completes
- [ ] Checkpoint appears in lesson
- [ ] Safety acknowledgement can be accepted
- [ ] PWA Sync Queue shows queue items after PWA actions
- [ ] Process Local Queue processes demo items
- [ ] Reports & Evidence Centre loads all 7 reports
- [ ] Print/Copy/Export actions work
- [ ] PWA install prompt appears on HTTPS (Android Chrome / Safari iOS)
- [ ] App works offline after install
- [ ] No backend-only secrets in browser network tab or local storage
- [ ] Console has no critical errors

---

## 8-Run Refactor — Completed

| Run | Focus | Status |
|---|---|---|
| Run 1 | Branding + language refactor | ✅ Complete |
| Run 2 | Manufacturing SSOT / data model | ✅ Complete |
| Run 3 | Control Dashboard upgrade | ✅ Complete |
| Run 4 | Employee Learning PWA upgrade | ✅ Complete |
| Run 5 | Lesson content + checkpoints + safety | ✅ Complete |
| Run 6 | Demo / Live Mode + backend settings + 4P3X Guard | ✅ Complete |
| Run 7 | Employee PWA → Dashboard sync queue | ✅ Complete |
| Run 8 | Reports, validation, PWA polish, deployment readiness | ✅ Complete |

---

## Optional Future Runs

| Run | Focus |
|---|---|
| Run 9 | Supabase Backend Schema + SQL Setup Pack | ✅ Complete |
| Run 10 | Embedded 4P3X Intelligent AI™ Training Assistants |
| Run 11 | Certificates / Employer Sign-Off / Role-Based Admin |
| Run 12 | Portfolio Case Study Polish + Screenshot / Investor Demo Pack |

---

## Environment Variables

See `.env.example` for the full template.

**Public-safe variables (frontend):**

```env
VITE_AUTOSKILL_APP_NAME=AutoSkill OS
VITE_AUTOSKILL_DATA_MODE=demo
VITE_SUPABASE_URL=your_public_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_public_supabase_anon_key
```

**NEVER in frontend:**

```
SUPABASE_SERVICE_ROLE_KEY  DATABASE_URL  JWT_SECRET
PRIVATE_KEY  WEBHOOK_SECRET  OPENAI_API_KEY
GROQ_API_KEY  STRIPE_SECRET_KEY  admin tokens
service account JSON  private keys
```

---

*AutoSkill OS™ — Powered by 4P3X Intelligent AI™ — Created by Kyzel Kreates™*
