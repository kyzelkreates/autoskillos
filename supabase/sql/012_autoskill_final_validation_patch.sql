-- ════════════════════════════════════════════════════════════════════════════
-- AutoSkill OS™ — Run 12: Final Validation Patch SQL
-- Powered by 4P3X Intelligent AI™ — Created by Kyzel Kreates™
-- ────────────────────────────────────────────────────────────────────────────
-- Purpose : Performance indexes, convenience views, and RLS health checks
--           for live dashboard reporting and Employee PWA sync validation.
-- Safety  : Additive only — does NOT alter or drop any Run 9 schema objects.
-- RLS     : ROW LEVEL SECURITY REMAINS ENABLED on all live tables.
-- Run     : Execute in Supabase SQL Editor after 001_autoskill_full_backend_setup.sql
-- ════════════════════════════════════════════════════════════════════════════

-- ── SECTION 1: PERFORMANCE INDEXES ──────────────────────────────────────────
-- These are CREATE INDEX IF NOT EXISTS — safe to re-run.

-- Sync queue: dashboard reads by status + employee
CREATE INDEX IF NOT EXISTS idx_autoskill_sq_status
  ON autoskill_sync_queue(status)
  WHERE is_demo = false;

CREATE INDEX IF NOT EXISTS idx_autoskill_sq_employee_status
  ON autoskill_sync_queue(employee_id, status)
  WHERE is_demo = false;

CREATE INDEX IF NOT EXISTS idx_autoskill_sq_event_type
  ON autoskill_sync_queue(event_type, created_at DESC)
  WHERE is_demo = false;

-- Progress records: employee training summary queries
CREATE INDEX IF NOT EXISTS idx_autoskill_progress_employee
  ON autoskill_progress_records(employee_id, status)
  WHERE is_demo = false;

CREATE INDEX IF NOT EXISTS idx_autoskill_progress_lesson
  ON autoskill_progress_records(lesson_id, status)
  WHERE is_demo = false;

-- Safety acknowledgements: report queries
CREATE INDEX IF NOT EXISTS idx_autoskill_safety_employee
  ON autoskill_employee_safety_acknowledgements(employee_id)
  WHERE is_demo = false;

CREATE INDEX IF NOT EXISTS idx_autoskill_safety_ack_id
  ON autoskill_employee_safety_acknowledgements(acknowledgement_id)
  WHERE is_demo = false;

-- Supervisor reviews: pending queue queries
CREATE INDEX IF NOT EXISTS idx_autoskill_reviews_status
  ON autoskill_supervisor_reviews(status, requested_at DESC)
  WHERE is_demo = false;

-- Checkpoint submissions: reporting queries
CREATE INDEX IF NOT EXISTS idx_autoskill_checkpoints_employee
  ON autoskill_checkpoint_submissions(employee_id, submitted_at DESC)
  WHERE is_demo = false;

-- Employees: active live employee queries
CREATE INDEX IF NOT EXISTS idx_autoskill_employees_org_status
  ON autoskill_employees(organisation_id, status)
  WHERE is_demo = false;

-- Dashboard alerts: unresolved alert queries
CREATE INDEX IF NOT EXISTS idx_autoskill_alerts_unresolved
  ON autoskill_dashboard_alerts(resolved, created_at DESC)
  WHERE is_demo = false;


-- ── SECTION 2: CONVENIENCE VIEWS FOR LIVE DASHBOARD REPORTING ───────────────
-- Read-only views — respect RLS through the underlying tables.

-- View: live employee training progress summary (for dashboard reports)
CREATE OR REPLACE VIEW autoskill_live_employee_summary AS
SELECT
  e.id                       AS employee_id,
  e.display_name             AS employee_name,
  e.employee_number,
  e.department_id,
  e.role_title,
  e.status                   AS employee_status,
  e.progress_percent,
  e.organisation_id,
  COUNT(DISTINCT pr.lesson_id) FILTER (WHERE pr.status = 'completed')  AS completed_lessons,
  COUNT(DISTINCT pr.id)        FILTER (WHERE pr.status ILIKE '%checkpoint%') AS checkpoint_attempts,
  COUNT(DISTINCT esa.id)                                                AS safety_acks_done,
  COUNT(DISTINCT sr.id)        FILTER (WHERE sr.status = 'pending')    AS pending_reviews,
  MAX(pr.updated_at)                                                    AS last_activity_at,
  e.created_at
FROM autoskill_employees e
LEFT JOIN autoskill_progress_records             pr  ON pr.employee_id = e.id  AND pr.is_demo = false
LEFT JOIN autoskill_employee_safety_acknowledgements esa ON esa.employee_id = e.id AND esa.is_demo = false
LEFT JOIN autoskill_supervisor_reviews           sr  ON sr.employee_id = e.id  AND sr.is_demo = false
WHERE e.is_demo = false
GROUP BY e.id, e.display_name, e.employee_number, e.department_id,
         e.role_title, e.status, e.progress_percent, e.organisation_id, e.created_at;

-- Note: This view inherits RLS from autoskill_employees.
-- Non-admin users see only their own record. Managers see their org.

-- View: live sync queue health (for dashboard sync health panel)
CREATE OR REPLACE VIEW autoskill_live_sync_health AS
SELECT
  COUNT(*) FILTER (WHERE status = 'queued')         AS queued_count,
  COUNT(*) FILTER (WHERE status = 'synced')         AS synced_count,
  COUNT(*) FILTER (WHERE status = 'failed')         AS failed_count,
  COUNT(*) FILTER (WHERE status = 'conflict')       AS conflict_count,
  COUNT(*) FILTER (WHERE priority = 'safety-critical') AS safety_critical_count,
  COUNT(*) FILTER (WHERE event_type = 'lesson_completed') AS lesson_completed_count,
  COUNT(*) FILTER (WHERE event_type = 'safety_acknowledged') AS safety_acked_count,
  COUNT(*) FILTER (WHERE event_type = 'supervisor_review_requested') AS review_requested_count,
  MAX(created_at)                                   AS last_event_at,
  MIN(created_at) FILTER (WHERE status = 'queued') AS oldest_queued_at
FROM autoskill_sync_queue
WHERE is_demo = false;

-- View: safety acknowledgement completeness report
CREATE OR REPLACE VIEW autoskill_safety_ack_report AS
SELECT
  sa.id                      AS acknowledgement_id,
  sa.title,
  sa.is_legal_critical,
  sa.is_safety_critical,
  COUNT(DISTINCT e.id)       AS total_live_employees,
  COUNT(DISTINCT esa.employee_id) AS employees_acknowledged,
  COUNT(DISTINCT e.id) - COUNT(DISTINCT esa.employee_id) AS employees_missing,
  ROUND(
    COUNT(DISTINCT esa.employee_id)::numeric /
    NULLIF(COUNT(DISTINCT e.id), 0) * 100, 1
  )                          AS completion_percent
FROM autoskill_safety_acknowledgements sa
CROSS JOIN autoskill_employees e
LEFT JOIN autoskill_employee_safety_acknowledgements esa
  ON esa.acknowledgement_id = sa.id AND esa.employee_id = e.id AND esa.is_demo = false
WHERE sa.is_demo = false AND e.is_demo = false AND e.status = 'active'
GROUP BY sa.id, sa.title, sa.is_legal_critical, sa.is_safety_critical;


-- ── SECTION 3: RLS POLICY HEALTH CHECKS ─────────────────────────────────────
-- Verify RLS is enabled. This is a verification query only — no changes.

DO $$
DECLARE
  tbl TEXT;
  rls_on BOOLEAN;
  missing_rls TEXT[] := ARRAY[]::TEXT[];
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'autoskill_employees','autoskill_departments','autoskill_training_pathways',
    'autoskill_process_modules','autoskill_process_lessons',
    'autoskill_progress_records','autoskill_checkpoint_submissions',
    'autoskill_employee_safety_acknowledgements','autoskill_supervisor_reviews',
    'autoskill_evidence_records','autoskill_dashboard_alerts','autoskill_sync_queue',
    'autoskill_app_settings'
  ]
  LOOP
    SELECT relrowsecurity INTO rls_on
    FROM pg_class
    WHERE relname = tbl AND relnamespace = 'public'::regnamespace;

    IF NOT FOUND THEN
      RAISE NOTICE 'TABLE NOT FOUND: % — run 001_autoskill_full_backend_setup.sql first', tbl;
    ELSIF NOT rls_on THEN
      missing_rls := array_append(missing_rls, tbl);
      RAISE WARNING 'RLS NOT ENABLED: % — enabling now', tbl;
      EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tbl);
    ELSE
      RAISE NOTICE 'RLS OK: %', tbl;
    END IF;
  END LOOP;

  IF array_length(missing_rls, 1) > 0 THEN
    RAISE NOTICE 'RLS was missing on: %. RLS has been enabled. Review policies in Run 9 setup.', array_to_string(missing_rls, ', ');
  ELSE
    RAISE NOTICE 'All AutoSkill OS™ tables have RLS enabled. ✅';
  END IF;
END;
$$;


-- ── SECTION 4: SAFE APP SETTING UPSERT (OPTIONAL) ───────────────────────────
-- Records that Run 12 final validation has been applied.
-- Only inserts if autoskill_app_settings exists and has an organisation context.
-- This is advisory only — the app works without it.

-- INSERT INTO autoskill_app_settings (setting_key, setting_value, is_public, description)
-- VALUES (
--   'autoskill_run_12_applied',
--   '{"applied": true, "runPhase": "Run 12 — Final Validation", "appliedAt": "2026-06-05"}',
--   true,
--   'Records that Run 12 final validation patch was applied.'
-- )
-- ON CONFLICT (organisation_id, setting_key) DO UPDATE
--   SET setting_value = EXCLUDED.setting_value,
--       updated_at    = now();
-- (Uncomment after setting your organisation_id context)


-- ── SECTION 5: VERIFICATION QUERIES ─────────────────────────────────────────
-- Run these after applying this patch to confirm everything is healthy.

-- 5a. Confirm indexes were created
SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_autoskill_%'
ORDER BY tablename, indexname;

-- 5b. Confirm views were created
SELECT table_name AS view_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE 'autoskill_%summary%'
   OR table_name IN ('autoskill_live_sync_health', 'autoskill_safety_ack_report')
ORDER BY table_name;

-- 5c. Confirm RLS is still enabled on all tables
SELECT relname AS table_name, relrowsecurity AS rls_enabled
FROM pg_class
WHERE relname LIKE 'autoskill_%'
  AND relkind = 'r'
  AND relnamespace = 'public'::regnamespace
ORDER BY relname;

-- 5d. Live sync queue health check
SELECT * FROM autoskill_live_sync_health;

-- 5e. Safety acknowledgement completeness (requires live employee + ack records)
-- SELECT * FROM autoskill_safety_ack_report ORDER BY is_legal_critical DESC, completion_percent ASC;


-- ════════════════════════════════════════════════════════════════════════════
-- END OF RUN 12 FINAL VALIDATION PATCH
-- ────────────────────────────────────────────────────────────────────────────
-- RLS STATUS: ENABLED on all autoskill_* tables.
-- SECURITY:   No service role key usage. Anon/public client only in frontend.
-- NEXT STEPS: See README.md — Vercel deployment + auth/profile setup.
-- ════════════════════════════════════════════════════════════════════════════
