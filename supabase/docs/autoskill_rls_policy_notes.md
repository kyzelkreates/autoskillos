# AutoSkill OS™ — RLS Policy Notes

> Powered by 4P3X Intelligent AI™ — Created by Kyzel Kreates™
> Run 9 — Supabase Backend Schema

---

## Overview

Row Level Security (RLS) is **enabled on all 24 AutoSkill OS™ tables**.

Every query against these tables — from any connected client, including the frontend using the public anon key — is automatically filtered by the active RLS policies. No user can read or write data outside their organisation or role.

---

## The Core Principle: Organisation Scoping

Every data record in AutoSkill OS™ belongs to an organisation (`organisation_id`). Every RLS policy checks that the current user's `organisation_id` matches the record's `organisation_id`.

This is enforced by the helper function:

```sql
public.user_organisation_id()
-- Returns the organisation_id from autoskill_profiles WHERE id = auth.uid()
```

If a user has no profile row (i.e. they have not completed signup), `user_organisation_id()` returns `null`, and they see **nothing** — which is correct and safe.

---

## Role Hierarchy

Roles are stored in `autoskill_profiles.role` as the `autoskill_profile_role` enum.

| Role | Access Level |
|---|---|
| `owner` | Full org access. Manage everything. |
| `admin` | Full org access. Manage everything. |
| `training_manager` | Manage training content, employees, pathways. Cannot delete org. |
| `supervisor` | Read all org training data. Create/update reviews. Process sync queue. |
| `trainer` | Read all org training data. Create/update training content and reviews. |
| `employee` | Read own assigned training content. Write own progress/acks/queue items only. |

### RLS Helper Functions

```sql
-- Returns the organisation_id for the current auth.uid()
public.user_organisation_id()

-- Returns true if current user is owner, admin, or training_manager
public.is_org_admin_or_manager()

-- Returns true if current user is supervisor, trainer, or above
public.is_supervisor_or_trainer()

-- Returns true if the given employee_id is linked to the current auth user
public.is_employee_self(p_employee_id uuid)
```

All functions use `security definer` to ensure safe, predictable RLS evaluation without privilege escalation.

---

## Policy Groups by Table

### Organisation & Site Tables

| Table | Policy | Who |
|---|---|---|
| `autoskill_organisations` | SELECT | Org members (own org only) |
| `autoskill_organisations` | UPDATE | Owner/admin/manager |
| `autoskill_sites` | SELECT | All org members |
| `autoskill_sites` | ALL | Owner/admin/manager |

### Profiles

| Table | Policy | Who | Notes |
|---|---|---|---|
| `autoskill_profiles` | SELECT | Own profile | `id = auth.uid()` |
| `autoskill_profiles` | SELECT | Supervisors+ | Read all org profiles |
| `autoskill_profiles` | UPDATE | Own profile | Cannot change own role (enforced via `with check`) |
| `autoskill_profiles` | ALL | Admins/managers | Full org profile management |
| `autoskill_profiles` | INSERT | Self on signup | `id = auth.uid()` |

> Employees cannot escalate their own role. The `user_update_own_profile` policy uses `with check` to enforce the role stays unchanged.

### Departments & Stations

| Table | Employees | Supervisors+ | Admins |
|---|---|---|---|
| `autoskill_departments` | SELECT | SELECT | ALL |
| `autoskill_manufacturing_stations` | SELECT | SELECT | ALL |

### Employees & Trainers

| Table | Self (employee) | Supervisors+ | Admins |
|---|---|---|---|
| `autoskill_employees` | SELECT (own only) | SELECT (all org) | ALL |
| `autoskill_trainers_supervisors` | none | SELECT | ALL |

> Employees can only read their own employee record. They cannot browse other employees' records or progress.

### Training Content

| Table | Employees | Trainers/Supervisors | Admins |
|---|---|---|---|
| `autoskill_training_pathways` | SELECT (active only) | ALL | ALL |
| `autoskill_pathway_assignments` | SELECT (own) | ALL | ALL |
| `autoskill_process_modules` | SELECT | ALL | ALL |
| `autoskill_process_lessons` | SELECT | ALL | ALL |
| `autoskill_skill_checkpoints` | SELECT | ALL | ALL |
| `autoskill_safety_acknowledgements` | SELECT | ALL | ALL |

### Employee Activity Records

| Table | Employee | Supervisor/Trainer | Admin |
|---|---|---|---|
| `autoskill_employee_safety_acknowledgements` | INSERT + SELECT (own) | SELECT + UPDATE sync status | ALL |
| `autoskill_progress_records` | INSERT + SELECT + UPDATE (own) | SELECT + UPDATE status | ALL |
| `autoskill_checkpoint_submissions` | INSERT + SELECT (own) | SELECT | ALL |
| `autoskill_competencies` | SELECT | ALL | ALL |
| `autoskill_competency_links` | SELECT | ALL | ALL |

### Supervisor Reviews

| Table | Employee | Supervisor/Trainer | Admin |
|---|---|---|---|
| `autoskill_supervisor_reviews` | SELECT (own status) + INSERT (pending only) | SELECT + INSERT + UPDATE | ALL |

Key rules:
- Employees can **request** a review (`INSERT` with `status = 'pending'`).
- Employees **cannot approve** their own reviews — only supervisors/trainers can update status to `approved`.
- Employees see only the status of their own reviews, not other employees' reviews.

### Evidence Records

| Table | Employee | Supervisor/Trainer | Admin |
|---|---|---|---|
| `autoskill_evidence_records` | INSERT (non-supervisor-note) + SELECT (own) | ALL | ALL |

- Employees cannot create `supervisor_note` evidence type. Only supervisors can.
- Employees read only their own evidence records.

### Dashboard & System Tables

| Table | Employee | Supervisor/Trainer | Admin |
|---|---|---|---|
| `autoskill_dashboard_alerts` | SELECT (own, non-critical only) | ALL | ALL |
| `autoskill_sync_queue` | INSERT (queued only) + SELECT (own) | SELECT + UPDATE | ALL |
| `autoskill_backend_events` | none | INSERT | SELECT + INSERT |
| `autoskill_app_settings` | SELECT (public_safe only) | SELECT (public_safe only) | ALL (public_safe only) |

Key rules:
- Employees can only INSERT `queued` sync queue items. They cannot mark items `synced` or `processing`.
- Only supervisors/managers can process (UPDATE) sync queue items.
- `autoskill_app_settings` has a `CHECK (public_safe = true)` constraint — backend-only secrets cannot be inserted at the database level.

---

## What RLS Does NOT Do

RLS secures row-level access but does **not**:

- Prevent the **Supabase service role key** holder from bypassing RLS entirely. The service role key must NEVER be used in frontend code.
- Replace application-layer validation. Frontend should still validate input.
- Protect data from the Supabase dashboard (which uses the service role).
- Audit every data change — use `autoskill_backend_events` and Supabase's built-in audit log for that.

---

## Service Role Key Warning

**CRITICAL: The Supabase `service_role` key BYPASSES all RLS policies.**

The service role key must:
- NEVER appear in frontend code (JavaScript, HTML, `.env` files accessible to the browser)
- NEVER be committed to a public Git repository
- ONLY be used in server-side environments (Supabase Edge Functions, backend APIs, CI/CD)
- NEVER be stored in `autoskill_app_settings` or any database table

The frontend uses ONLY the **anon key** (`VITE_SUPABASE_ANON_KEY`), which is subject to all RLS policies defined here.

The **4P3X API Config Guard™** (Run 6) enforces this on the frontend settings panel — it blocks any attempt to save a `service_role` value in the browser.

---

## Demo / Live Data Isolation

In addition to RLS, the `is_demo` column on every table provides application-layer separation.

| `is_demo` value | Meaning |
|---|---|
| `true` | Demo/presentation record. Never shown in live active views. |
| `false` | Live record from a real employee or trainer session. |

The frontend `getActiveRecordsByMode()` filters by `isDemo` matching the current mode. In Live Mode (Run 10+), the Supabase client will add `.eq('is_demo', false)` to all queries automatically.

---

## RLS Verification

After running `001_autoskill_full_backend_setup.sql`, confirm RLS is active:

```sql
-- From 099_autoskill_verification_queries.sql
select tablename, rowsecurity as rls_enabled
from pg_tables
where schemaname = 'public'
  and tablename  like 'autoskill_%'
order by tablename;
-- Every row must show rls_enabled = true
```

---

## Safety Disclaimer

> AutoSkill OS™ supports training awareness, supervisor review, and evidence capture. It does not replace workplace safety procedures, legal duties, qualified supervision, employer responsibility, or site-specific training.

RLS policies restrict data access within the application. They are not a substitute for organisational data governance, legal compliance review, or qualified HR/training management oversight.

---

*AutoSkill OS™ — Powered by 4P3X Intelligent AI™ — Created by Kyzel Kreates™*
