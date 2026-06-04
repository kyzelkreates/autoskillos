-- ════════════════════════════════════════════════════════════════════════════
-- AutoSkill OS™ — Verification Queries
-- 099_autoskill_verification_queries.sql
-- ────────────────────────────────────────────────────────────────────────────
-- Powered by 4P3X Intelligent AI™ — Created by Kyzel Kreates™
-- ────────────────────────────────────────────────────────────────────────────
-- Run these queries in the Supabase SQL Editor AFTER 001 (and optionally 002).
-- They are READ-ONLY queries — safe to run at any time.
-- ════════════════════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────────────────────────────────────
-- V1. TABLE EXISTENCE CHECK
-- ─────────────────────────────────────────────────────────────────────────────
-- Expected result: 24 rows — one for each AutoSkill OS™ table.
select
  table_name,
  table_type
from information_schema.tables
where table_schema = 'public'
  and table_name   like 'autoskill_%'
order by table_name;

-- ─────────────────────────────────────────────────────────────────────────────
-- V2. RLS ENABLED CHECK
-- ─────────────────────────────────────────────────────────────────────────────
-- Expected result: ALL tables show rowsecurity = true.
-- Any table with false = RLS NOT enabled = action required.
select
  schemaname,
  tablename,
  rowsecurity as rls_enabled
from pg_tables
where schemaname = 'public'
  and tablename  like 'autoskill_%'
order by tablename;

-- ─────────────────────────────────────────────────────────────────────────────
-- V3. RLS POLICIES CHECK
-- ─────────────────────────────────────────────────────────────────────────────
-- Expected result: Multiple policies per table. All AutoSkill OS™ tables
-- should have at least one policy.
select
  schemaname,
  tablename,
  policyname,
  cmd           as applies_to_command,
  permissive    as policy_type
from pg_policies
where schemaname = 'public'
  and tablename  like 'autoskill_%'
order by tablename, policyname;

-- Count of policies per table (quick summary):
select
  tablename,
  count(*) as policy_count
from pg_policies
where schemaname = 'public'
  and tablename  like 'autoskill_%'
group by tablename
order by tablename;

-- ─────────────────────────────────────────────────────────────────────────────
-- V4. INDEXES CHECK
-- ─────────────────────────────────────────────────────────────────────────────
-- Expected result: Multiple indexes per table.
select
  schemaname,
  tablename,
  indexname,
  indexdef
from pg_indexes
where schemaname = 'public'
  and tablename  like 'autoskill_%'
order by tablename, indexname;

-- Index count per table:
select
  tablename,
  count(*) as index_count
from pg_indexes
where schemaname = 'public'
  and tablename  like 'autoskill_%'
group by tablename
order by tablename;

-- ─────────────────────────────────────────────────────────────────────────────
-- V5. TRIGGERS CHECK
-- ─────────────────────────────────────────────────────────────────────────────
-- Expected result: trg_updated_at trigger on all mutable tables.
select
  event_object_table as table_name,
  trigger_name,
  event_manipulation,
  action_timing
from information_schema.triggers
where trigger_schema      = 'public'
  and event_object_table like 'autoskill_%'
order by event_object_table;

-- ─────────────────────────────────────────────────────────────────────────────
-- V6. FUNCTIONS CHECK
-- ─────────────────────────────────────────────────────────────────────────────
-- Expected result: 7 AutoSkill OS™ helper functions present.
select
  routine_name,
  routine_type,
  security_type
from information_schema.routines
where routine_schema = 'public'
  and (routine_name like '%autoskill%'
    or routine_name in (
      'touch_updated_at',
      'user_organisation_id',
      'is_org_admin_or_manager',
      'is_supervisor_or_trainer',
      'is_employee_self',
      'calculate_employee_progress',
      'create_dashboard_alert_fn'
    ))
order by routine_name;

-- ─────────────────────────────────────────────────────────────────────────────
-- V7. ENUM TYPES CHECK
-- ─────────────────────────────────────────────────────────────────────────────
-- Expected result: 9 custom enum types for AutoSkill OS™.
select
  t.typname     as enum_name,
  e.enumlabel   as enum_value
from pg_type     t
join pg_enum     e on t.oid = e.enumtypid
where t.typname like 'autoskill_%'
order by t.typname, e.enumsortorder;

-- ─────────────────────────────────────────────────────────────────────────────
-- V8. SYNC QUEUE TABLE STRUCTURE CHECK
-- ─────────────────────────────────────────────────────────────────────────────
-- Confirms the sync queue table has all Run 7-compatible columns.
select
  column_name,
  data_type,
  is_nullable,
  column_default
from information_schema.columns
where table_schema = 'public'
  and table_name   = 'autoskill_sync_queue'
order by ordinal_position;

-- ─────────────────────────────────────────────────────────────────────────────
-- V9. APP SETTINGS SECRET CHECK
-- ─────────────────────────────────────────────────────────────────────────────
-- Confirms no forbidden secret keys are stored in app_settings.
-- Expected result: 0 rows for all queries below.

select count(*) as forbidden_settings_found
from public.autoskill_app_settings
where setting_key ilike any (array[
  '%service_role%', '%service_role_key%',
  '%jwt_secret%', '%private_key%',
  '%database_url%', '%webhook_secret%',
  '%admin_token%', '%openai%', '%stripe_secret%',
  '%groq%', '%aws_secret%', '%client_secret%'
]);
-- Expected: 0

-- ─────────────────────────────────────────────────────────────────────────────
-- V10. DEMO SEED DATA CHECK (run only if 002 seed was applied)
-- ─────────────────────────────────────────────────────────────────────────────
-- Expected: 1 demo org, 4 demo employees, 1 pathway, 3 modules, etc.

select 'autoskill_organisations' as table_name, count(*) as total,
  count(*) filter (where is_demo) as demo_count
from public.autoskill_organisations

union all

select 'autoskill_employees', count(*), count(*) filter (where is_demo)
from public.autoskill_employees

union all

select 'autoskill_training_pathways', count(*), count(*) filter (where is_demo)
from public.autoskill_training_pathways

union all

select 'autoskill_process_modules', count(*), count(*) filter (where is_demo)
from public.autoskill_process_modules

union all

select 'autoskill_process_lessons', count(*), count(*) filter (where is_demo)
from public.autoskill_process_lessons

union all

select 'autoskill_skill_checkpoints', count(*), count(*) filter (where is_demo)
from public.autoskill_skill_checkpoints

union all

select 'autoskill_safety_acknowledgements', count(*), count(*) filter (where is_demo)
from public.autoskill_safety_acknowledgements

union all

select 'autoskill_progress_records', count(*), count(*) filter (where is_demo)
from public.autoskill_progress_records

union all

select 'autoskill_sync_queue', count(*), count(*) filter (where is_demo)
from public.autoskill_sync_queue

union all

select 'autoskill_supervisor_reviews', count(*), count(*) filter (where is_demo)
from public.autoskill_supervisor_reviews

union all

select 'autoskill_dashboard_alerts', count(*), count(*) filter (where is_demo)
from public.autoskill_dashboard_alerts

union all

select 'autoskill_app_settings', count(*), 0
from public.autoskill_app_settings

order by table_name;

-- ─────────────────────────────────────────────────────────────────────────────
-- V11. LIVE DATA ISOLATION CHECK
-- ─────────────────────────────────────────────────────────────────────────────
-- Confirms no live records are mixed with demo records incorrectly.
-- Expected: 0 live employees if only seed data was loaded.
select
  is_demo,
  count(*) as record_count
from public.autoskill_employees
group by is_demo
order by is_demo;

-- ─────────────────────────────────────────────────────────────────────────────
-- V12. COLUMN SECURITY CHECK (no secret-like column names)
-- ─────────────────────────────────────────────────────────────────────────────
-- Expected: 0 rows — no secret columns should exist in any AutoSkill table.
select
  table_name,
  column_name
from information_schema.columns
where table_schema = 'public'
  and table_name   like 'autoskill_%'
  and column_name  ilike any (array[
    '%service_role%', '%jwt_secret%', '%private_key%',
    '%database_password%', '%webhook_secret%', '%admin_token%',
    '%stripe_secret%', '%openai_key%', '%groq_key%'
  ])
order by table_name;
-- Expected: 0 rows

-- ─────────────────────────────────────────────────────────────────────────────
-- V13. CURRENT USER PROFILE LOOKUP
-- ─────────────────────────────────────────────────────────────────────────────
-- Run this as an authenticated user to confirm profile lookup works.
-- (Will return no rows in SQL Editor if running as anon/service role)
select
  id,
  display_name,
  role,
  organisation_id,
  status
from public.autoskill_profiles
where id = auth.uid();

-- Organisation ID helper function test:
select public.user_organisation_id() as my_organisation_id;
select public.is_org_admin_or_manager() as am_i_admin_or_manager;
select public.is_supervisor_or_trainer() as am_i_supervisor_or_trainer;

-- ════════════════════════════════════════════════════════════════════════════
-- END OF 099_autoskill_verification_queries.sql
-- ════════════════════════════════════════════════════════════════════════════
