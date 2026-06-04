-- ════════════════════════════════════════════════════════════════════════════
-- AutoSkill OS™ — Full Supabase Backend Setup SQL
-- Run 9 — Supabase Backend Schema + SQL Setup Pack
-- ────────────────────────────────────────────────────────────────────────────
-- Powered by 4P3X Intelligent AI™ — Created by Kyzel Kreates™
-- ────────────────────────────────────────────────────────────────────────────
-- PURPOSE:
--   Complete PostgreSQL/Supabase schema for AutoSkill OS™ live backend.
--   Supports Control Dashboard + Employee Learning PWA in Live Mode.
--
-- EXECUTION:
--   Run inside Supabase SQL Editor on a clean project.
--   NEVER run from frontend code.
--   NEVER include SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL, JWT_SECRET,
--   PRIVATE_KEY, WEBHOOK_SECRET, or any admin token anywhere in frontend.
--
-- EXECUTION ORDER (ENFORCED IN THIS FILE):
--   1.  Extensions
--   2.  Custom Types / Enums
--   3.  Tables (in dependency order)
--   4.  Indexes
--   5.  Functions
--   6.  Triggers
--   7.  RLS Enablement
--   8.  Policies
--
-- SAFETY DISCLAIMER:
--   AutoSkill OS™ supports training awareness, supervisor review, and evidence
--   capture. It does not replace workplace safety procedures, legal duties,
--   qualified supervision, employer responsibility, or site-specific training.
-- ════════════════════════════════════════════════════════════════════════════


-- ════════════════════════════════════════════════════════════════════════════
-- STEP 1: EXTENSIONS
-- ════════════════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";


-- ════════════════════════════════════════════════════════════════════════════
-- STEP 2: CUSTOM TYPES / ENUMS
-- Create all enums before any table references them.
-- ════════════════════════════════════════════════════════════════════════════

-- User/profile role within an organisation
do $$ begin
  create type autoskill_profile_role as enum (
    'owner', 'admin', 'training_manager', 'supervisor', 'trainer', 'employee'
  );
exception when duplicate_object then null; end $$;

-- General record lifecycle status
do $$ begin
  create type autoskill_record_status as enum (
    'active', 'paused', 'completed', 'archived', 'draft'
  );
exception when duplicate_object then null; end $$;

-- Training progress state
do $$ begin
  create type autoskill_progress_status as enum (
    'not_started', 'in_progress', 'completed', 'needs_review', 'failed', 'conflict'
  );
exception when duplicate_object then null; end $$;

-- Sync queue item lifecycle
do $$ begin
  create type autoskill_sync_status as enum (
    'local', 'queued', 'processing', 'synced', 'failed', 'ignored', 'conflict'
  );
exception when duplicate_object then null; end $$;

-- Data mode separation (critical for demo/live split)
do $$ begin
  create type autoskill_data_mode as enum (
    'demo', 'live', 'local'
  );
exception when duplicate_object then null; end $$;

-- Dashboard alert severity
do $$ begin
  create type autoskill_alert_severity as enum (
    'info', 'warning', 'critical'
  );
exception when duplicate_object then null; end $$;

-- Supervisor review workflow states
do $$ begin
  create type autoskill_review_status as enum (
    'pending', 'approved', 'rejected', 'needs_more_evidence'
  );
exception when duplicate_object then null; end $$;

-- Evidence record types
do $$ begin
  create type autoskill_evidence_type as enum (
    'note', 'checklist', 'photo_placeholder', 'supervisor_note', 'quiz_result', 'training_note'
  );
exception when duplicate_object then null; end $$;

-- Checkpoint/quiz question types
do $$ begin
  create type autoskill_checkpoint_type as enum (
    'multipleChoice', 'checklist', 'acknowledgement', 'supervisorSignoff'
  );
exception when duplicate_object then null; end $$;

-- Sync queue event priority
do $$ begin
  create type autoskill_sync_priority as enum (
    'low', 'normal', 'high', 'safety_critical'
  );
exception when duplicate_object then null; end $$;


-- ════════════════════════════════════════════════════════════════════════════
-- STEP 3: TABLES (in strict foreign-key dependency order)
-- ════════════════════════════════════════════════════════════════════════════

-- ── 3.01 autoskill_organisations ─────────────────────────────────────────
-- Top-level employer / organisation container. Future-ready for multi-tenant.
create table if not exists public.autoskill_organisations (
  id            uuid        primary key default gen_random_uuid(),
  name          text        not null,
  slug          text        unique,
  status        autoskill_record_status not null default 'active',
  created_by    uuid        references auth.users(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
comment on table public.autoskill_organisations is
  'AutoSkill OS™ — Organisation/employer container. One org per employer.';

-- ── 3.02 autoskill_sites ─────────────────────────────────────────────────
-- Manufacturing sites or physical locations within an organisation.
create table if not exists public.autoskill_sites (
  id              uuid        primary key default gen_random_uuid(),
  organisation_id uuid        not null references public.autoskill_organisations(id) on delete cascade,
  name            text        not null,
  description     text,
  location_label  text,
  status          autoskill_record_status not null default 'active',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
comment on table public.autoskill_sites is
  'AutoSkill OS™ — Manufacturing sites or locations within an organisation.';

-- ── 3.03 autoskill_profiles ──────────────────────────────────────────────
-- Maps Supabase auth.users to AutoSkill OS™ roles. One profile per auth user.
create table if not exists public.autoskill_profiles (
  id              uuid        primary key references auth.users(id) on delete cascade,
  organisation_id uuid        references public.autoskill_organisations(id) on delete set null,
  site_id         uuid        references public.autoskill_sites(id) on delete set null,
  display_name    text        not null,
  email           text,
  role            autoskill_profile_role not null default 'employee',
  department_id   uuid,       -- FK added later after autoskill_departments exists
  employee_number text,
  status          autoskill_record_status not null default 'active',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
comment on table public.autoskill_profiles is
  'AutoSkill OS™ — Auth user to role mapping. Drives all RLS decisions.';

-- ── 3.04 autoskill_departments ───────────────────────────────────────────
-- Departments: Assembly Line, Quality Control, Safety Induction, Logistics, etc.
create table if not exists public.autoskill_departments (
  id                uuid        primary key default gen_random_uuid(),
  organisation_id   uuid        not null references public.autoskill_organisations(id) on delete cascade,
  site_id           uuid        references public.autoskill_sites(id) on delete set null,
  name              text        not null,
  description       text,
  manager_profile_id uuid       references public.autoskill_profiles(id) on delete set null,
  status            autoskill_record_status not null default 'active',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
comment on table public.autoskill_departments is
  'AutoSkill OS™ — Manufacturing departments (Assembly, QC, Safety, Logistics, etc.).';

-- Now add the deferred FK on profiles.department_id
alter table public.autoskill_profiles
  add column if not exists department_id_fk uuid references public.autoskill_departments(id) on delete set null;
-- Note: department_id column already created above as plain uuid; we add the constrained column.
-- If profiles.department_id should be the FK column, alter it:
alter table public.autoskill_profiles
  drop column if exists department_id;
alter table public.autoskill_profiles
  rename column department_id_fk to department_id;

-- ── 3.05 autoskill_manufacturing_stations ────────────────────────────────
-- Workstations / process areas within departments.
create table if not exists public.autoskill_manufacturing_stations (
  id              uuid        primary key default gen_random_uuid(),
  organisation_id uuid        not null references public.autoskill_organisations(id) on delete cascade,
  site_id         uuid        references public.autoskill_sites(id) on delete set null,
  department_id   uuid        references public.autoskill_departments(id) on delete set null,
  name            text        not null,
  description     text,
  safety_critical boolean     not null default false,
  required_ppe    jsonb       not null default '[]',
  status          autoskill_record_status not null default 'active',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
comment on table public.autoskill_manufacturing_stations is
  'AutoSkill OS™ — Manufacturing workstations and process areas.';

-- ── 3.06 autoskill_employees ─────────────────────────────────────────────
-- Live employee / trainee records used by dashboard and PWA.
create table if not exists public.autoskill_employees (
  id                          uuid        primary key default gen_random_uuid(),
  organisation_id             uuid        not null references public.autoskill_organisations(id) on delete cascade,
  site_id                     uuid        references public.autoskill_sites(id) on delete set null,
  profile_id                  uuid        references public.autoskill_profiles(id) on delete set null,
  display_name                text        not null,
  email                       text,
  employee_number             text,
  role_title                  text,
  department_id               uuid        references public.autoskill_departments(id) on delete set null,
  shift                       text,
  employment_status           autoskill_record_status not null default 'active',
  competency_status           text        check (competency_status in ('not_assessed','in_progress','competent','needs_review','failed')),
  safety_acknowledgement_status text      check (safety_acknowledgement_status in ('pending','partial','complete','overdue')),
  last_activity_at            timestamptz,
  progress_percent            numeric     not null default 0 check (progress_percent between 0 and 100),
  sync_status                 autoskill_sync_status not null default 'local',
  is_demo                     boolean     not null default false,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);
comment on table public.autoskill_employees is
  'AutoSkill OS™ — Live employee/trainee records. is_demo=true for demo data.';

-- ── 3.07 autoskill_trainers_supervisors ──────────────────────────────────
-- Trainer / supervisor records (may also be autoskill_profiles).
create table if not exists public.autoskill_trainers_supervisors (
  id              uuid        primary key default gen_random_uuid(),
  organisation_id uuid        not null references public.autoskill_organisations(id) on delete cascade,
  site_id         uuid        references public.autoskill_sites(id) on delete set null,
  profile_id      uuid        references public.autoskill_profiles(id) on delete set null,
  display_name    text        not null,
  role_title      text,
  department_id   uuid        references public.autoskill_departments(id) on delete set null,
  permissions     jsonb       not null default '{}',
  status          autoskill_record_status not null default 'active',
  is_demo         boolean     not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
comment on table public.autoskill_trainers_supervisors is
  'AutoSkill OS™ — Trainer and supervisor records within an organisation.';

-- ── 3.08 autoskill_training_pathways ─────────────────────────────────────
-- Training pathway definitions (e.g. New Starter Induction).
create table if not exists public.autoskill_training_pathways (
  id                  uuid        primary key default gen_random_uuid(),
  organisation_id     uuid        not null references public.autoskill_organisations(id) on delete cascade,
  site_id             uuid        references public.autoskill_sites(id) on delete set null,
  department_id       uuid        references public.autoskill_departments(id) on delete set null,
  title               text        not null,
  description         text,
  required_for_roles  jsonb       not null default '[]',
  estimated_duration  text,
  status              autoskill_record_status not null default 'active',
  safety_critical     boolean     not null default false,
  is_demo             boolean     not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
comment on table public.autoskill_training_pathways is
  'AutoSkill OS™ — Training pathway definitions assigned to employees.';

-- ── 3.09 autoskill_pathway_assignments ───────────────────────────────────
-- Assigns specific employees to specific training pathways.
create table if not exists public.autoskill_pathway_assignments (
  id              uuid        primary key default gen_random_uuid(),
  organisation_id uuid        not null references public.autoskill_organisations(id) on delete cascade,
  employee_id     uuid        not null references public.autoskill_employees(id) on delete cascade,
  pathway_id      uuid        not null references public.autoskill_training_pathways(id) on delete cascade,
  assigned_by     uuid        references public.autoskill_profiles(id) on delete set null,
  status          autoskill_record_status not null default 'active',
  assigned_at     timestamptz not null default now(),
  due_at          timestamptz,
  completed_at    timestamptz,
  progress_percent numeric     not null default 0 check (progress_percent between 0 and 100),
  is_demo         boolean     not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (employee_id, pathway_id)
);
comment on table public.autoskill_pathway_assignments is
  'AutoSkill OS™ — Employee-to-pathway assignment records.';

-- ── 3.10 autoskill_process_modules ───────────────────────────────────────
-- Training modules within a pathway.
create table if not exists public.autoskill_process_modules (
  id                  uuid        primary key default gen_random_uuid(),
  organisation_id     uuid        not null references public.autoskill_organisations(id) on delete cascade,
  pathway_id          uuid        not null references public.autoskill_training_pathways(id) on delete cascade,
  title               text        not null,
  description         text,
  module_order        integer     not null default 1,
  estimated_duration  text,
  safety_critical     boolean     not null default false,
  completion_required boolean     not null default true,
  is_demo             boolean     not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
comment on table public.autoskill_process_modules is
  'AutoSkill OS™ — Training modules within a pathway.';

-- ── 3.11 autoskill_process_lessons ───────────────────────────────────────
-- Individual lessons within a training module.
create table if not exists public.autoskill_process_lessons (
  id                          uuid        primary key default gen_random_uuid(),
  organisation_id             uuid        not null references public.autoskill_organisations(id) on delete cascade,
  module_id                   uuid        not null references public.autoskill_process_modules(id) on delete cascade,
  pathway_id                  uuid        not null references public.autoskill_training_pathways(id) on delete cascade,
  title                       text        not null,
  summary                     text,
  content                     text,
  key_points                  jsonb       not null default '[]',
  lesson_order                integer     not null default 1,
  estimated_duration          text,
  lesson_type                 text        not null default 'standard'
                                          check (lesson_type in ('standard','safety','checkpoint','acknowledgement','video')),
  safety_critical             boolean     not null default false,
  required_acknowledgement_id uuid,       -- FK added after safety_acknowledgements table
  completion_rules            jsonb       not null default '{}',
  is_demo                     boolean     not null default false,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);
comment on table public.autoskill_process_lessons is
  'AutoSkill OS™ — Individual training lessons within a module.';

-- ── 3.12 autoskill_skill_checkpoints ─────────────────────────────────────
-- Quiz/checkpoint questions linked to lessons/modules.
create table if not exists public.autoskill_skill_checkpoints (
  id              uuid        primary key default gen_random_uuid(),
  organisation_id uuid        not null references public.autoskill_organisations(id) on delete cascade,
  pathway_id      uuid        references public.autoskill_training_pathways(id) on delete cascade,
  module_id       uuid        references public.autoskill_process_modules(id) on delete cascade,
  lesson_id       uuid        references public.autoskill_process_lessons(id) on delete cascade,
  question        text        not null,
  checkpoint_type autoskill_checkpoint_type not null default 'multipleChoice',
  options         jsonb       not null default '[]',
  correct_answer  text,
  required        boolean     not null default true,
  safety_critical boolean     not null default false,
  pass_required   boolean     not null default true,
  feedback_text   text,
  is_demo         boolean     not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
comment on table public.autoskill_skill_checkpoints is
  'AutoSkill OS™ — Checkpoint/quiz questions linked to lessons or modules.';

-- ── 3.13 autoskill_safety_acknowledgements ───────────────────────────────
-- Defined safety acknowledgements employees must confirm.
create table if not exists public.autoskill_safety_acknowledgements (
  id                        uuid        primary key default gen_random_uuid(),
  organisation_id           uuid        not null references public.autoskill_organisations(id) on delete cascade,
  pathway_id                uuid        references public.autoskill_training_pathways(id) on delete set null,
  module_id                 uuid        references public.autoskill_process_modules(id) on delete set null,
  lesson_id                 uuid        references public.autoskill_process_lessons(id) on delete set null,
  title                     text        not null,
  description               text,
  acknowledgement_text      text        not null,
  required_for_completion   boolean     not null default true,
  legal_critical            boolean     not null default false,
  safety_critical           boolean     not null default true,
  is_demo                   boolean     not null default false,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);
comment on table public.autoskill_safety_acknowledgements is
  'AutoSkill OS™ — Safety acknowledgement definitions. Not a legal compliance record.';

-- Add deferred FK from process_lessons.required_acknowledgement_id
alter table public.autoskill_process_lessons
  add constraint if not exists fk_lesson_required_ack
  foreign key (required_acknowledgement_id)
  references public.autoskill_safety_acknowledgements(id) on delete set null;

-- ── 3.14 autoskill_employee_safety_acknowledgements ──────────────────────
-- Employee completion records for each safety acknowledgement.
create table if not exists public.autoskill_employee_safety_acknowledgements (
  id                  uuid        primary key default gen_random_uuid(),
  organisation_id     uuid        not null references public.autoskill_organisations(id) on delete cascade,
  employee_id         uuid        not null references public.autoskill_employees(id) on delete cascade,
  acknowledgement_id  uuid        not null references public.autoskill_safety_acknowledgements(id) on delete cascade,
  pathway_id          uuid        references public.autoskill_training_pathways(id) on delete set null,
  module_id           uuid        references public.autoskill_process_modules(id) on delete set null,
  lesson_id           uuid        references public.autoskill_process_lessons(id) on delete set null,
  acknowledged_text   text,
  acknowledged_at     timestamptz not null default now(),
  source              text        not null default 'employee-pwa'
                                  check (source in ('employee-pwa','control-dashboard','sync_queue')),
  sync_status         autoskill_sync_status not null default 'local',
  is_demo             boolean     not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (employee_id, acknowledgement_id)
);
comment on table public.autoskill_employee_safety_acknowledgements is
  'AutoSkill OS™ — Employee safety acknowledgement completion records.';

-- ── 3.15 autoskill_competencies ──────────────────────────────────────────
-- Competency definitions linked to departments/stations.
create table if not exists public.autoskill_competencies (
  id                        uuid        primary key default gen_random_uuid(),
  organisation_id           uuid        not null references public.autoskill_organisations(id) on delete cascade,
  department_id             uuid        references public.autoskill_departments(id) on delete set null,
  station_id                uuid        references public.autoskill_manufacturing_stations(id) on delete set null,
  title                     text        not null,
  description               text,
  required_evidence         jsonb       not null default '[]',
  supervisor_signoff_required boolean   not null default false,
  status                    autoskill_record_status not null default 'active',
  is_demo                   boolean     not null default false,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);
comment on table public.autoskill_competencies is
  'AutoSkill OS™ — Competency definitions for departments and manufacturing stations.';

-- ── 3.16 autoskill_competency_links ──────────────────────────────────────
-- Links competencies to pathways/modules/lessons.
create table if not exists public.autoskill_competency_links (
  id              uuid        primary key default gen_random_uuid(),
  organisation_id uuid        not null references public.autoskill_organisations(id) on delete cascade,
  competency_id   uuid        not null references public.autoskill_competencies(id) on delete cascade,
  pathway_id      uuid        references public.autoskill_training_pathways(id) on delete cascade,
  module_id       uuid        references public.autoskill_process_modules(id) on delete cascade,
  lesson_id       uuid        references public.autoskill_process_lessons(id) on delete cascade,
  created_at      timestamptz not null default now()
);
comment on table public.autoskill_competency_links is
  'AutoSkill OS™ — Competency-to-pathway/module/lesson linkage table.';

-- ── 3.17 autoskill_progress_records ──────────────────────────────────────
-- Employee progress through pathways, modules, and lessons.
create table if not exists public.autoskill_progress_records (
  id               uuid        primary key default gen_random_uuid(),
  organisation_id  uuid        not null references public.autoskill_organisations(id) on delete cascade,
  employee_id      uuid        not null references public.autoskill_employees(id) on delete cascade,
  pathway_id       uuid        not null references public.autoskill_training_pathways(id) on delete cascade,
  module_id        uuid        references public.autoskill_process_modules(id) on delete set null,
  lesson_id        uuid        references public.autoskill_process_lessons(id) on delete set null,
  status           autoskill_progress_status not null default 'not_started',
  progress_percent numeric     not null default 0 check (progress_percent between 0 and 100),
  score            numeric     check (score between 0 and 100),
  time_spent_minutes integer   not null default 0 check (time_spent_minutes >= 0),
  source           text        not null default 'employee-pwa'
                               check (source in ('employee-pwa','control-dashboard','sync_queue','import')),
  sync_status      autoskill_sync_status not null default 'local',
  completed_at     timestamptz,
  last_updated_at  timestamptz not null default now(),
  is_demo          boolean     not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
comment on table public.autoskill_progress_records is
  'AutoSkill OS™ — Employee pathway/module/lesson progress. Populated from PWA sync queue.';

-- ── 3.18 autoskill_checkpoint_submissions ────────────────────────────────
-- Employee checkpoint/quiz answer submissions and results.
create table if not exists public.autoskill_checkpoint_submissions (
  id              uuid        primary key default gen_random_uuid(),
  organisation_id uuid        not null references public.autoskill_organisations(id) on delete cascade,
  employee_id     uuid        not null references public.autoskill_employees(id) on delete cascade,
  checkpoint_id   uuid        not null references public.autoskill_skill_checkpoints(id) on delete cascade,
  pathway_id      uuid        references public.autoskill_training_pathways(id) on delete set null,
  module_id       uuid        references public.autoskill_process_modules(id) on delete set null,
  lesson_id       uuid        references public.autoskill_process_lessons(id) on delete set null,
  answer          jsonb       not null default '{}',
  is_correct      boolean,
  status          autoskill_progress_status not null default 'in_progress',
  submitted_at    timestamptz not null default now(),
  source          text        not null default 'employee-pwa',
  sync_status     autoskill_sync_status not null default 'local',
  is_demo         boolean     not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
comment on table public.autoskill_checkpoint_submissions is
  'AutoSkill OS™ — Employee checkpoint answer submissions.';

-- ── 3.19 autoskill_supervisor_reviews ────────────────────────────────────
-- Supervisor review / sign-off workflow records.
create table if not exists public.autoskill_supervisor_reviews (
  id                  uuid        primary key default gen_random_uuid(),
  organisation_id     uuid        not null references public.autoskill_organisations(id) on delete cascade,
  employee_id         uuid        not null references public.autoskill_employees(id) on delete cascade,
  supervisor_id       uuid        references public.autoskill_trainers_supervisors(id) on delete set null,
  reviewer_profile_id uuid        references public.autoskill_profiles(id) on delete set null,
  pathway_id          uuid        references public.autoskill_training_pathways(id) on delete set null,
  module_id           uuid        references public.autoskill_process_modules(id) on delete set null,
  lesson_id           uuid        references public.autoskill_process_lessons(id) on delete set null,
  competency_id       uuid        references public.autoskill_competencies(id) on delete set null,
  status              autoskill_review_status not null default 'pending',
  notes               text,
  reviewed_at         timestamptz,
  evidence_count      integer     not null default 0 check (evidence_count >= 0),
  is_demo             boolean     not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
comment on table public.autoskill_supervisor_reviews is
  'AutoSkill OS™ — Supervisor review workflow. Does not constitute legal sign-off.';

-- ── 3.20 autoskill_evidence_records ──────────────────────────────────────
-- Training evidence metadata. No unsafe file upload yet.
create table if not exists public.autoskill_evidence_records (
  id                  uuid        primary key default gen_random_uuid(),
  organisation_id     uuid        not null references public.autoskill_organisations(id) on delete cascade,
  employee_id         uuid        not null references public.autoskill_employees(id) on delete cascade,
  pathway_id          uuid        references public.autoskill_training_pathways(id) on delete set null,
  module_id           uuid        references public.autoskill_process_modules(id) on delete set null,
  lesson_id           uuid        references public.autoskill_process_lessons(id) on delete set null,
  supervisor_review_id uuid       references public.autoskill_supervisor_reviews(id) on delete set null,
  evidence_type       autoskill_evidence_type not null default 'note',
  title               text        not null,
  description         text,
  source              text        not null default 'employee-pwa'
                                  check (source in ('employee-pwa','control-dashboard','sync_queue','import')),
  sync_status         autoskill_sync_status not null default 'local',
  metadata            jsonb       not null default '{}',
  is_demo             boolean     not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
comment on table public.autoskill_evidence_records is
  'AutoSkill OS™ — Training evidence metadata. Not a legal compliance record.';

-- ── 3.21 autoskill_dashboard_alerts ──────────────────────────────────────
-- Dashboard alert and review flag records.
create table if not exists public.autoskill_dashboard_alerts (
  id                  uuid        primary key default gen_random_uuid(),
  organisation_id     uuid        not null references public.autoskill_organisations(id) on delete cascade,
  alert_type          text        not null
                                  check (alert_type in (
                                    'overdue_training','missing_safety_ack','review_required',
                                    'sync_error','incomplete_pathway','demo_warning',
                                    'safety_checkpoint_failed','employee_inactive'
                                  )),
  title               text        not null,
  message             text,
  severity            autoskill_alert_severity not null default 'info',
  linked_employee_id  uuid        references public.autoskill_employees(id) on delete set null,
  linked_pathway_id   uuid        references public.autoskill_training_pathways(id) on delete set null,
  linked_module_id    uuid        references public.autoskill_process_modules(id) on delete set null,
  linked_lesson_id    uuid        references public.autoskill_process_lessons(id) on delete set null,
  resolved            boolean     not null default false,
  resolved_at         timestamptz,
  is_demo             boolean     not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
comment on table public.autoskill_dashboard_alerts is
  'AutoSkill OS™ — Dashboard training flags and alert records.';

-- ── 3.22 autoskill_sync_queue ────────────────────────────────────────────
-- Backend-ready sync queue. Matches Run 7 PWA local queue shape exactly.
-- local queue key: ap3x_dm_pwa_sync_queue
create table if not exists public.autoskill_sync_queue (
  id                  uuid        primary key default gen_random_uuid(),
  organisation_id     uuid        not null references public.autoskill_organisations(id) on delete cascade,
  -- Event classification (matches PWA createSyncQueueItem eventType field)
  event_type          text        not null
                                  check (event_type in (
                                    'lesson_started','lesson_completed','progress_updated',
                                    'checkpoint_submitted','safety_acknowledged','safety_ack_completed',
                                    'supervisor_review_requested','evidence_submitted',
                                    'note_submitted','sync_test_local'
                                  )),
  source              text        not null default 'employee-pwa',
  target              text        not null default 'control-dashboard',
  -- Entity references (all nullable — not all events reference all entities)
  employee_id         uuid        references public.autoskill_employees(id) on delete set null,
  pathway_id          uuid        references public.autoskill_training_pathways(id) on delete set null,
  module_id           uuid        references public.autoskill_process_modules(id) on delete set null,
  lesson_id           uuid        references public.autoskill_process_lessons(id) on delete set null,
  checkpoint_id       uuid        references public.autoskill_skill_checkpoints(id) on delete set null,
  acknowledgement_id  uuid        references public.autoskill_safety_acknowledgements(id) on delete set null,
  evidence_record_id  uuid        references public.autoskill_evidence_records(id) on delete set null,
  supervisor_review_id uuid       references public.autoskill_supervisor_reviews(id) on delete set null,
  -- Payload (flexible jsonb — matches PWA payload field)
  payload             jsonb       not null default '{}',
  -- Queue lifecycle
  status              autoskill_sync_status not null default 'queued',
  priority            autoskill_sync_priority not null default 'normal',
  data_mode           autoskill_data_mode not null default 'live',
  is_demo             boolean     not null default false,
  -- Origin tracking
  local_device_id     text,
  remote_id           text,
  provider            text        not null default 'supabase',
  -- Error handling
  retry_count         integer     not null default 0 check (retry_count >= 0),
  error_message       text,
  notes               text,
  -- Timestamps
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  processed_at        timestamptz
);
comment on table public.autoskill_sync_queue is
  'AutoSkill OS™ — Backend-ready sync queue. Matches PWA local queue shape (Run 7).';

-- ── 3.23 autoskill_backend_events ────────────────────────────────────────
-- Audit / event log for backend processing activity.
create table if not exists public.autoskill_backend_events (
  id                uuid        primary key default gen_random_uuid(),
  organisation_id   uuid        not null references public.autoskill_organisations(id) on delete cascade,
  actor_profile_id  uuid        references public.autoskill_profiles(id) on delete set null,
  event_type        text        not null,
  event_summary     text,
  payload           jsonb       not null default '{}',
  source            text        not null default 'system',
  severity          autoskill_alert_severity not null default 'info',
  created_at        timestamptz not null default now()
);
comment on table public.autoskill_backend_events is
  'AutoSkill OS™ — Backend audit/event log. No user-editable data.';

-- ── 3.24 autoskill_app_settings ──────────────────────────────────────────
-- Organisation-level public-safe settings. NEVER store secrets here.
create table if not exists public.autoskill_app_settings (
  id              uuid        primary key default gen_random_uuid(),
  organisation_id uuid        not null references public.autoskill_organisations(id) on delete cascade,
  setting_key     text        not null,
  setting_value   jsonb       not null default '{}',
  public_safe     boolean     not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  -- Enforce one setting per key per org
  unique (organisation_id, setting_key),
  -- Only public-safe settings allowed in this table
  constraint settings_must_be_public_safe check (public_safe = true)
);
comment on table public.autoskill_app_settings is
  'AutoSkill OS™ — Public-safe org settings ONLY. ⛔ NEVER store secrets here.';


-- ════════════════════════════════════════════════════════════════════════════
-- STEP 4: INDEXES (after tables, before functions)
-- ════════════════════════════════════════════════════════════════════════════

-- autoskill_organisations
create index if not exists idx_orgs_slug
  on public.autoskill_organisations (slug);
create index if not exists idx_orgs_status
  on public.autoskill_organisations (status);

-- autoskill_sites
create index if not exists idx_sites_org
  on public.autoskill_sites (organisation_id);

-- autoskill_profiles
create index if not exists idx_profiles_org
  on public.autoskill_profiles (organisation_id);
create index if not exists idx_profiles_role
  on public.autoskill_profiles (role);
create index if not exists idx_profiles_site
  on public.autoskill_profiles (site_id);

-- autoskill_departments
create index if not exists idx_depts_org
  on public.autoskill_departments (organisation_id);
create index if not exists idx_depts_site
  on public.autoskill_departments (site_id);

-- autoskill_manufacturing_stations
create index if not exists idx_stations_org
  on public.autoskill_manufacturing_stations (organisation_id);
create index if not exists idx_stations_dept
  on public.autoskill_manufacturing_stations (department_id);
create index if not exists idx_stations_safety
  on public.autoskill_manufacturing_stations (safety_critical);

-- autoskill_employees
create index if not exists idx_emp_org
  on public.autoskill_employees (organisation_id);
create index if not exists idx_emp_site
  on public.autoskill_employees (site_id);
create index if not exists idx_emp_dept
  on public.autoskill_employees (department_id);
create index if not exists idx_emp_profile
  on public.autoskill_employees (profile_id);
create index if not exists idx_emp_is_demo
  on public.autoskill_employees (is_demo);
create index if not exists idx_emp_status
  on public.autoskill_employees (employment_status);

-- autoskill_trainers_supervisors
create index if not exists idx_ts_org
  on public.autoskill_trainers_supervisors (organisation_id);
create index if not exists idx_ts_profile
  on public.autoskill_trainers_supervisors (profile_id);
create index if not exists idx_ts_dept
  on public.autoskill_trainers_supervisors (department_id);

-- autoskill_training_pathways
create index if not exists idx_pathways_org
  on public.autoskill_training_pathways (organisation_id);
create index if not exists idx_pathways_dept
  on public.autoskill_training_pathways (department_id);
create index if not exists idx_pathways_status
  on public.autoskill_training_pathways (status);
create index if not exists idx_pathways_demo
  on public.autoskill_training_pathways (is_demo);

-- autoskill_pathway_assignments
create index if not exists idx_pa_org
  on public.autoskill_pathway_assignments (organisation_id);
create index if not exists idx_pa_employee
  on public.autoskill_pathway_assignments (employee_id);
create index if not exists idx_pa_pathway
  on public.autoskill_pathway_assignments (pathway_id);
create index if not exists idx_pa_status
  on public.autoskill_pathway_assignments (status);

-- autoskill_process_modules
create index if not exists idx_modules_org
  on public.autoskill_process_modules (organisation_id);
create index if not exists idx_modules_pathway
  on public.autoskill_process_modules (pathway_id);
create index if not exists idx_modules_order
  on public.autoskill_process_modules (pathway_id, module_order);

-- autoskill_process_lessons
create index if not exists idx_lessons_org
  on public.autoskill_process_lessons (organisation_id);
create index if not exists idx_lessons_module
  on public.autoskill_process_lessons (module_id);
create index if not exists idx_lessons_pathway
  on public.autoskill_process_lessons (pathway_id);
create index if not exists idx_lessons_order
  on public.autoskill_process_lessons (module_id, lesson_order);

-- autoskill_skill_checkpoints
create index if not exists idx_chk_org
  on public.autoskill_skill_checkpoints (organisation_id);
create index if not exists idx_chk_lesson
  on public.autoskill_skill_checkpoints (lesson_id);
create index if not exists idx_chk_module
  on public.autoskill_skill_checkpoints (module_id);
create index if not exists idx_chk_pathway
  on public.autoskill_skill_checkpoints (pathway_id);

-- autoskill_safety_acknowledgements
create index if not exists idx_acks_org
  on public.autoskill_safety_acknowledgements (organisation_id);
create index if not exists idx_acks_pathway
  on public.autoskill_safety_acknowledgements (pathway_id);
create index if not exists idx_acks_module
  on public.autoskill_safety_acknowledgements (module_id);

-- autoskill_employee_safety_acknowledgements
create index if not exists idx_emp_acks_org
  on public.autoskill_employee_safety_acknowledgements (organisation_id);
create index if not exists idx_emp_acks_employee
  on public.autoskill_employee_safety_acknowledgements (employee_id);
create index if not exists idx_emp_acks_ack
  on public.autoskill_employee_safety_acknowledgements (acknowledgement_id);

-- autoskill_competencies
create index if not exists idx_comp_org
  on public.autoskill_competencies (organisation_id);
create index if not exists idx_comp_dept
  on public.autoskill_competencies (department_id);

-- autoskill_competency_links
create index if not exists idx_cl_org
  on public.autoskill_competency_links (organisation_id);
create index if not exists idx_cl_competency
  on public.autoskill_competency_links (competency_id);
create index if not exists idx_cl_pathway
  on public.autoskill_competency_links (pathway_id);

-- autoskill_progress_records
create index if not exists idx_prog_org
  on public.autoskill_progress_records (organisation_id);
create index if not exists idx_prog_employee
  on public.autoskill_progress_records (employee_id);
create index if not exists idx_prog_pathway
  on public.autoskill_progress_records (pathway_id);
create index if not exists idx_prog_module
  on public.autoskill_progress_records (module_id);
create index if not exists idx_prog_lesson
  on public.autoskill_progress_records (lesson_id);
create index if not exists idx_prog_status
  on public.autoskill_progress_records (status);
create index if not exists idx_prog_demo
  on public.autoskill_progress_records (is_demo);

-- autoskill_checkpoint_submissions
create index if not exists idx_sub_org
  on public.autoskill_checkpoint_submissions (organisation_id);
create index if not exists idx_sub_employee
  on public.autoskill_checkpoint_submissions (employee_id);
create index if not exists idx_sub_checkpoint
  on public.autoskill_checkpoint_submissions (checkpoint_id);
create index if not exists idx_sub_lesson
  on public.autoskill_checkpoint_submissions (lesson_id);

-- autoskill_supervisor_reviews
create index if not exists idx_rev_org
  on public.autoskill_supervisor_reviews (organisation_id);
create index if not exists idx_rev_employee
  on public.autoskill_supervisor_reviews (employee_id);
create index if not exists idx_rev_status
  on public.autoskill_supervisor_reviews (status);
create index if not exists idx_rev_supervisor
  on public.autoskill_supervisor_reviews (supervisor_id);
create index if not exists idx_rev_pathway
  on public.autoskill_supervisor_reviews (pathway_id);

-- autoskill_evidence_records
create index if not exists idx_ev_org
  on public.autoskill_evidence_records (organisation_id);
create index if not exists idx_ev_employee
  on public.autoskill_evidence_records (employee_id);
create index if not exists idx_ev_review
  on public.autoskill_evidence_records (supervisor_review_id);

-- autoskill_dashboard_alerts
create index if not exists idx_alert_org
  on public.autoskill_dashboard_alerts (organisation_id);
create index if not exists idx_alert_severity
  on public.autoskill_dashboard_alerts (severity);
create index if not exists idx_alert_resolved
  on public.autoskill_dashboard_alerts (resolved);
create index if not exists idx_alert_employee
  on public.autoskill_dashboard_alerts (linked_employee_id);

-- autoskill_sync_queue
create index if not exists idx_sq_org
  on public.autoskill_sync_queue (organisation_id);
create index if not exists idx_sq_employee
  on public.autoskill_sync_queue (employee_id);
create index if not exists idx_sq_status
  on public.autoskill_sync_queue (status);
create index if not exists idx_sq_event_type
  on public.autoskill_sync_queue (event_type);
create index if not exists idx_sq_created
  on public.autoskill_sync_queue (created_at desc);
create index if not exists idx_sq_priority
  on public.autoskill_sync_queue (priority);
create index if not exists idx_sq_demo
  on public.autoskill_sync_queue (is_demo);

-- autoskill_backend_events
create index if not exists idx_be_org
  on public.autoskill_backend_events (organisation_id);
create index if not exists idx_be_created
  on public.autoskill_backend_events (created_at desc);

-- autoskill_app_settings
create index if not exists idx_settings_org_key
  on public.autoskill_app_settings (organisation_id, setting_key);


-- ════════════════════════════════════════════════════════════════════════════
-- STEP 5: FUNCTIONS (before triggers that call them)
-- ════════════════════════════════════════════════════════════════════════════

-- ── 5.01 touch_updated_at ────────────────────────────────────────────────
-- Generic updated_at trigger function used by all mutable tables.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
comment on function public.touch_updated_at() is
  'AutoSkill OS™ — Generic updated_at trigger. Applied to all mutable tables.';

-- ── 5.02 user_organisation_id ────────────────────────────────────────────
-- Returns organisation_id for the current authenticated user.
-- Used in RLS policies to scope records to the user's org.
create or replace function public.user_organisation_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select organisation_id
  from   public.autoskill_profiles
  where  id = auth.uid()
  limit  1;
$$;
comment on function public.user_organisation_id() is
  'AutoSkill OS™ — Returns organisation_id for auth.uid(). Used in RLS.';

-- ── 5.03 is_org_admin_or_manager ─────────────────────────────────────────
-- Returns true if current user is owner, admin, or training_manager.
create or replace function public.is_org_admin_or_manager()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from   public.autoskill_profiles
    where  id   = auth.uid()
    and    role in ('owner', 'admin', 'training_manager')
  );
$$;
comment on function public.is_org_admin_or_manager() is
  'AutoSkill OS™ — True if current user is owner/admin/training_manager.';

-- ── 5.04 is_supervisor_or_trainer ────────────────────────────────────────
-- Returns true if current user has supervisor-or-above access.
create or replace function public.is_supervisor_or_trainer()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from   public.autoskill_profiles
    where  id   = auth.uid()
    and    role in ('owner', 'admin', 'training_manager', 'supervisor', 'trainer')
  );
$$;
comment on function public.is_supervisor_or_trainer() is
  'AutoSkill OS™ — True if current user has supervisor/trainer/manager/admin/owner role.';

-- ── 5.05 is_employee_self ────────────────────────────────────────────────
-- Returns true if the given employee_id is linked to the current auth user.
create or replace function public.is_employee_self(p_employee_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from   public.autoskill_employees e
    join   public.autoskill_profiles  p on p.id = e.profile_id
    where  e.id = p_employee_id
    and    p.id = auth.uid()
  );
$$;
comment on function public.is_employee_self(uuid) is
  'AutoSkill OS™ — True if employee_id belongs to the current auth user.';

-- ── 5.06 calculate_employee_progress ─────────────────────────────────────
-- Safe read-only function. Returns avg completion % across pathway assignments.
create or replace function public.calculate_employee_progress(p_employee_id uuid)
returns numeric
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    round(avg(progress_percent)::numeric, 1),
    0
  )
  from public.autoskill_pathway_assignments
  where employee_id = p_employee_id
  and   status      = 'active';
$$;
comment on function public.calculate_employee_progress(uuid) is
  'AutoSkill OS™ — Returns average pathway progress % for an employee (read-only).';

-- ── 5.07 create_dashboard_alert_fn ───────────────────────────────────────
-- Helper to insert a dashboard alert safely.
create or replace function public.create_dashboard_alert_fn(
  p_organisation_id  uuid,
  p_alert_type       text,
  p_title            text,
  p_message          text,
  p_severity         autoskill_alert_severity default 'info',
  p_linked_employee  uuid  default null,
  p_linked_pathway   uuid  default null,
  p_is_demo          boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.autoskill_dashboard_alerts (
    organisation_id, alert_type, title, message, severity,
    linked_employee_id, linked_pathway_id, is_demo
  ) values (
    p_organisation_id, p_alert_type, p_title, p_message, p_severity,
    p_linked_employee, p_linked_pathway, p_is_demo
  )
  returning id into v_id;
  return v_id;
end;
$$;
comment on function public.create_dashboard_alert_fn is
  'AutoSkill OS™ — Safely inserts a dashboard alert record.';


-- ════════════════════════════════════════════════════════════════════════════
-- STEP 6: TRIGGERS (after functions, before RLS)
-- ════════════════════════════════════════════════════════════════════════════

-- Helper macro: create an updated_at trigger for a table.
-- Applied to every mutable table below.

create or replace function public._autoskill_make_updated_at_trigger(
  p_table text
)
returns void
language plpgsql
as $$
begin
  execute format(
    'drop trigger if exists trg_updated_at on public.%I;
     create trigger trg_updated_at
     before update on public.%I
     for each row execute function public.touch_updated_at();',
    p_table, p_table
  );
end;
$$;

select public._autoskill_make_updated_at_trigger('autoskill_organisations');
select public._autoskill_make_updated_at_trigger('autoskill_sites');
select public._autoskill_make_updated_at_trigger('autoskill_profiles');
select public._autoskill_make_updated_at_trigger('autoskill_departments');
select public._autoskill_make_updated_at_trigger('autoskill_manufacturing_stations');
select public._autoskill_make_updated_at_trigger('autoskill_employees');
select public._autoskill_make_updated_at_trigger('autoskill_trainers_supervisors');
select public._autoskill_make_updated_at_trigger('autoskill_training_pathways');
select public._autoskill_make_updated_at_trigger('autoskill_pathway_assignments');
select public._autoskill_make_updated_at_trigger('autoskill_process_modules');
select public._autoskill_make_updated_at_trigger('autoskill_process_lessons');
select public._autoskill_make_updated_at_trigger('autoskill_skill_checkpoints');
select public._autoskill_make_updated_at_trigger('autoskill_safety_acknowledgements');
select public._autoskill_make_updated_at_trigger('autoskill_employee_safety_acknowledgements');
select public._autoskill_make_updated_at_trigger('autoskill_competencies');
select public._autoskill_make_updated_at_trigger('autoskill_progress_records');
select public._autoskill_make_updated_at_trigger('autoskill_checkpoint_submissions');
select public._autoskill_make_updated_at_trigger('autoskill_supervisor_reviews');
select public._autoskill_make_updated_at_trigger('autoskill_evidence_records');
select public._autoskill_make_updated_at_trigger('autoskill_dashboard_alerts');
select public._autoskill_make_updated_at_trigger('autoskill_sync_queue');
select public._autoskill_make_updated_at_trigger('autoskill_app_settings');


-- ════════════════════════════════════════════════════════════════════════════
-- STEP 7: ROW LEVEL SECURITY — ENABLEMENT
-- Enable RLS on every table before adding policies.
-- ════════════════════════════════════════════════════════════════════════════

alter table public.autoskill_organisations                    enable row level security;
alter table public.autoskill_sites                            enable row level security;
alter table public.autoskill_profiles                         enable row level security;
alter table public.autoskill_departments                      enable row level security;
alter table public.autoskill_manufacturing_stations           enable row level security;
alter table public.autoskill_employees                        enable row level security;
alter table public.autoskill_trainers_supervisors             enable row level security;
alter table public.autoskill_training_pathways                enable row level security;
alter table public.autoskill_pathway_assignments              enable row level security;
alter table public.autoskill_process_modules                  enable row level security;
alter table public.autoskill_process_lessons                  enable row level security;
alter table public.autoskill_skill_checkpoints                enable row level security;
alter table public.autoskill_safety_acknowledgements          enable row level security;
alter table public.autoskill_employee_safety_acknowledgements enable row level security;
alter table public.autoskill_competencies                     enable row level security;
alter table public.autoskill_competency_links                 enable row level security;
alter table public.autoskill_progress_records                 enable row level security;
alter table public.autoskill_checkpoint_submissions           enable row level security;
alter table public.autoskill_supervisor_reviews               enable row level security;
alter table public.autoskill_evidence_records                 enable row level security;
alter table public.autoskill_dashboard_alerts                 enable row level security;
alter table public.autoskill_sync_queue                       enable row level security;
alter table public.autoskill_backend_events                   enable row level security;
alter table public.autoskill_app_settings                     enable row level security;


-- ════════════════════════════════════════════════════════════════════════════
-- STEP 8: ROW LEVEL SECURITY — POLICIES
-- Policies enforce organisation scoping and role-based access.
-- ════════════════════════════════════════════════════════════════════════════

-- ── autoskill_organisations ───────────────────────────────────────────────
create policy "org_members_read_own_org"
  on public.autoskill_organisations for select
  using ( id = public.user_organisation_id() );

create policy "org_admins_update_own_org"
  on public.autoskill_organisations for update
  using ( id = public.user_organisation_id() and public.is_org_admin_or_manager() );

-- ── autoskill_sites ───────────────────────────────────────────────────────
create policy "org_members_read_sites"
  on public.autoskill_sites for select
  using ( organisation_id = public.user_organisation_id() );

create policy "org_admins_manage_sites"
  on public.autoskill_sites for all
  using ( organisation_id = public.user_organisation_id() and public.is_org_admin_or_manager() );

-- ── autoskill_profiles ────────────────────────────────────────────────────
create policy "user_read_own_profile"
  on public.autoskill_profiles for select
  using ( id = auth.uid() );

create policy "managers_read_org_profiles"
  on public.autoskill_profiles for select
  using (
    organisation_id = public.user_organisation_id()
    and public.is_supervisor_or_trainer()
  );

create policy "user_update_own_profile"
  on public.autoskill_profiles for update
  using ( id = auth.uid() )
  with check ( id = auth.uid() and role = (select role from public.autoskill_profiles where id = auth.uid()) );
  -- Employees cannot escalate their own role.

create policy "admins_manage_org_profiles"
  on public.autoskill_profiles for all
  using (
    organisation_id = public.user_organisation_id()
    and public.is_org_admin_or_manager()
  );

create policy "profile_insert_on_signup"
  on public.autoskill_profiles for insert
  with check ( id = auth.uid() );

-- ── autoskill_departments ─────────────────────────────────────────────────
create policy "org_members_read_depts"
  on public.autoskill_departments for select
  using ( organisation_id = public.user_organisation_id() );

create policy "admins_manage_depts"
  on public.autoskill_departments for all
  using ( organisation_id = public.user_organisation_id() and public.is_org_admin_or_manager() );

-- ── autoskill_manufacturing_stations ─────────────────────────────────────
create policy "org_members_read_stations"
  on public.autoskill_manufacturing_stations for select
  using ( organisation_id = public.user_organisation_id() );

create policy "admins_manage_stations"
  on public.autoskill_manufacturing_stations for all
  using ( organisation_id = public.user_organisation_id() and public.is_org_admin_or_manager() );

-- ── autoskill_employees ───────────────────────────────────────────────────
create policy "employee_read_own_record"
  on public.autoskill_employees for select
  using ( public.is_employee_self(id) );

create policy "supervisors_read_org_employees"
  on public.autoskill_employees for select
  using (
    organisation_id = public.user_organisation_id()
    and public.is_supervisor_or_trainer()
  );

create policy "admins_manage_org_employees"
  on public.autoskill_employees for all
  using ( organisation_id = public.user_organisation_id() and public.is_org_admin_or_manager() );

-- ── autoskill_trainers_supervisors ────────────────────────────────────────
create policy "supervisors_read_org_trainers"
  on public.autoskill_trainers_supervisors for select
  using (
    organisation_id = public.user_organisation_id()
    and public.is_supervisor_or_trainer()
  );

create policy "admins_manage_org_trainers"
  on public.autoskill_trainers_supervisors for all
  using ( organisation_id = public.user_organisation_id() and public.is_org_admin_or_manager() );

-- ── autoskill_training_pathways ───────────────────────────────────────────
create policy "org_users_read_active_pathways"
  on public.autoskill_training_pathways for select
  using (
    organisation_id = public.user_organisation_id()
    and status = 'active'
  );

create policy "trainers_manage_pathways"
  on public.autoskill_training_pathways for all
  using (
    organisation_id = public.user_organisation_id()
    and public.is_supervisor_or_trainer()
  );

-- ── autoskill_pathway_assignments ─────────────────────────────────────────
create policy "employee_read_own_assignments"
  on public.autoskill_pathway_assignments for select
  using ( public.is_employee_self(employee_id) );

create policy "supervisors_read_org_assignments"
  on public.autoskill_pathway_assignments for select
  using (
    organisation_id = public.user_organisation_id()
    and public.is_supervisor_or_trainer()
  );

create policy "trainers_manage_assignments"
  on public.autoskill_pathway_assignments for all
  using (
    organisation_id = public.user_organisation_id()
    and public.is_supervisor_or_trainer()
  );

-- ── autoskill_process_modules ─────────────────────────────────────────────
create policy "org_users_read_modules"
  on public.autoskill_process_modules for select
  using ( organisation_id = public.user_organisation_id() );

create policy "trainers_manage_modules"
  on public.autoskill_process_modules for all
  using (
    organisation_id = public.user_organisation_id()
    and public.is_supervisor_or_trainer()
  );

-- ── autoskill_process_lessons ─────────────────────────────────────────────
create policy "org_users_read_lessons"
  on public.autoskill_process_lessons for select
  using ( organisation_id = public.user_organisation_id() );

create policy "trainers_manage_lessons"
  on public.autoskill_process_lessons for all
  using (
    organisation_id = public.user_organisation_id()
    and public.is_supervisor_or_trainer()
  );

-- ── autoskill_skill_checkpoints ───────────────────────────────────────────
create policy "org_users_read_checkpoints"
  on public.autoskill_skill_checkpoints for select
  using ( organisation_id = public.user_organisation_id() );

create policy "trainers_manage_checkpoints"
  on public.autoskill_skill_checkpoints for all
  using (
    organisation_id = public.user_organisation_id()
    and public.is_supervisor_or_trainer()
  );

-- ── autoskill_safety_acknowledgements ─────────────────────────────────────
create policy "org_users_read_safety_acks"
  on public.autoskill_safety_acknowledgements for select
  using ( organisation_id = public.user_organisation_id() );

create policy "trainers_manage_safety_acks"
  on public.autoskill_safety_acknowledgements for all
  using (
    organisation_id = public.user_organisation_id()
    and public.is_supervisor_or_trainer()
  );

-- ── autoskill_employee_safety_acknowledgements ────────────────────────────
create policy "employee_insert_own_acks"
  on public.autoskill_employee_safety_acknowledgements for insert
  with check (
    public.is_employee_self(employee_id)
    and organisation_id = public.user_organisation_id()
  );

create policy "employee_read_own_acks"
  on public.autoskill_employee_safety_acknowledgements for select
  using ( public.is_employee_self(employee_id) );

create policy "supervisors_read_org_acks"
  on public.autoskill_employee_safety_acknowledgements for select
  using (
    organisation_id = public.user_organisation_id()
    and public.is_supervisor_or_trainer()
  );

create policy "supervisors_update_ack_sync_status"
  on public.autoskill_employee_safety_acknowledgements for update
  using (
    organisation_id = public.user_organisation_id()
    and public.is_supervisor_or_trainer()
  );

-- ── autoskill_competencies ────────────────────────────────────────────────
create policy "org_users_read_competencies"
  on public.autoskill_competencies for select
  using ( organisation_id = public.user_organisation_id() );

create policy "trainers_manage_competencies"
  on public.autoskill_competencies for all
  using (
    organisation_id = public.user_organisation_id()
    and public.is_supervisor_or_trainer()
  );

-- ── autoskill_competency_links ────────────────────────────────────────────
create policy "org_users_read_comp_links"
  on public.autoskill_competency_links for select
  using ( organisation_id = public.user_organisation_id() );

create policy "trainers_manage_comp_links"
  on public.autoskill_competency_links for all
  using (
    organisation_id = public.user_organisation_id()
    and public.is_supervisor_or_trainer()
  );

-- ── autoskill_progress_records ────────────────────────────────────────────
create policy "employee_insert_own_progress"
  on public.autoskill_progress_records for insert
  with check (
    public.is_employee_self(employee_id)
    and organisation_id = public.user_organisation_id()
  );

create policy "employee_read_own_progress"
  on public.autoskill_progress_records for select
  using ( public.is_employee_self(employee_id) );

create policy "employee_update_own_progress"
  on public.autoskill_progress_records for update
  using ( public.is_employee_self(employee_id) )
  with check ( public.is_employee_self(employee_id) );

create policy "supervisors_read_org_progress"
  on public.autoskill_progress_records for select
  using (
    organisation_id = public.user_organisation_id()
    and public.is_supervisor_or_trainer()
  );

create policy "supervisors_update_progress_status"
  on public.autoskill_progress_records for update
  using (
    organisation_id = public.user_organisation_id()
    and public.is_supervisor_or_trainer()
  );

-- ── autoskill_checkpoint_submissions ─────────────────────────────────────
create policy "employee_insert_own_submissions"
  on public.autoskill_checkpoint_submissions for insert
  with check (
    public.is_employee_self(employee_id)
    and organisation_id = public.user_organisation_id()
  );

create policy "employee_read_own_submissions"
  on public.autoskill_checkpoint_submissions for select
  using ( public.is_employee_self(employee_id) );

create policy "supervisors_read_org_submissions"
  on public.autoskill_checkpoint_submissions for select
  using (
    organisation_id = public.user_organisation_id()
    and public.is_supervisor_or_trainer()
  );

-- ── autoskill_supervisor_reviews ──────────────────────────────────────────
create policy "employee_read_own_review_status"
  on public.autoskill_supervisor_reviews for select
  using ( public.is_employee_self(employee_id) );
  -- Employees can see status of their own reviews but cannot approve them.

create policy "supervisors_read_org_reviews"
  on public.autoskill_supervisor_reviews for select
  using (
    organisation_id = public.user_organisation_id()
    and public.is_supervisor_or_trainer()
  );

create policy "supervisors_create_reviews"
  on public.autoskill_supervisor_reviews for insert
  with check (
    organisation_id = public.user_organisation_id()
    and public.is_supervisor_or_trainer()
  );

create policy "employee_request_review"
  on public.autoskill_supervisor_reviews for insert
  with check (
    public.is_employee_self(employee_id)
    and organisation_id = public.user_organisation_id()
    and status = 'pending'
    -- Employees can only create pending reviews — not approve them.
  );

create policy "supervisors_update_reviews"
  on public.autoskill_supervisor_reviews for update
  using (
    organisation_id = public.user_organisation_id()
    and public.is_supervisor_or_trainer()
  );

-- ── autoskill_evidence_records ────────────────────────────────────────────
create policy "employee_insert_own_evidence"
  on public.autoskill_evidence_records for insert
  with check (
    public.is_employee_self(employee_id)
    and organisation_id = public.user_organisation_id()
    and evidence_type != 'supervisor_note'  -- employees cannot create supervisor notes
  );

create policy "employee_read_own_evidence"
  on public.autoskill_evidence_records for select
  using ( public.is_employee_self(employee_id) );

create policy "supervisors_read_org_evidence"
  on public.autoskill_evidence_records for select
  using (
    organisation_id = public.user_organisation_id()
    and public.is_supervisor_or_trainer()
  );

create policy "supervisors_manage_evidence"
  on public.autoskill_evidence_records for all
  using (
    organisation_id = public.user_organisation_id()
    and public.is_supervisor_or_trainer()
  );

-- ── autoskill_dashboard_alerts ────────────────────────────────────────────
create policy "supervisors_read_org_alerts"
  on public.autoskill_dashboard_alerts for select
  using (
    organisation_id = public.user_organisation_id()
    and public.is_supervisor_or_trainer()
  );

create policy "employee_read_own_linked_alerts"
  on public.autoskill_dashboard_alerts for select
  using (
    public.is_employee_self(linked_employee_id)
    and severity != 'critical'  -- employees do not see critical org-wide alerts
  );

create policy "supervisors_manage_alerts"
  on public.autoskill_dashboard_alerts for all
  using (
    organisation_id = public.user_organisation_id()
    and public.is_supervisor_or_trainer()
  );

-- ── autoskill_sync_queue ──────────────────────────────────────────────────
create policy "employee_insert_own_queue_items"
  on public.autoskill_sync_queue for insert
  with check (
    public.is_employee_self(employee_id)
    and organisation_id = public.user_organisation_id()
    and status = 'queued'
    -- Employees insert queued items only — cannot process or mark synced.
  );

create policy "employee_read_own_queue_items"
  on public.autoskill_sync_queue for select
  using ( public.is_employee_self(employee_id) );

create policy "supervisors_read_org_queue"
  on public.autoskill_sync_queue for select
  using (
    organisation_id = public.user_organisation_id()
    and public.is_supervisor_or_trainer()
  );

create policy "supervisors_process_org_queue"
  on public.autoskill_sync_queue for update
  using (
    organisation_id = public.user_organisation_id()
    and public.is_supervisor_or_trainer()
  );

-- ── autoskill_backend_events ──────────────────────────────────────────────
create policy "admins_read_backend_events"
  on public.autoskill_backend_events for select
  using (
    organisation_id = public.user_organisation_id()
    and public.is_org_admin_or_manager()
  );

create policy "system_insert_backend_events"
  on public.autoskill_backend_events for insert
  with check (
    organisation_id = public.user_organisation_id()
    and public.is_supervisor_or_trainer()
  );

-- ── autoskill_app_settings ────────────────────────────────────────────────
create policy "org_users_read_public_settings"
  on public.autoskill_app_settings for select
  using (
    organisation_id = public.user_organisation_id()
    and public_safe = true
  );

create policy "admins_manage_public_settings"
  on public.autoskill_app_settings for all
  using (
    organisation_id = public.user_organisation_id()
    and public.is_org_admin_or_manager()
    and public_safe = true
  );


-- ════════════════════════════════════════════════════════════════════════════
-- END OF 001_autoskill_full_backend_setup.sql
-- ════════════════════════════════════════════════════════════════════════════
-- Next step: Run 002_autoskill_seed_demo_live_data.sql (optional — demo only)
-- Then run:  099_autoskill_verification_queries.sql to confirm setup.
-- ════════════════════════════════════════════════════════════════════════════
