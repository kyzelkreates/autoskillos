// AutoSkill OS™ — Shared Constants
// Single source of truth for keys, thresholds, roles, and brand identity.
// Used across Employee Learning PWA and Control Dashboard.
// Powered by 4P3X Intelligent AI™ — Created by Kyzel Kreates™

// ── Roles ─────────────────────────────────────────────────────────
export const AP3X_ROLES = {
  EMPLOYEE:  'patient',      // internal key preserved for localStorage backward compat
  TRAINER:   'therapist',    // internal key preserved for localStorage backward compat
  CLINICIAN: 'therapist'     // alias — backward compat
};

// ── SSOT storage keys (ap3x_ prefix to avoid BCO collisions) ──────
// NOTE: Storage keys intentionally unchanged — preserves existing local data.
export const AP3X_KEYS = {
  ANXIETY_LOGS:       'ap3x_anxiety_logs',       // → training check-in logs
  MOOD_LOGS:          'ap3x_mood_logs',           // → readiness/engagement logs
  SLEEP_LOGS:         'ap3x_sleep_logs',          // → wellbeing logs
  TRIGGER_LOGS:       'ap3x_trigger_logs',        // → incident/flag logs
  RISK_FLAGS:         'ap3x_risk_flags',          // → competency flags
  USER_PROFILE:       'ap3x_user_profile',
  PATIENT_PROFILE:    'ap3x_patient_profile',     // → employee profile (key preserved)
  STREAK:             'ap3x_streak',
  SYNC_QUEUE:         'ap3x_sync_queue',
  TRAINER_NOTES:      'ap3x_clinician_notes',     // → supervisor/trainer notes (key preserved)
  CLINICIAN_NOTES:    'ap3x_clinician_notes',     // alias — backward compat
  LESSON_PROGRESS:    'ap3x_lesson_progress',
  CHECKINS:           'ap3x_patient_checkins',    // → training check-ins (key preserved)
  XP:                 'ap3x_xp',
  SETTINGS:           'ap3x_settings',
  DEMO_MODE:          '4p3x_demo_mode',
  CRISIS_NAME:        '4p3x_crisis_name',         // → emergency contact name
  CRISIS_CONTACT:     '4p3x_crisis_contact'       // → emergency contact number
};

// ── Status levels ─────────────────────────────────────────────────
export const RISK_LEVELS = {
  LOW:      'LOW',
  MEDIUM:   'MEDIUM',
  HIGH:     'HIGH',
  CRITICAL: 'CRITICAL',
  MISSING:  'MISSING_DATA'
};

// ── Rule thresholds ───────────────────────────────────────────────
export const THRESHOLDS = {
  ANXIETY_CRITICAL:      8,   // single score >= this -> CRITICAL flag
  ANXIETY_HIGH:          6,   // single score >= this -> HIGH flag
  ANXIETY_MEDIUM_RUN:    5,   // 3 consecutive >= this -> MEDIUM flag
  ANXIETY_MEDIUM_COUNT:  3,   // consecutive entries for medium trend
  SLEEP_LOW:             4,   // sleep score < this -> low flag
  MISSING_DATA_HOURS:   48    // no check-in in this many hours -> MISSING
};

// ── Platform notice (displayed in all UI footers) ─────────────────
export const DISCLAIMER =
  'AutoSkill OS™ supports manufacturing workforce training, competency tracking, and ' +
  'supervisor-guided progress monitoring. It does not provide emergency safety response, ' +
  'medical diagnosis, or a replacement for site-specific safety protocols. All competency ' +
  'indicators are informational only and must be reviewed by a qualified supervisor or ' +
  'training manager. For on-site emergencies, follow your site emergency procedure immediately. ' +
  'Created by Kyzel Kreates™ · Powered by 4P3X Intelligent AI™.';

// ── Product identity ──────────────────────────────────────────────
export const BRAND = {
  name:      'AutoSkill OS™',
  shortName: 'AutoSkill OS',
  tagline:   'Employee Learning PWA + Training Control Dashboard',
  powered:   'Powered by 4P3X Intelligent AI™ — Created by Kyzel Kreates™',
  version:   '2.0.0'
};
