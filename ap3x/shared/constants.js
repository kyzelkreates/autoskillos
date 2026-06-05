// AutoSkill OS™ — Shared Constants
// Single source of truth for keys, thresholds, roles, and brand identity.
// Used across Employee Learning PWA and Control Dashboard.
// Powered by 4P3X Intelligent AI™ — Created by Kyzel Kreates™

// ── Roles ─────────────────────────────────────────────────────────
// ── Route constants ──────────────────────────────────────────────────────────
export const ROUTES = {
  EMPLOYEE_PWA:        '/ap3x/employee-pwa/',            // canonical public route
  EMPLOYEE_PWA_LEGACY: '/ap3x/patient-pwa/',             // physical path (Vercel rewrite target)
  CONTROL_DASHBOARD:   '/ap3x/demo/clinician-demo.html', // Control Dashboard
  DEMO_HOME:           '/ap3x/demo/',                    // Demo landing
};

export const AP3X_ROLES = {
  EMPLOYEE:  'patient',      // internal key preserved for localStorage backward compat
  TRAINER:   'therapist',    // internal key preserved for localStorage backward compat
  CLINICIAN: 'supervisor'    // AutoSkill: supervisor / training manager (internal alias)
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
  CLINICIAN_NOTES:    'ap3x_clinician_notes',     // storage key preserved for backward compat
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
  ANXIETY_CRITICAL:      8,   // readiness score: if low score >= this threshold -> CRITICAL flag
  ANXIETY_HIGH:          6,   // readiness score: if low score >= this threshold -> HIGH flag
  ANXIETY_MEDIUM_RUN:    5,   // 3 consecutive below threshold -> MEDIUM flag
  ANXIETY_MEDIUM_COUNT:  3,   // consecutive entries for trend detection
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

// ── Run 2: Manufacturing Training Data Model constants ────────────
// These extend the existing SSOT without changing existing keys.

// Competency / progress status values
export const COMPETENCY_STATUS = {
  NOT_STARTED:  'not_started',
  IN_PROGRESS:  'in_progress',
  COMPETENT:    'competent',
  NEEDS_REVIEW: 'needs_review'
};

// Safety acknowledgement status values
export const SAFETY_ACK_STATUS = {
  PENDING:  'pending',
  PARTIAL:  'partial',
  COMPLETE: 'complete'
};

// Lesson types
export const LESSON_TYPES = {
  READING:          'reading',
  CHECKLIST:        'checklist',
  VIDEO_PLACEHOLDER:'video-placeholder',
  QUIZ:             'quiz',
  PRACTICAL:        'practical',
  SUPERVISOR_REVIEW:'supervisor-review'
};

// Checkpoint types
export const CHECKPOINT_TYPES = {
  MULTIPLE_CHOICE:   'multipleChoice',
  CHECKLIST:         'checklist',
  ACKNOWLEDGEMENT:   'acknowledgement',
  SUPERVISOR_SIGNOFF:'supervisorSignoff'
};

// Data sync status values
export const SYNC_STATUS = {
  LOCAL:   'local',
  QUEUED:  'queued',
  SYNCED:  'synced',
  FAILED:  'failed'
};

// Alert types and severities
export const ALERT_TYPES = {
  OVERDUE_TRAINING:    'overdue-training',
  SAFETY_ACK_MISSING:  'safety-ack-missing',
  REVIEW_REQUIRED:     'review-required',
  SYNC_ERROR:          'sync-error',
  INCOMPLETE_PATHWAY:  'incomplete-pathway',
  DEMO_WARNING:        'demo-warning'
};

export const ALERT_SEVERITY = {
  INFO:     'info',
  WARNING:  'warning',
  CRITICAL: 'critical'
};

// Supervisor review status values
export const REVIEW_STATUS = {
  PENDING:            'pending',
  APPROVED:           'approved',
  REJECTED:           'rejected',
  NEEDS_MORE_EVIDENCE:'needs_more_evidence'
};

// Evidence record types
export const EVIDENCE_TYPES = {
  NOTE:              'note',
  CHECKLIST:         'checklist',
  PHOTO_PLACEHOLDER: 'photo-placeholder',
  SUPERVISOR_NOTE:   'supervisor-note',
  QUIZ_RESULT:       'quiz-result'
};

// Pathway / module status values
export const ENTITY_STATUS = {
  ACTIVE:   'active',
  DRAFT:    'draft',
  ARCHIVED: 'archived'
};

// Employee status values
export const EMPLOYEE_STATUS = {
  ACTIVE:    'active',
  PAUSED:    'paused',
  COMPLETED: 'completed',
  ARCHIVED:  'archived'
};

// Data / backend mode values
export const DATA_MODE = {
  DEMO:  'demo',
  LIVE:  'live',
  LOCAL: 'local'
};

export const BACKEND_PROVIDER = {
  LOCAL_ONLY:    'local-only',
  SUPABASE:      'supabase',
  FIREBASE:      'firebase',
  REST_ENDPOINT: 'rest-endpoint'
};

export const CONNECTION_STATUS = {
  NOT_CONFIGURED: 'not_configured',
  CONFIGURED:     'configured',
  TEST_REQUIRED:  'test_required',
  CONNECTED:      'connected',
  FAILED:         'failed'
};
