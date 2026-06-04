-- ════════════════════════════════════════════════════════════════════════════
-- AutoSkill OS™ — Rollback Notes
-- 999_autoskill_rollback_notes.sql
-- ────────────────────────────────────────────────────────────────────────────
-- Powered by 4P3X Intelligent AI™ — Created by Kyzel Kreates™
-- ────────────────────────────────────────────────════════════════════════════
--
-- ⛔ WARNING: ROLLBACK IS DESTRUCTIVE.
--
-- Dropping these tables permanently deletes ALL training records, progress,
-- safety acknowledgements, sync queue items, supervisor reviews, and evidence
-- records stored in this database.
--
-- ⚠  DO NOT run destructive rollback on a production database
--    unless you have:
--    1. Taken a full database backup (Supabase Dashboard → Settings → Backups)
--    2. Exported all important records as CSV/JSON
--    3. Confirmed with your training manager that loss is acceptable
--    4. Clearly documented why rollback is necessary
--
-- ─────────────────────────────────────────────────────────────────────────
-- SAFE USE CASE:
--   Run this ONLY on a clean development/test Supabase project where
--   no live training data exists and a rollback is needed to restart.
-- ════════════════════════════════════════════════════════════════════════════


-- ════════════════════════════════════════════════════════════════════════════
-- STEP 1: DROP POLICIES (must come before dropping tables)
-- ════════════════════════════════════════════════════════════════════════════

-- ⛔ DEV ONLY — Remove RLS policies before dropping tables.
-- If you get "policy does not exist" errors, the table may already be gone.

/*
drop policy if exists "org_members_read_own_org"             on public.autoskill_organisations;
drop policy if exists "org_admins_update_own_org"            on public.autoskill_organisations;
drop policy if exists "org_members_read_sites"               on public.autoskill_sites;
drop policy if exists "org_admins_manage_sites"              on public.autoskill_sites;
drop policy if exists "user_read_own_profile"                on public.autoskill_profiles;
drop policy if exists "managers_read_org_profiles"           on public.autoskill_profiles;
drop policy if exists "user_update_own_profile"              on public.autoskill_profiles;
drop policy if exists "admins_manage_org_profiles"           on public.autoskill_profiles;
drop policy if exists "profile_insert_on_signup"             on public.autoskill_profiles;
drop policy if exists "org_members_read_depts"               on public.autoskill_departments;
drop policy if exists "admins_manage_depts"                  on public.autoskill_departments;
drop policy if exists "org_members_read_stations"            on public.autoskill_manufacturing_stations;
drop policy if exists "admins_manage_stations"               on public.autoskill_manufacturing_stations;
drop policy if exists "employee_read_own_record"             on public.autoskill_employees;
drop policy if exists "supervisors_read_org_employees"       on public.autoskill_employees;
drop policy if exists "admins_manage_org_employees"          on public.autoskill_employees;
drop policy if exists "supervisors_read_org_trainers"        on public.autoskill_trainers_supervisors;
drop policy if exists "admins_manage_org_trainers"           on public.autoskill_trainers_supervisors;
drop policy if exists "org_users_read_active_pathways"       on public.autoskill_training_pathways;
drop policy if exists "trainers_manage_pathways"             on public.autoskill_training_pathways;
drop policy if exists "employee_read_own_assignments"        on public.autoskill_pathway_assignments;
drop policy if exists "supervisors_read_org_assignments"     on public.autoskill_pathway_assignments;
drop policy if exists "trainers_manage_assignments"          on public.autoskill_pathway_assignments;
drop policy if exists "org_users_read_modules"               on public.autoskill_process_modules;
drop policy if exists "trainers_manage_modules"              on public.autoskill_process_modules;
drop policy if exists "org_users_read_lessons"               on public.autoskill_process_lessons;
drop policy if exists "trainers_manage_lessons"              on public.autoskill_process_lessons;
drop policy if exists "org_users_read_checkpoints"           on public.autoskill_skill_checkpoints;
drop policy if exists "trainers_manage_checkpoints"          on public.autoskill_skill_checkpoints;
drop policy if exists "org_users_read_safety_acks"           on public.autoskill_safety_acknowledgements;
drop policy if exists "trainers_manage_safety_acks"          on public.autoskill_safety_acknowledgements;
drop policy if exists "employee_insert_own_acks"             on public.autoskill_employee_safety_acknowledgements;
drop policy if exists "employee_read_own_acks"               on public.autoskill_employee_safety_acknowledgements;
drop policy if exists "supervisors_read_org_acks"            on public.autoskill_employee_safety_acknowledgements;
drop policy if exists "supervisors_update_ack_sync_status"   on public.autoskill_employee_safety_acknowledgements;
drop policy if exists "org_users_read_competencies"          on public.autoskill_competencies;
drop policy if exists "trainers_manage_competencies"         on public.autoskill_competencies;
drop policy if exists "org_users_read_comp_links"            on public.autoskill_competency_links;
drop policy if exists "trainers_manage_comp_links"           on public.autoskill_competency_links;
drop policy if exists "employee_insert_own_progress"         on public.autoskill_progress_records;
drop policy if exists "employee_read_own_progress"           on public.autoskill_progress_records;
drop policy if exists "employee_update_own_progress"         on public.autoskill_progress_records;
drop policy if exists "supervisors_read_org_progress"        on public.autoskill_progress_records;
drop policy if exists "supervisors_update_progress_status"   on public.autoskill_progress_records;
drop policy if exists "employee_insert_own_submissions"      on public.autoskill_checkpoint_submissions;
drop policy if exists "employee_read_own_submissions"        on public.autoskill_checkpoint_submissions;
drop policy if exists "supervisors_read_org_submissions"     on public.autoskill_checkpoint_submissions;
drop policy if exists "employee_read_own_review_status"      on public.autoskill_supervisor_reviews;
drop policy if exists "supervisors_read_org_reviews"         on public.autoskill_supervisor_reviews;
drop policy if exists "supervisors_create_reviews"           on public.autoskill_supervisor_reviews;
drop policy if exists "employee_request_review"              on public.autoskill_supervisor_reviews;
drop policy if exists "supervisors_update_reviews"           on public.autoskill_supervisor_reviews;
drop policy if exists "employee_insert_own_evidence"         on public.autoskill_evidence_records;
drop policy if exists "employee_read_own_evidence"           on public.autoskill_evidence_records;
drop policy if exists "supervisors_read_org_evidence"        on public.autoskill_evidence_records;
drop policy if exists "supervisors_manage_evidence"          on public.autoskill_evidence_records;
drop policy if exists "supervisors_read_org_alerts"          on public.autoskill_dashboard_alerts;
drop policy if exists "employee_read_own_linked_alerts"      on public.autoskill_dashboard_alerts;
drop policy if exists "supervisors_manage_alerts"            on public.autoskill_dashboard_alerts;
drop policy if exists "employee_insert_own_queue_items"      on public.autoskill_sync_queue;
drop policy if exists "employee_read_own_queue_items"        on public.autoskill_sync_queue;
drop policy if exists "supervisors_read_org_queue"           on public.autoskill_sync_queue;
drop policy if exists "supervisors_process_org_queue"        on public.autoskill_sync_queue;
drop policy if exists "admins_read_backend_events"           on public.autoskill_backend_events;
drop policy if exists "system_insert_backend_events"         on public.autoskill_backend_events;
drop policy if exists "org_users_read_public_settings"       on public.autoskill_app_settings;
drop policy if exists "admins_manage_public_settings"        on public.autoskill_app_settings;
*/


-- ════════════════════════════════════════════════════════════════════════════
-- STEP 2: DROP TRIGGERS
-- ════════════════════════════════════════════════════════════════════════════

/*
drop trigger if exists trg_updated_at on public.autoskill_organisations;
drop trigger if exists trg_updated_at on public.autoskill_sites;
drop trigger if exists trg_updated_at on public.autoskill_profiles;
drop trigger if exists trg_updated_at on public.autoskill_departments;
drop trigger if exists trg_updated_at on public.autoskill_manufacturing_stations;
drop trigger if exists trg_updated_at on public.autoskill_employees;
drop trigger if exists trg_updated_at on public.autoskill_trainers_supervisors;
drop trigger if exists trg_updated_at on public.autoskill_training_pathways;
drop trigger if exists trg_updated_at on public.autoskill_pathway_assignments;
drop trigger if exists trg_updated_at on public.autoskill_process_modules;
drop trigger if exists trg_updated_at on public.autoskill_process_lessons;
drop trigger if exists trg_updated_at on public.autoskill_skill_checkpoints;
drop trigger if exists trg_updated_at on public.autoskill_safety_acknowledgements;
drop trigger if exists trg_updated_at on public.autoskill_employee_safety_acknowledgements;
drop trigger if exists trg_updated_at on public.autoskill_competencies;
drop trigger if exists trg_updated_at on public.autoskill_progress_records;
drop trigger if exists trg_updated_at on public.autoskill_checkpoint_submissions;
drop trigger if exists trg_updated_at on public.autoskill_supervisor_reviews;
drop trigger if exists trg_updated_at on public.autoskill_evidence_records;
drop trigger if exists trg_updated_at on public.autoskill_dashboard_alerts;
drop trigger if exists trg_updated_at on public.autoskill_sync_queue;
drop trigger if exists trg_updated_at on public.autoskill_app_settings;
*/


-- ════════════════════════════════════════════════════════════════════════════
-- STEP 3: DROP FUNCTIONS
-- ════════════════════════════════════════════════════════════════════════════

/*
drop function if exists public.touch_updated_at() cascade;
drop function if exists public.user_organisation_id() cascade;
drop function if exists public.is_org_admin_or_manager() cascade;
drop function if exists public.is_supervisor_or_trainer() cascade;
drop function if exists public.is_employee_self(uuid) cascade;
drop function if exists public.calculate_employee_progress(uuid) cascade;
drop function if exists public.create_dashboard_alert_fn(uuid, text, text, text, autoskill_alert_severity, uuid, uuid, boolean) cascade;
drop function if exists public._autoskill_make_updated_at_trigger(text) cascade;
*/


-- ════════════════════════════════════════════════════════════════════════════
-- STEP 4: DROP TABLES (reverse dependency order)
-- ════════════════════════════════════════════════════════════════════════════
-- Tables referencing other tables must be dropped FIRST.
-- The order below is the safe reverse of the creation order.

/*
drop table if exists public.autoskill_app_settings                     cascade;
drop table if exists public.autoskill_backend_events                   cascade;
drop table if exists public.autoskill_sync_queue                       cascade;
drop table if exists public.autoskill_dashboard_alerts                 cascade;
drop table if exists public.autoskill_evidence_records                 cascade;
drop table if exists public.autoskill_supervisor_reviews               cascade;
drop table if exists public.autoskill_checkpoint_submissions           cascade;
drop table if exists public.autoskill_progress_records                 cascade;
drop table if exists public.autoskill_competency_links                 cascade;
drop table if exists public.autoskill_competencies                     cascade;
drop table if exists public.autoskill_employee_safety_acknowledgements cascade;
drop table if exists public.autoskill_safety_acknowledgements          cascade;
drop table if exists public.autoskill_skill_checkpoints                cascade;
drop table if exists public.autoskill_process_lessons                  cascade;
drop table if exists public.autoskill_process_modules                  cascade;
drop table if exists public.autoskill_pathway_assignments              cascade;
drop table if exists public.autoskill_training_pathways                cascade;
drop table if exists public.autoskill_trainers_supervisors             cascade;
drop table if exists public.autoskill_employees                        cascade;
drop table if exists public.autoskill_manufacturing_stations           cascade;
drop table if exists public.autoskill_departments                      cascade;
drop table if exists public.autoskill_profiles                         cascade;
drop table if exists public.autoskill_sites                            cascade;
drop table if exists public.autoskill_organisations                    cascade;
*/


-- ════════════════════════════════════════════════════════════════════════════
-- STEP 5: DROP ENUM TYPES
-- ════════════════════════════════════════════════════════════════════════════
-- Enums can only be dropped after all tables using them are gone.

/*
drop type if exists autoskill_profile_role    cascade;
drop type if exists autoskill_record_status   cascade;
drop type if exists autoskill_progress_status cascade;
drop type if exists autoskill_sync_status     cascade;
drop type if exists autoskill_data_mode       cascade;
drop type if exists autoskill_alert_severity  cascade;
drop type if exists autoskill_review_status   cascade;
drop type if exists autoskill_evidence_type   cascade;
drop type if exists autoskill_checkpoint_type cascade;
drop type if exists autoskill_sync_priority   cascade;
*/


-- ════════════════════════════════════════════════════════════════════════════
-- FULL DEV-ONLY QUICK ROLLBACK (all in one — use with extreme caution)
-- Uncomment and run ONLY in a clean development Supabase project.
-- ⛔ DO NOT run in production without a full database backup.
-- ════════════════════════════════════════════════════════════════════════════

/*
-- ⛔ DEV ONLY — FULL AUTOSKILL OS™ SCHEMA TEARDOWN
-- All AutoSkill OS™ tables, functions, triggers, policies, and types.

drop table if exists public.autoskill_app_settings                     cascade;
drop table if exists public.autoskill_backend_events                   cascade;
drop table if exists public.autoskill_sync_queue                       cascade;
drop table if exists public.autoskill_dashboard_alerts                 cascade;
drop table if exists public.autoskill_evidence_records                 cascade;
drop table if exists public.autoskill_supervisor_reviews               cascade;
drop table if exists public.autoskill_checkpoint_submissions           cascade;
drop table if exists public.autoskill_progress_records                 cascade;
drop table if exists public.autoskill_competency_links                 cascade;
drop table if exists public.autoskill_competencies                     cascade;
drop table if exists public.autoskill_employee_safety_acknowledgements cascade;
drop table if exists public.autoskill_safety_acknowledgements          cascade;
drop table if exists public.autoskill_skill_checkpoints                cascade;
drop table if exists public.autoskill_process_lessons                  cascade;
drop table if exists public.autoskill_process_modules                  cascade;
drop table if exists public.autoskill_pathway_assignments              cascade;
drop table if exists public.autoskill_training_pathways                cascade;
drop table if exists public.autoskill_trainers_supervisors             cascade;
drop table if exists public.autoskill_employees                        cascade;
drop table if exists public.autoskill_manufacturing_stations           cascade;
drop table if exists public.autoskill_departments                      cascade;
drop table if exists public.autoskill_profiles                         cascade;
drop table if exists public.autoskill_sites                            cascade;
drop table if exists public.autoskill_organisations                    cascade;

drop function if exists public.touch_updated_at() cascade;
drop function if exists public.user_organisation_id() cascade;
drop function if exists public.is_org_admin_or_manager() cascade;
drop function if exists public.is_supervisor_or_trainer() cascade;
drop function if exists public.is_employee_self(uuid) cascade;
drop function if exists public.calculate_employee_progress(uuid) cascade;
drop function if exists public.create_dashboard_alert_fn cascade;
drop function if exists public._autoskill_make_updated_at_trigger(text) cascade;

drop type if exists autoskill_profile_role    cascade;
drop type if exists autoskill_record_status   cascade;
drop type if exists autoskill_progress_status cascade;
drop type if exists autoskill_sync_status     cascade;
drop type if exists autoskill_data_mode       cascade;
drop type if exists autoskill_alert_severity  cascade;
drop type if exists autoskill_review_status   cascade;
drop type if exists autoskill_evidence_type   cascade;
drop type if exists autoskill_checkpoint_type cascade;
drop type if exists autoskill_sync_priority   cascade;
*/


-- ════════════════════════════════════════════════════════════════════════════
-- END OF 999_autoskill_rollback_notes.sql
-- ════════════════════════════════════════════════════════════════════════════
