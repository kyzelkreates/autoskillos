# AutoSkill OS™

**Manufacturing Training Control Dashboard + Employee Learning PWA**

> Powered by 4P3X Intelligent AI™ · Created by Kyzel Kreates™

---

## Project Identity

| Field | Value |
|---|---|
| **Product Name** | AutoSkill OS™ |
| **Type** | Local-first and live-backend-ready manufacturing training platform |
| **Dashboard** | Control Dashboard — supervisor, trainer, manager |
| **PWA** | Employee Learning PWA — employee, trainee |
| **AI Engine** | Powered by 4P3X Intelligent AI™ |
| **Creator** | Kyzel Kreates™ |
| **Data Model** | Local-first SSOT with live Supabase backend support |
| **Sync** | Employee PWA → local queue → live Supabase backend → Control Dashboard |
| **Build Plan** | 12-run production build — complete |

---

## The Product Phrase

> **Demo Mode shows the product. Live Mode runs the product.**

---

## Portfolio Description

AutoSkill OS™ demonstrates how a local-first training platform can move from portfolio/demo mode into a live backend-ready workforce training system. Demo Mode shows the product with safe sample manufacturing training data. Live Mode runs the product through a configured backend such as Supabase, allowing real employee records, training progress, supervisor review workflows, reports, and PWA-to-dashboard activity sync.

---

## Main Features

### Control Dashboard
- Manufacturing Training Centre overview
- Live employee progress table (demo or Supabase live)
- Training Pathways panel
- Department & Manufacturing Stations panel
- Safety Acknowledgement panel
- Supervisor Review Queue
- Training Evidence panel
- Dashboard Alerts panel
- **Reports & Evidence Centre** (7 report types — live data source aware)
- **Employee PWA Sync Queue** (local + live sync health)
- Demo / Live Mode status panel
- Backend Provider Settings (Supabase, Firebase, AWS, REST)
- 4P3X API Config Guard™ (blocks all forbidden frontend secrets)

### Employee Learning PWA
- Installs as a PWA (Add to Home Screen / HTTPS)
- Offline-first local storage
- 3 manufacturing training modules (15 lessons total)
- Module 1 — Site Orientation & Induction
- Module 2 — Quality Control & PPE
- Module 3 — Competency Assessment & Final Check
- Interactive skill checkpoints per lesson
- Safety acknowledgement flow
- Training progress tracker with XP
- Supervisor review request button
- Local sync queue (demo mode)
- **Live Supabase sync** (live mode — when configured and authorised)
- PWA live sync status badge with retry support
- Install guidance in-app

### Live Backend Sync (Run 11)
When Demo Mode is OFF and Supabase is configured:
- Lesson started/completed → `autoskill_sync_queue` + `autoskill_progress_records`
- Checkpoint submitted → `autoskill_checkpoint_submissions` + queue
- Safety acknowledged → `autoskill_employee_safety_acknowledgements` + queue
- Training note saved → `autoskill_evidence_records` + queue
- Supervisor review requested → `autoskill_supervisor_reviews` + queue
- Failed writes queued locally for retry (max 3 attempts)
- RLS/auth failures shown honestly — no fake success

### Reports & Evidence Centre (7 reports)
1. Training Overview Report (live data source aware)
2. Employee Training Summary Report
3. Pathway Completion Report
4. Safety Acknowledgement Report
5. Supervisor Review Report
6. **Sync Queue & Live Sync Health Report** (Run 12)
7. Demo / Live Readiness Report (Run 12)

All reports: data source labelled, printable, copyable, JSON-exportable.

### Backend Settings Layer
- Local-only mode (default, demo works without backend)
- Supabase (public-safe anon key only — RLS enabled)
- Firebase (public web config only)
- AWS / Custom backend (public endpoint only)
- Generic REST endpoint
- 4P3X API Config Guard™ — blocks all forbidden secrets

### 4P3X API Config Guard™
Blocks the following from being saved in frontend settings:

```
SUPABASE_SERVICE_ROLE_KEY  OPENAI_API_KEY  GROQ_API_KEY
STRIPE_SECRET_KEY  DATABASE_URL  JWT_SECRET  PRIVATE_KEY
WEBHOOK_SECRET  service_role  service account  private_key
AWS_SECRET_ACCESS_KEY  secretAccessKey  client_secret  admin token
```

---

## Demo / Live Mode

| Mode | Behaviour |
|---|---|
| **Demo Mode ON** | Shows sample manufacturing training records (`isDemo: true`). All panels and reports populated. No backend needed. |
| **Demo Mode OFF (Live)** | Hides demo records. Shows live backend data where configured and authorised. Live-ready empty states when no backend connected. |

---

## Backend Configuration

Demo/local mode works completely without a backend.

When ready for live deployment:

| Provider | Config needed in frontend |
|---|---|
| **Supabase** *(recommended)* | `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` (public only) |
| **Firebase** | Public web app config (no service account) |
| **AWS / Custom** | Public API Gateway endpoint + region |
| **Custom REST** | API base URL + optional public client token |

> **NEVER** place `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `JWT_SECRET`, `PRIVATE_KEY`, `WEBHOOK_SECRET`, service account JSON, or admin tokens in any frontend `.env` file or browser config.

---

## Supabase Setup

1. Create a Supabase project.
2. Open Supabase SQL Editor.
3. Run in order:
   ```
   supabase/sql/001_autoskill_full_backend_setup.sql   ← Full schema + RLS
   supabase/sql/002_autoskill_seed_demo_live_data.sql  ← Optional demo seed
   supabase/sql/012_autoskill_final_validation_patch.sql ← Indexes + views
   ```
4. Copy your **Project URL** and **anon/public key** from Supabase Settings → API.
5. Enter them in the AutoSkill OS™ Control Dashboard → Settings → Backend Provider → Supabase.
6. Run the connection test. Expected result: `✅ Connected` or `🔑 Auth required (RLS active)`.
7. Create employee profiles with matching `auth.uid()` values for RLS to allow live records.

> RLS is enabled on all tables. Live records require authenticated employee context.  
> See `supabase/docs/` for schema docs, frontend mapping, and RLS policy notes.

---

## Environment Variables

```bash
# .env / Vercel / Netlify environment variables
# Public-safe values only — safe to commit to frontend config

VITE_AUTOSKILL_APP_NAME=AutoSkill OS
VITE_AUTOSKILL_DATA_MODE=demo
VITE_SUPABASE_URL=your_public_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_public_supabase_anon_key
```

> ⛔ **NEVER add to frontend .env:**  
> `SUPABASE_SERVICE_ROLE_KEY` · `DATABASE_URL` · `JWT_SECRET` · `PRIVATE_KEY`  
> `WEBHOOK_SECRET` · `OPENAI_API_KEY` · `GROQ_API_KEY` · `STRIPE_SECRET_KEY`  
> Service account JSON · Admin tokens · Private keys of any kind

---

## Local Development

This is a static HTML/JS project — no bundler required.

```bash
# Option 1: Python local server (no install)
cd 4p3x_carelink
python3 -m http.server 8080

# Option 2: Node.js serve
npm install -g serve
serve .
# or: npx serve .

# Option 3: VS Code Live Server
# Right-click index.html → Open with Live Server
```

**Access:**
- Root: `http://localhost:8080/` → redirects to demo
- Control Dashboard: `http://localhost:8080/ap3x/demo/clinician-demo.html`
- Employee Learning PWA: `http://localhost:8080/ap3x/patient-pwa/`

> PWA install and service worker require HTTPS or `localhost`. Use `localhost` for local testing.

**If using a bundler/framework wrapper:**
```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview production build
```

---

## Deployment — Vercel

1. Push project to GitHub.
2. Connect repo to [Vercel](https://vercel.com).
3. Framework preset: **Other** (static site).
4. Output directory: `.` (root — no build step needed for static version).
5. Add **public** environment variables only:
   ```
   VITE_AUTOSKILL_APP_NAME = AutoSkill OS
   VITE_AUTOSKILL_DATA_MODE = demo
   VITE_SUPABASE_URL = your_public_supabase_project_url
   VITE_SUPABASE_ANON_KEY = your_public_anon_key
   ```
6. Click **Deploy**.
7. After deployment, verify:
   - Control Dashboard loads
   - Employee PWA loads and installs (HTTPS triggers install prompt)
   - Demo Mode shows training data
   - Live Mode shows empty states (if no backend configured yet)
   - Supabase connection test returns honest result

### Netlify

1. Drag the `4p3x_carelink` folder into Netlify Drop, or connect GitHub repo.
2. Build command: *(leave blank for static)*
3. Publish directory: `.`
4. Add public env vars as above.

### CORS Note

If using Supabase, add your Vercel/Netlify domain to your Supabase project's **Auth → URL Configuration → Redirect URLs** and **API → CORS allowed origins** as needed.

---

## Post-Deployment Validation Checklist

- [ ] Control Dashboard loads at `/ap3x/demo/clinician-demo.html`
- [ ] Employee Learning PWA loads at `/ap3x/patient-pwa/`
- [ ] Demo Mode ON — demo employees/pathways/lessons appear
- [ ] Demo Mode OFF — live-ready empty states appear
- [ ] Backend Settings panel opens without error
- [ ] Forbidden secrets blocked by 4P3X API Config Guard™
- [ ] At least one lesson opens and completes
- [ ] Checkpoint displays and accepts answer
- [ ] Safety acknowledgement can be accepted
- [ ] PWA Sync Queue shows items after PWA actions
- [ ] Process Local Queue processes demo items in dashboard
- [ ] Reports & Evidence Centre loads all 7 reports
- [ ] Sync Queue & Live Sync Health report shows honest status
- [ ] Demo / Live Readiness report shows deployment readiness
- [ ] Print/Copy/Export actions work
- [ ] PWA install prompt appears on HTTPS
- [ ] App works offline after install
- [ ] No backend secrets in browser DevTools → Network or Storage
- [ ] Console has no critical errors
- [ ] Supabase connection test returns ✅ or honest RLS/auth message

---

## 12-Run Production Build — Status

| Run | Focus | Status |
|---|---|---|
| Run 1 | Branding + language refactor (TherapyLink → AutoSkill OS) | ✅ Complete |
| Run 2 | Manufacturing SSOT / data model | ✅ Complete |
| Run 3 | Control Dashboard upgrade | ✅ Complete |
| Run 4 | Employee Learning PWA upgrade | ✅ Complete |
| Run 5 | Lesson content + checkpoints + safety acknowledgements | ✅ Complete |
| Run 6 | Demo / Live Mode + backend settings + 4P3X Guard | ✅ Complete |
| Run 7 | Employee PWA → Dashboard sync queue | ✅ Complete |
| Run 8 | Reports, validation, PWA polish, deployment readiness | ✅ Complete |
| Run 9 | Supabase Backend Schema + SQL Setup Pack | ✅ Complete |
| Run 10 | Live Backend Connector + Demo/Live Switch Wiring | ✅ Complete |
| Run 11 | Employee PWA Live Sync (Supabase anon client writes) | ✅ Complete |
| Run 12 | Live Dashboard Reports + Production Validation | ✅ Complete |

---

## Optional Future Runs

| Run | Focus |
|---|---|
| Run 13 | Embedded 4P3X Intelligent AI™ Training Assistants |
| Run 14 | Employer Admin Roles + Certificates + Supervisor Sign-Off Expansion |
| Run 15 | Portfolio Case Study / Investor Demo Pack / Screenshot Pack |
| Run 16 | Multi-Organisation SaaS Tier / White Label Expansion |

---

## Project Structure

```
4p3x_carelink/
├── ap3x/
│   ├── demo/
│   │   └── clinician-demo.html        ← Control Dashboard (single-file app, ~4200 lines)
│   ├── patient-pwa/
│   │   ├── index.html                 ← PWA shell
│   │   ├── patient-app.js             ← PWA logic (~2600 lines, Runs 4–12)
│   │   ├── patient.css                ← PWA styles
│   │   ├── manifest.json              ← PWA manifest (AutoSkill OS™)
│   │   └── ap3x-sw.js                 ← Service worker (v5, offline cache)
│   └── shared/
│       ├── data-model.js              ← Manufacturing training SSOT
│       ├── constants.js               ← App constants
│       ├── auth.js                    ← Auth helpers
│       ├── lesson-content.js          ← 15 manufacturing lessons
│       └── sync-service.js            ← Sync helpers
├── supabase/
│   ├── sql/
│   │   ├── 001_autoskill_full_backend_setup.sql    ← Full schema + RLS (Run 9)
│   │   ├── 002_autoskill_seed_demo_live_data.sql   ← Optional demo seed
│   │   ├── 012_autoskill_final_validation_patch.sql ← Indexes + views (Run 12)
│   │   ├── 099_autoskill_verification_queries.sql  ← Verification queries
│   │   └── 999_autoskill_rollback_notes.sql        ← Rollback guidance
│   └── docs/
│       ├── autoskill_backend_schema.md             ← Schema reference
│       ├── autoskill_frontend_mapping.md           ← Frontend ↔ table mapping
│       └── autoskill_rls_policy_notes.md           ← RLS policy notes
├── .env.example                       ← Public-safe env template
├── vercel.json                        ← Vercel routing config
├── index.html                         ← Root redirect
└── README.md                          ← This file
```

---

## Safety & Legal Disclaimer

> AutoSkill OS™ supports training awareness, supervisor review, and evidence capture. It does not replace workplace safety procedures, legal duties, qualified supervision, employer responsibility, or site-specific training.

Reports, safety acknowledgements, supervisor reviews, and competency records produced by AutoSkill OS™ are training management tools only. They do not constitute legal compliance records, official certifications, or safety approvals.

---

*Powered by 4P3X Intelligent AI™ · Created by Kyzel Kreates™*
