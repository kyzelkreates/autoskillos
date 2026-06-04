# AutoSkill OS™ — Backend Schema Documentation

> Powered by 4P3X Intelligent AI™ — Created by Kyzel Kreates™
> Run 9 — Supabase Backend Schema

---

## Safety Disclaimer

> AutoSkill OS™ supports training awareness, supervisor review, and evidence capture. It does not replace workplace safety procedures, legal duties, qualified supervision, employer responsibility, or site-specific training.

---

## Overview

AutoSkill OS™ uses a 24-table PostgreSQL schema hosted on Supabase. All tables live in the `public` schema with Row Level Security (RLS) enabled. The schema supports:

- Control Dashboard (training managers, supervisors, trainers)
- Employee Learning PWA (employees, trainees)
- Demo / Live mode separation via `is_demo` column
- Local-first sync queue (Run 7 compatible payload shape)
- Future multi-tenant organisation support

---

## Execution Order

| File | Purpose | Order |
|---|---|---|
| `001_autoskill_full_backend_setup.sql` | Extensions → enums → tables → indexes → functions → triggers → RLS → policies | Run first |
| `002_autoskill_seed_demo_live_data.sql` | Demo seed data (optional) | Run second (dev/demo only) |
| `099_autoskill_verification_queries.sql` | Verify tables, RLS, policies, indexes | Run any time (read-only) |
| `999_autoskill_rollback_notes.sql` | Teardown (all commented out) | Dev only, with caution |

---

## Table List & Purpose

### Organisation Layer

| Table | Purpose |
|---|---|
| `autoskill_organisations` | Top-level employer container. One row per company. Future-ready for multi-tenant. |
| `autoskill_sites` | Manufacturing sites or locations within an organisation. |
| `autoskill_profiles` | Maps Supabase `auth.users` to AutoSkill roles. Drives all RLS decisions. |

### Workforce Layer

| Table | Purpose |
|---|---|
| `autoskill_departments` | Departments (Assembly, QC, Safety Induction, Logistics, etc.). |
| `autoskill_manufacturing_stations` | Workstations and process areas within departments. |
| `autoskill_employees` | Live employee/trainee records used by dashboard and PWA. |
| `autoskill_trainers_supervisors` | Trainer and supervisor records within an organisation. |

### Training Content Layer

| Table | Purpose |
|---|---|
| `autoskill_training_pathways` | Training pathway definitions (e.g. New Starter Induction). |
| `autoskill_pathway_assignments` | Employee-to-pathway assignment records with progress. |
| `autoskill_process_modules` | Training modules within a pathway (ordered). |
| `autoskill_process_lessons` | Individual lessons within a module (ordered). |
| `autoskill_skill_checkpoints` | Checkpoint/quiz questions linked to lessons or modules. |
| `autoskill_safety_acknowledgements` | Safety acknowledgement definitions employees must confirm. |

### Employee Activity Layer

| Table | Purpose |
|---|---|
| `autoskill_employee_safety_acknowledgements` | Employee completion records for each safety acknowledgement. |
| `autoskill_competencies` | Competency definitions linked to departments/stations. |
| `autoskill_competency_links` | Competency-to-pathway/module/lesson linkage. |
| `autoskill_progress_records` | Employee lesson/module/pathway progress. Populated from sync queue. |
| `autoskill_checkpoint_submissions` | Employee checkpoint answer submissions and pass/fail results. |

### Review & Evidence Layer

| Table | Purpose |
|---|---|
| `autoskill_supervisor_reviews` | Supervisor review/sign-off workflow. Not a legal compliance record. |
| `autoskill_evidence_records` | Training evidence metadata (no file upload yet). |

### System & Infrastructure Layer

| Table | Purpose |
|---|---|
| `autoskill_dashboard_alerts` | Dashboard training flags and alert records. |
| `autoskill_sync_queue` | Backend sync queue — matches Run 7 PWA local queue shape exactly. |
| `autoskill_backend_events` | Audit/event log for backend processing activity. |
| `autoskill_app_settings` | Public-safe org settings only. ⛔ No secrets. |

---

## Key Relationships

```
autoskill_organisations
  └─ autoskill_sites
  └─ autoskill_profiles (auth.users)
  └─ autoskill_departments
       └─ autoskill_manufacturing_stations
       └─ autoskill_employees
            └─ autoskill_pathway_assignments
                 └─ autoskill_training_pathways
                      └─ autoskill_process_modules
                           └─ autoskill_process_lessons
                                └─ autoskill_skill_checkpoints
                                └─ autoskill_safety_acknowledgements
            └─ autoskill_progress_records
            └─ autoskill_checkpoint_submissions
            └─ autoskill_employee_safety_acknowledgements
            └─ autoskill_supervisor_reviews
                 └─ autoskill_evidence_records
  └─ autoskill_sync_queue
  └─ autoskill_dashboard_alerts
  └─ autoskill_backend_events
  └─ autoskill_app_settings
```

---

## RLS Summary

Row Level Security is **enabled on all 24 tables**.

| Who | Can do |
|---|---|
| **Employee** | Read and write their own progress, acks, submissions, evidence, queue items. Cannot see other employees' records. Cannot approve their own reviews. |
| **Trainer / Supervisor** | Read all org training records. Update progress statuses, reviews. Process sync queue. Create evidence and alerts. |
| **Training Manager / Admin / Owner** | Full management of org data. Manage employees, pathways, modules, lessons, departments, stations. |
| **Unauthenticated** | No access to any table. |

### RLS Helper Functions

| Function | Returns |
|---|---|
| `user_organisation_id()` | `uuid` — org ID for current `auth.uid()` |
| `is_org_admin_or_manager()` | `boolean` — true if owner/admin/training_manager |
| `is_supervisor_or_trainer()` | `boolean` — true if supervisor/trainer/manager/admin/owner |
| `is_employee_self(uuid)` | `boolean` — true if the employee_id belongs to current user |

---

## Demo / Live Data Separation

Every significant table includes `is_demo boolean not null default false`.

| Value | Meaning |
|---|---|
| `is_demo = true` | Demo/presentation record. Never shown in live active views. Created by seed file or Demo Mode PWA sessions. |
| `is_demo = false` | Live record from a real employee, trainer, or manager. |

The `autoskill_app_settings` table with key `data_mode` stores the current mode for each organisation (`demo`, `live`, `local`).

Frontend filtering: `getActiveRecordsByMode()` in the local SSOT filters by `isDemo` flag matching current demo/live mode.

---

## Employee PWA Mapping

When an employee completes a lesson, checkpoint, or safety acknowledgement in the Employee Learning PWA:

1. **Local queue item is created** (`ap3x_dm_pwa_sync_queue` in localStorage — Run 7)
2. **Control Dashboard processes the queue** locally (Run 7 `processLocalSyncQueue()`)
3. **In Live Mode (Run 10+):** Queue items are written to `autoskill_sync_queue` in Supabase
4. **Backend processing** applies items to `autoskill_progress_records`, `autoskill_employee_safety_acknowledgements`, `autoskill_checkpoint_submissions`, and `autoskill_supervisor_reviews`

---

## Control Dashboard Mapping

The Control Dashboard reads from these tables in Live Mode:

| Dashboard Panel | Backend Tables |
|---|---|
| Overview Cards | `autoskill_employees`, `autoskill_pathway_assignments`, `autoskill_progress_records`, `autoskill_safety_acknowledgements`, `autoskill_supervisor_reviews`, `autoskill_sync_queue` |
| Employee Progress | `autoskill_employees`, `autoskill_progress_records`, `autoskill_pathway_assignments` |
| Training Pathways | `autoskill_training_pathways`, `autoskill_process_modules`, `autoskill_pathway_assignments` |
| Safety Checks | `autoskill_safety_acknowledgements`, `autoskill_employee_safety_acknowledgements` |
| Supervisor Reviews | `autoskill_supervisor_reviews`, `autoskill_evidence_records` |
| Evidence | `autoskill_evidence_records` |
| Alerts | `autoskill_dashboard_alerts` |
| Sync Queue | `autoskill_sync_queue` |
| Reports | All of the above |

---

## Secret Handling

⛔ **NEVER store any of the following in any AutoSkill OS™ table, frontend code, or environment file accessible to the browser:**

- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL` (with credentials)
- `JWT_SECRET`
- `PRIVATE_KEY`
- `WEBHOOK_SECRET`
- `OPENAI_API_KEY`, `GROQ_API_KEY`, `STRIPE_SECRET_KEY`
- `AWS_SECRET_ACCESS_KEY`
- Service account JSON
- Admin tokens

The `autoskill_app_settings` table has a `CHECK (public_safe = true)` constraint — only public-safe settings may be stored there.

The 4P3X API Config Guard™ (Run 6) enforces this on the frontend settings panel.

---

## Custom Enum Types

| Enum | Values |
|---|---|
| `autoskill_profile_role` | owner, admin, training_manager, supervisor, trainer, employee |
| `autoskill_record_status` | active, paused, completed, archived, draft |
| `autoskill_progress_status` | not_started, in_progress, completed, needs_review, failed, conflict |
| `autoskill_sync_status` | local, queued, processing, synced, failed, ignored, conflict |
| `autoskill_data_mode` | demo, live, local |
| `autoskill_alert_severity` | info, warning, critical |
| `autoskill_review_status` | pending, approved, rejected, needs_more_evidence |
| `autoskill_evidence_type` | note, checklist, photo_placeholder, supervisor_note, quiz_result, training_note |
| `autoskill_checkpoint_type` | multipleChoice, checklist, acknowledgement, supervisorSignoff |
| `autoskill_sync_priority` | low, normal, high, safety_critical |

---

## Next Steps (Run 10+)

| Run | Action |
|---|---|
| Run 10 | Wire frontend Supabase client (public anon key only). Connect demo/live toggle to backend. |
| Run 11 | Employee PWA writes to `autoskill_sync_queue` in Supabase. Sync processes to progress/acks/reviews. |
| Run 12 | Live dashboard reports from Supabase. Production validation. |

---

*AutoSkill OS™ — Powered by 4P3X Intelligent AI™ — Created by Kyzel Kreates™*
