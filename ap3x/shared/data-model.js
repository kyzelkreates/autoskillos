// AutoSkill OS™ — Manufacturing Training Data Model
// Single Source of Truth: Entity schemas, demo records, helper functions.
// Run 2 — Data Model + SSOT Layer
//
// Architecture rules:
//   - All demo records are marked isDemo: true
//   - All records include createdAt / updatedAt ISO timestamps
//   - No backend calls made here — local-first only
//   - Storage keys use AP3X_DM_ prefix to avoid collisions with existing ap3x_ keys
//   - Existing localStorage keys (ap3x_*, 4p3x_*) are NOT touched
//   - This file is the authority for manufacturing entity schemas
//   - Dashboard and PWA import helpers from here; they do not define their own schemas
//
// Powered by 4P3X Intelligent AI™ — Created by Kyzel Kreates™
// Demo Mode shows the product. Live Mode runs the product.

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1: STORAGE KEY REGISTRY
// All new Run 2 keys. Existing ap3x_* keys in constants.js are NOT changed.
// ─────────────────────────────────────────────────────────────────────────────

export const DM_KEYS = {
  // Entity collections
  EMPLOYEES:               'ap3x_dm_employees',
  TRAINERS:                'ap3x_dm_trainers',
  DEPARTMENTS:             'ap3x_dm_departments',
  STATIONS:                'ap3x_dm_stations',
  PATHWAYS:                'ap3x_dm_pathways',
  PROCESS_MODULES:         'ap3x_dm_process_modules',
  PROCESS_LESSONS:         'ap3x_dm_process_lessons',
  SKILL_CHECKPOINTS:       'ap3x_dm_skill_checkpoints',
  COMPETENCIES:            'ap3x_dm_competencies',
  SAFETY_ACKS:             'ap3x_dm_safety_acks',
  PROGRESS_RECORDS:        'ap3x_dm_progress_records',
  SUPERVISOR_REVIEWS:      'ap3x_dm_supervisor_reviews',
  EVIDENCE_RECORDS:        'ap3x_dm_evidence_records',
  DASHBOARD_ALERTS:        'ap3x_dm_dashboard_alerts',
  // Config
  BACKEND_CONFIG:          'ap3x_dm_backend_config',
  DATA_MODE:               'ap3x_dm_data_mode',
  // PWA sync queue (supplements existing ap3x_sync_queue for structured records)
  PWA_SYNC_QUEUE:          'ap3x_dm_pwa_sync_queue',
  // Seed flag
  DM_SEEDED:               'ap3x_dm_seeded_v1'
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2: STORAGE HELPERS (local-first, no deps on BCO for compatibility)
// ─────────────────────────────────────────────────────────────────────────────

function dmGet(key, fallback = null) {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

function dmSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

function dmUpdate(key, fn, fallback = []) {
  const current = dmGet(key, fallback);
  const updated = fn(current);
  dmSet(key, updated);
  return updated;
}

function _ts() { return new Date().toISOString(); }
function _uuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3: DATA MODE + BACKEND CONFIG
// ─────────────────────────────────────────────────────────────────────────────

/**
 * getDataMode() → 'demo' | 'live' | 'local'
 * Compatible with existing 4p3x_demo_mode key used by the dashboard.
 */
export function getDataMode() {
  return dmGet(DM_KEYS.DATA_MODE, 'demo');
}

export function setDataMode(mode) {
  if (!['demo', 'live', 'local'].includes(mode)) {
    console.warn('[AutoSkill OS] Invalid data mode:', mode);
    return;
  }
  dmSet(DM_KEYS.DATA_MODE, mode);
  // Keep in sync with existing dashboard key
  try { localStorage.setItem('4p3x_demo_mode', JSON.stringify(mode === 'demo')); } catch {}
}

/**
 * backendConfigPlaceholder
 * Read-only shape. Store via saveBackendConfig(). No secrets stored here.
 */
export const BACKEND_CONFIG_DEFAULTS = {
  mode:             'demo',           // 'demo' | 'live'
  provider:         'local-only',     // 'local-only' | 'supabase' | 'firebase' | 'rest-endpoint'
  connectionStatus: 'not_configured', // 'not_configured' | 'configured' | 'test_required' | 'connected' | 'failed'
  publicConfig: {
    projectUrl:   '',                 // e.g. https://xyz.supabase.co — public, not secret
    anonKeyHint:  '',                 // display hint only — never the real key
    region:       ''
  },
  maskedStatus: '',
  lastTestedAt:  null,
  updatedAt:     null
};

export function getBackendConfig() {
  return dmGet(DM_KEYS.BACKEND_CONFIG, BACKEND_CONFIG_DEFAULTS);
}

export function saveBackendConfig(partial) {
  const current = getBackendConfig();
  const updated = { ...current, ...partial, updatedAt: _ts() };
  dmSet(DM_KEYS.BACKEND_CONFIG, updated);
  return updated;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4: ENTITY SCHEMAS (documentation + validation shapes)
// These define the expected structure of each entity.
// ─────────────────────────────────────────────────────────────────────────────

export const ENTITY_SCHEMAS = {

  employee: {
    id:                        String,   // uuid
    displayName:               String,
    employeeNumber:            String,
    roleTitle:                 String,   // 'Assembly Trainee' | 'Quality Control Trainee' | etc.
    departmentId:              String,
    shift:                     String,   // 'Morning' | 'Afternoon' | 'Night'
    site:                      String,
    status:                    String,   // 'active' | 'paused' | 'completed' | 'archived'
    assignedPathwayIds:        Array,    // [pathwayId, ...]
    completedModuleIds:        Array,    // [moduleId, ...]
    completedLessonIds:        Array,    // [lessonId, ...]
    competencyStatus:          String,   // 'not_started' | 'in_progress' | 'competent' | 'needs_review'
    safetyAcknowledgementStatus: String, // 'pending' | 'partial' | 'complete'
    lastActivityAt:            String,   // ISO
    progressPercent:           Number,   // 0–100
    syncStatus:                String,   // 'local' | 'queued' | 'synced' | 'failed'
    createdAt:                 String,
    updatedAt:                 String,
    isDemo:                    Boolean
  },

  trainer: {
    id:                String,
    displayName:       String,
    roleTitle:         String,   // 'Training Manager' | 'Supervisor' | 'Trainer'
    departmentId:      String,
    permissions:       Object,   // { canApproveCompetency, canCreatePathway, canViewAnalytics }
    assignedEmployeeIds: Array,
    reviewQueueIds:    Array,
    createdAt:         String,
    updatedAt:         String,
    isDemo:            Boolean
  },

  department: {
    id:               String,
    name:             String,
    description:      String,
    site:             String,
    managerName:      String,
    activePathwayIds: Array,
    isDemo:           Boolean
  },

  manufacturingStation: {
    id:                 String,
    name:               String,
    departmentId:       String,
    description:        String,
    safetyCritical:     Boolean,
    requiredPpe:        Array,   // ['Hard hat', 'Safety glasses', ...]
    linkedModuleIds:    Array,
    linkedCompetencyIds: Array,
    isDemo:             Boolean
  },

  trainingPathway: {
    id:                       String,
    title:                    String,
    description:              String,
    departmentId:             String,
    moduleIds:                Array,
    requiredForRoles:         Array,   // ['Assembly Trainee', ...]
    estimatedDuration:        String,  // '2 hours' | '3 days' etc.
    status:                   String,  // 'active' | 'draft' | 'archived'
    competencyIds:            Array,
    safetyAcknowledgementIds: Array,
    isDemo:                   Boolean
  },

  processModule: {
    id:                  String,
    pathwayId:           String,
    title:               String,
    description:         String,
    order:               Number,
    lessonIds:           Array,
    checkpointIds:       Array,
    safetyCritical:      Boolean,
    estimatedDuration:   String,
    completionRequired:  Boolean,
    isDemo:              Boolean
  },

  processLesson: {
    id:                      String,
    moduleId:                String,
    title:                   String,
    summary:                 String,
    content:                 String,   // placeholder — full content in Run 5
    order:                   Number,
    estimatedDuration:       String,
    lessonType:              String,   // 'reading' | 'checklist' | 'video-placeholder' | 'quiz' | 'practical' | 'supervisor-review'
    safetyCritical:          Boolean,
    requiredAcknowledgementId: String,
    completionRules:         Object,   // { requireCheckpoint: bool, requireAcknowledgement: bool }
    isDemo:                  Boolean
  },

  skillCheckpoint: {
    id:             String,
    lessonId:       String,
    moduleId:       String,
    question:       String,
    type:           String,  // 'multipleChoice' | 'checklist' | 'acknowledgement' | 'supervisorSignoff'
    options:        Array,
    correctAnswer:  String,
    required:       Boolean,
    safetyCritical: Boolean,
    passRequired:   Boolean,
    isDemo:         Boolean
  },

  competency: {
    id:                      String,
    title:                   String,
    description:             String,
    departmentId:            String,
    stationId:               String,
    requiredEvidence:        Array,   // ['quiz_pass', 'supervisor_signoff', 'practical_observation']
    supervisorSignoffRequired: Boolean,
    linkedModuleIds:         Array,
    status:                  String,  // 'active' | 'draft' | 'archived'
    isDemo:                  Boolean
  },

  safetyAcknowledgement: {
    id:                      String,
    title:                   String,
    description:             String,
    linkedLessonId:          String,
    linkedModuleId:          String,
    requiredForCompletion:   Boolean,
    legalCritical:           Boolean,
    acknowledgedByEmployeeIds: Array,
    createdAt:               String,
    isDemo:                  Boolean
  },

  progressRecord: {
    id:               String,
    employeeId:       String,
    pathwayId:        String,
    moduleId:         String,
    lessonId:         String,
    status:           String,   // 'not_started' | 'in_progress' | 'completed' | 'needs_review'
    progressPercent:  Number,
    score:            Number,   // null if not applicable
    timeSpentMinutes: Number,
    completedAt:      String,   // ISO | null
    lastUpdatedAt:    String,
    source:           String,   // 'dashboard' | 'employee-pwa' | 'demo'
    syncStatus:       String,   // 'local' | 'queued' | 'synced' | 'failed'
    isDemo:           Boolean
  },

  supervisorReview: {
    id:                String,
    employeeId:        String,
    supervisorId:      String,
    pathwayId:         String,
    moduleId:          String,
    competencyId:      String,
    status:            String,  // 'pending' | 'approved' | 'rejected' | 'needs_more_evidence'
    notes:             String,
    reviewedAt:        String,  // ISO | null
    evidenceRecordIds: Array,
    isDemo:            Boolean
  },

  evidenceRecord: {
    id:          String,
    employeeId:  String,
    pathwayId:   String,
    moduleId:    String,
    lessonId:    String,
    type:        String,  // 'note' | 'checklist' | 'photo-placeholder' | 'supervisor-note' | 'quiz-result'
    title:       String,
    description: String,
    createdAt:   String,
    source:      String,  // 'dashboard' | 'employee-pwa'
    syncStatus:  String,
    isDemo:      Boolean
  },

  dashboardAlert: {
    id:               String,
    type:             String,  // 'overdue-training' | 'safety-ack-missing' | 'review-required' | 'sync-error' | 'incomplete-pathway' | 'demo-warning'
    title:            String,
    message:          String,
    severity:         String,  // 'info' | 'warning' | 'critical'
    linkedEmployeeId: String,
    linkedPathwayId:  String,
    createdAt:        String,
    resolved:         Boolean,
    isDemo:           Boolean
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5: DEMO DATA — DEPARTMENTS
// ─────────────────────────────────────────────────────────────────────────────

export const DEMO_DEPARTMENTS = [
  {
    id: 'dept-assembly',
    name: 'Assembly Line',
    description: 'Core production assembly stations including line setup, process steps, and quality checks.',
    site: 'Site A',
    managerName: 'Dr. Reyes',
    activePathwayIds: ['path-assembly', 'path-induction'],
    isDemo: true
  },
  {
    id: 'dept-qc',
    name: 'Quality Control',
    description: 'Incoming inspection, in-process QC, defect reporting, and final inspection sign-off.',
    site: 'Site A',
    managerName: 'Dr. Reyes',
    activePathwayIds: ['path-qc'],
    isDemo: true
  },
  {
    id: 'dept-safety',
    name: 'Safety Induction',
    description: 'Site-wide safety, PPE compliance, hazard awareness, and emergency procedures.',
    site: 'Site A',
    managerName: 'Dr. Reyes',
    activePathwayIds: ['path-safety'],
    isDemo: true
  },
  {
    id: 'dept-logistics',
    name: 'Logistics',
    description: 'Materials handling, warehousing, dispatch readiness, and shift handover processes.',
    site: 'Site A',
    managerName: 'Dr. Reyes',
    activePathwayIds: ['path-induction'],
    isDemo: true
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6: DEMO DATA — MANUFACTURING STATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const DEMO_STATIONS = [
  {
    id: 'stn-workstation-readiness',
    name: 'Workstation Readiness',
    departmentId: 'dept-assembly',
    description: 'Pre-shift workstation checks, tool verification, and setup confirmation.',
    safetyCritical: true,
    requiredPpe: ['Safety glasses', 'Gloves', 'Steel-capped boots'],
    linkedModuleIds: ['mod-site-orientation', 'mod-ppe-safety'],
    linkedCompetencyIds: ['comp-ppe-readiness'],
    isDemo: true
  },
  {
    id: 'stn-assembly-process',
    name: 'Assembly Process',
    departmentId: 'dept-assembly',
    description: 'Step-by-step assembly operations following standardised work instructions.',
    safetyCritical: false,
    requiredPpe: ['Safety glasses', 'Gloves'],
    linkedModuleIds: ['mod-assembly-overview'],
    linkedCompetencyIds: ['comp-assembly-awareness'],
    isDemo: true
  },
  {
    id: 'stn-quality-inspection',
    name: 'Quality Inspection',
    departmentId: 'dept-qc',
    description: 'In-process quality checks, tolerance verification, and go/no-go gauging.',
    safetyCritical: false,
    requiredPpe: ['Safety glasses'],
    linkedModuleIds: ['mod-qc-checks'],
    linkedCompetencyIds: ['comp-defect-recognition'],
    isDemo: true
  },
  {
    id: 'stn-defect-reporting',
    name: 'Defect Reporting',
    departmentId: 'dept-qc',
    description: 'Correct defect documentation, tagging, and escalation procedures.',
    safetyCritical: false,
    requiredPpe: [],
    linkedModuleIds: ['mod-defect-reporting'],
    linkedCompetencyIds: ['comp-defect-reporting'],
    isDemo: true
  },
  {
    id: 'stn-tool-safety',
    name: 'Tool Safety',
    departmentId: 'dept-assembly',
    description: 'Safe handling, storage, and inspection of hand tools and power tools.',
    safetyCritical: true,
    requiredPpe: ['Safety glasses', 'Gloves'],
    linkedModuleIds: ['mod-ppe-safety'],
    linkedCompetencyIds: ['comp-tool-handling'],
    isDemo: true
  },
  {
    id: 'stn-final-handover',
    name: 'Final Handover',
    departmentId: 'dept-assembly',
    description: 'Shift-end workstation handover, production logs, and supervisor sign-off.',
    safetyCritical: false,
    requiredPpe: [],
    linkedModuleIds: ['mod-supervisor-signoff'],
    linkedCompetencyIds: ['comp-handover-readiness'],
    isDemo: true
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 7: DEMO DATA — TRAINING PATHWAYS
// ─────────────────────────────────────────────────────────────────────────────

export const DEMO_PATHWAYS = [
  {
    id: 'path-induction',
    title: 'New Starter Manufacturing Induction',
    description: 'Essential orientation pathway for all new employees. Covers site safety, workstation setup, and process basics.',
    departmentId: 'dept-safety',
    moduleIds: ['mod-site-orientation', 'mod-ppe-safety', 'mod-workstation-readiness'],
    requiredForRoles: ['Assembly Trainee', 'Logistics Trainee', 'New Starter'],
    estimatedDuration: '4 hours',
    status: 'active',
    competencyIds: ['comp-ppe-readiness'],
    safetyAcknowledgementIds: ['ack-ppe', 'ack-ask-supervisor'],
    isDemo: true
  },
  {
    id: 'path-assembly',
    title: 'Assembly Line Process Basics',
    description: 'Core assembly line pathway. Covers process steps, tool handling, and supervisor sign-off.',
    departmentId: 'dept-assembly',
    moduleIds: ['mod-assembly-overview', 'mod-defect-reporting', 'mod-supervisor-signoff'],
    requiredForRoles: ['Assembly Trainee'],
    estimatedDuration: '6 hours',
    status: 'active',
    competencyIds: ['comp-assembly-awareness', 'comp-tool-handling', 'comp-handover-readiness'],
    safetyAcknowledgementIds: ['ack-ppe', 'ack-defect-reporting', 'ack-supervisor-signoff'],
    isDemo: true
  },
  {
    id: 'path-qc',
    title: 'Quality Control and Defect Reporting',
    description: 'Quality-focused pathway for employees working in QC and inspection roles.',
    departmentId: 'dept-qc',
    moduleIds: ['mod-qc-checks', 'mod-defect-reporting'],
    requiredForRoles: ['Quality Control Trainee'],
    estimatedDuration: '5 hours',
    status: 'active',
    competencyIds: ['comp-defect-recognition', 'comp-defect-reporting'],
    safetyAcknowledgementIds: ['ack-defect-reporting'],
    isDemo: true
  },
  {
    id: 'path-safety',
    title: 'Safety, PPE and Workstation Readiness',
    description: 'Site-wide safety pathway required for all staff before entering production areas.',
    departmentId: 'dept-safety',
    moduleIds: ['mod-ppe-safety', 'mod-workstation-readiness'],
    requiredForRoles: ['Assembly Trainee', 'Quality Control Trainee', 'Logistics Trainee', 'New Starter'],
    estimatedDuration: '2 hours',
    status: 'active',
    competencyIds: ['comp-ppe-readiness'],
    safetyAcknowledgementIds: ['ack-ppe', 'ack-ask-supervisor'],
    isDemo: true
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 8: DEMO DATA — PROCESS MODULES
// ─────────────────────────────────────────────────────────────────────────────

export const DEMO_MODULES = [
  {
    id: 'mod-site-orientation',
    pathwayId: 'path-induction',
    title: 'Site Orientation',
    description: 'Welcome to the site. Covers layout, key contacts, emergency procedures, and daily expectations.',
    order: 1,
    lessonIds: ['les-welcome', 'les-understand-workstation'],
    checkpointIds: ['chk-workstation-readiness'],
    safetyCritical: true,
    estimatedDuration: '45 minutes',
    completionRequired: true,
    isDemo: true
  },
  {
    id: 'mod-ppe-safety',
    pathwayId: 'path-induction',
    title: 'PPE and Safety Basics',
    description: 'Personal Protective Equipment requirements, daily safety checks, and tool handling fundamentals.',
    order: 2,
    lessonIds: ['les-ppe-entering', 'les-supervisor-review'],
    checkpointIds: ['chk-ppe-check'],
    safetyCritical: true,
    estimatedDuration: '60 minutes',
    completionRequired: true,
    isDemo: true
  },
  {
    id: 'mod-workstation-readiness',
    pathwayId: 'path-induction',
    title: 'Workstation Readiness',
    description: 'Pre-shift readiness checks, tool verification, materials staging, and workstation handover.',
    order: 3,
    lessonIds: ['les-understand-workstation'],
    checkpointIds: ['chk-workstation-readiness'],
    safetyCritical: true,
    estimatedDuration: '30 minutes',
    completionRequired: true,
    isDemo: true
  },
  {
    id: 'mod-assembly-overview',
    pathwayId: 'path-assembly',
    title: 'Assembly Process Overview',
    description: 'Step-by-step walkthrough of the core assembly process, standardised work, and quality checkpoints.',
    order: 1,
    lessonIds: ['les-assembly-steps', 'les-recognise-quality'],
    checkpointIds: ['chk-assembly-process'],
    safetyCritical: false,
    estimatedDuration: '90 minutes',
    completionRequired: true,
    isDemo: true
  },
  {
    id: 'mod-qc-checks',
    pathwayId: 'path-qc',
    title: 'Quality Control Checks',
    description: 'In-process inspection methods, measurement techniques, and acceptance criteria.',
    order: 1,
    lessonIds: ['les-recognise-quality'],
    checkpointIds: ['chk-quality-recognition'],
    safetyCritical: false,
    estimatedDuration: '75 minutes',
    completionRequired: true,
    isDemo: true
  },
  {
    id: 'mod-defect-reporting',
    pathwayId: 'path-qc',
    title: 'Defect Reporting',
    description: 'How to identify, tag, document, and escalate product defects in line with site procedures.',
    order: 2,
    lessonIds: ['les-report-defects'],
    checkpointIds: ['chk-defect-reporting'],
    safetyCritical: false,
    estimatedDuration: '45 minutes',
    completionRequired: true,
    isDemo: true
  },
  {
    id: 'mod-supervisor-signoff',
    pathwayId: 'path-assembly',
    title: 'Supervisor Sign-Off',
    description: 'Preparing for and completing the formal supervisor competency sign-off at end of induction.',
    order: 3,
    lessonIds: ['les-supervisor-review'],
    checkpointIds: [],
    safetyCritical: false,
    estimatedDuration: '30 minutes',
    completionRequired: true,
    isDemo: true
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 9: DEMO DATA — PROCESS LESSONS
// Full lesson body content added in Run 5. Placeholders here are functional.
// ─────────────────────────────────────────────────────────────────────────────

export const DEMO_LESSONS = [
  {
    id: 'les-welcome',
    moduleId: 'mod-site-orientation',
    title: 'Welcome to the Manufacturing Training Process',
    summary: 'An introduction to AutoSkill OS™ and what your training journey will look like.',
    content: '',  // Full content: Run 5
    order: 1,
    estimatedDuration: '10 minutes',
    lessonType: 'reading',
    safetyCritical: false,
    requiredAcknowledgementId: null,
    completionRules: { requireCheckpoint: false, requireAcknowledgement: false },
    isDemo: true
  },
  {
    id: 'les-understand-workstation',
    moduleId: 'mod-workstation-readiness',
    title: 'Understanding Your Workstation',
    summary: 'Learn your workstation layout, daily readiness checks, and expected standards before starting work.',
    content: '',  // Full content: Run 5
    order: 1,
    estimatedDuration: '15 minutes',
    lessonType: 'checklist',
    safetyCritical: true,
    requiredAcknowledgementId: null,
    completionRules: { requireCheckpoint: true, requireAcknowledgement: false },
    isDemo: true
  },
  {
    id: 'les-ppe-entering',
    moduleId: 'mod-ppe-safety',
    title: 'PPE Before Entering Production Areas',
    summary: 'The PPE requirements you must meet before entering any production area on site.',
    content: '',  // Full content: Run 5
    order: 1,
    estimatedDuration: '20 minutes',
    lessonType: 'checklist',
    safetyCritical: true,
    requiredAcknowledgementId: 'ack-ppe',
    completionRules: { requireCheckpoint: true, requireAcknowledgement: true },
    isDemo: true
  },
  {
    id: 'les-assembly-steps',
    moduleId: 'mod-assembly-overview',
    title: 'Following Assembly Steps Safely',
    summary: 'How to follow standardised work instructions and complete each assembly step correctly.',
    content: '',  // Full content: Run 5
    order: 1,
    estimatedDuration: '25 minutes',
    lessonType: 'reading',
    safetyCritical: false,
    requiredAcknowledgementId: null,
    completionRules: { requireCheckpoint: true, requireAcknowledgement: false },
    isDemo: true
  },
  {
    id: 'les-recognise-quality',
    moduleId: 'mod-qc-checks',
    title: 'Recognising Quality Issues',
    summary: 'What quality issues look like on the line and how to identify them before they escalate.',
    content: '',  // Full content: Run 5
    order: 1,
    estimatedDuration: '20 minutes',
    lessonType: 'reading',
    safetyCritical: false,
    requiredAcknowledgementId: null,
    completionRules: { requireCheckpoint: true, requireAcknowledgement: false },
    isDemo: true
  },
  {
    id: 'les-report-defects',
    moduleId: 'mod-defect-reporting',
    title: 'Reporting Defects Correctly',
    summary: 'The correct procedure for tagging, logging, and escalating product defects.',
    content: '',  // Full content: Run 5
    order: 1,
    estimatedDuration: '15 minutes',
    lessonType: 'checklist',
    safetyCritical: false,
    requiredAcknowledgementId: 'ack-defect-reporting',
    completionRules: { requireCheckpoint: true, requireAcknowledgement: true },
    isDemo: true
  },
  {
    id: 'les-supervisor-review',
    moduleId: 'mod-supervisor-signoff',
    title: 'Completing Your Supervisor Review',
    summary: 'What to expect at your supervisor competency review and how to prepare.',
    content: '',  // Full content: Run 5
    order: 1,
    estimatedDuration: '10 minutes',
    lessonType: 'supervisor-review',
    safetyCritical: false,
    requiredAcknowledgementId: 'ack-supervisor-signoff',
    completionRules: { requireCheckpoint: false, requireAcknowledgement: true },
    isDemo: true
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 10: DEMO DATA — SKILL CHECKPOINTS
// ─────────────────────────────────────────────────────────────────────────────

export const DEMO_CHECKPOINTS = [
  {
    id: 'chk-ppe-check',
    lessonId: 'les-ppe-entering',
    moduleId: 'mod-ppe-safety',
    question: 'Which of the following is required before entering a production area?',
    type: 'multipleChoice',
    options: [
      'Safety glasses only',
      'Full PPE as specified on the station sign',
      'No PPE required for visitors',
      'PPE is optional during training'
    ],
    correctAnswer: 'Full PPE as specified on the station sign',
    required: true,
    safetyCritical: true,
    passRequired: true,
    isDemo: true
  },
  {
    id: 'chk-workstation-readiness',
    lessonId: 'les-understand-workstation',
    moduleId: 'mod-workstation-readiness',
    question: 'Which of the following should you complete before starting work at your workstation?',
    type: 'checklist',
    options: [
      'Check PPE is available and in good condition',
      'Verify tools are present and undamaged',
      'Confirm materials are correctly staged',
      'Check workstation surface is clean and clear',
      'Confirm supervisor has signed on'
    ],
    correctAnswer: null,  // all required for checklist type
    required: true,
    safetyCritical: true,
    passRequired: true,
    isDemo: true
  },
  {
    id: 'chk-assembly-process',
    lessonId: 'les-assembly-steps',
    moduleId: 'mod-assembly-overview',
    question: 'What should you do if you are unsure about an assembly step?',
    type: 'multipleChoice',
    options: [
      'Skip the step and continue',
      'Guess and proceed',
      'Stop and ask your supervisor before continuing',
      'Complete the step anyway and note it later'
    ],
    correctAnswer: 'Stop and ask your supervisor before continuing',
    required: true,
    safetyCritical: false,
    passRequired: true,
    isDemo: true
  },
  {
    id: 'chk-quality-recognition',
    lessonId: 'les-recognise-quality',
    moduleId: 'mod-qc-checks',
    question: 'When you notice a potential quality issue, what is the correct first action?',
    type: 'multipleChoice',
    options: [
      'Ignore it if it looks minor',
      'Continue production and report at end of shift',
      'Stop the process and report the issue immediately',
      'Fix it yourself without reporting'
    ],
    correctAnswer: 'Stop the process and report the issue immediately',
    required: true,
    safetyCritical: false,
    passRequired: true,
    isDemo: true
  },
  {
    id: 'chk-defect-reporting',
    lessonId: 'les-report-defects',
    moduleId: 'mod-defect-reporting',
    question: 'I understand how to correctly tag, log, and escalate a product defect.',
    type: 'acknowledgement',
    options: ['I confirm I understand the defect reporting procedure'],
    correctAnswer: 'I confirm I understand the defect reporting procedure',
    required: true,
    safetyCritical: false,
    passRequired: true,
    isDemo: true
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 11: DEMO DATA — COMPETENCIES
// ─────────────────────────────────────────────────────────────────────────────

export const DEMO_COMPETENCIES = [
  {
    id: 'comp-ppe-readiness',
    title: 'PPE Readiness',
    description: 'Employee consistently wears correct PPE and can identify site-specific PPE requirements.',
    departmentId: 'dept-safety',
    stationId: 'stn-workstation-readiness',
    requiredEvidence: ['quiz_pass', 'supervisor_signoff'],
    supervisorSignoffRequired: true,
    linkedModuleIds: ['mod-ppe-safety'],
    status: 'active',
    isDemo: true
  },
  {
    id: 'comp-tool-handling',
    title: 'Safe Tool Handling',
    description: 'Employee demonstrates safe use, storage, and inspection of hand tools and power tools.',
    departmentId: 'dept-assembly',
    stationId: 'stn-tool-safety',
    requiredEvidence: ['practical_observation', 'supervisor_signoff'],
    supervisorSignoffRequired: true,
    linkedModuleIds: ['mod-ppe-safety'],
    status: 'active',
    isDemo: true
  },
  {
    id: 'comp-assembly-awareness',
    title: 'Assembly Step Awareness',
    description: 'Employee can follow standardised work instructions and complete assembly steps in the correct sequence.',
    departmentId: 'dept-assembly',
    stationId: 'stn-assembly-process',
    requiredEvidence: ['quiz_pass', 'practical_observation'],
    supervisorSignoffRequired: false,
    linkedModuleIds: ['mod-assembly-overview'],
    status: 'active',
    isDemo: true
  },
  {
    id: 'comp-defect-recognition',
    title: 'Quality Defect Recognition',
    description: 'Employee can identify common quality defects and distinguish between acceptable and non-conforming product.',
    departmentId: 'dept-qc',
    stationId: 'stn-quality-inspection',
    requiredEvidence: ['quiz_pass'],
    supervisorSignoffRequired: false,
    linkedModuleIds: ['mod-qc-checks'],
    status: 'active',
    isDemo: true
  },
  {
    id: 'comp-defect-reporting',
    title: 'Correct Defect Reporting',
    description: 'Employee follows the correct procedure for tagging, logging, and escalating product defects.',
    departmentId: 'dept-qc',
    stationId: 'stn-defect-reporting',
    requiredEvidence: ['quiz_pass', 'supervisor_signoff'],
    supervisorSignoffRequired: true,
    linkedModuleIds: ['mod-defect-reporting'],
    status: 'active',
    isDemo: true
  },
  {
    id: 'comp-handover-readiness',
    title: 'Production Handover Readiness',
    description: 'Employee completes end-of-shift workstation handover, production logs, and supervisor sign-off correctly.',
    departmentId: 'dept-assembly',
    stationId: 'stn-final-handover',
    requiredEvidence: ['supervisor_signoff'],
    supervisorSignoffRequired: true,
    linkedModuleIds: ['mod-supervisor-signoff'],
    status: 'active',
    isDemo: true
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 12: DEMO DATA — SAFETY ACKNOWLEDGEMENTS
// ─────────────────────────────────────────────────────────────────────────────

export const DEMO_SAFETY_ACKS = [
  {
    id: 'ack-ppe',
    title: 'I understand the PPE requirements for this site',
    description: 'I confirm I have read and understood the PPE requirements for entering production areas on this site.',
    linkedLessonId: 'les-ppe-entering',
    linkedModuleId: 'mod-ppe-safety',
    requiredForCompletion: true,
    legalCritical: true,
    acknowledgedByEmployeeIds: [],
    createdAt: new Date().toISOString(),
    isDemo: true
  },
  {
    id: 'ack-ask-supervisor',
    title: 'I understand when to stop and ask a supervisor',
    description: 'I confirm I understand that I should stop any task and ask my supervisor if I am uncertain about a procedure or safety requirement.',
    linkedLessonId: 'les-understand-workstation',
    linkedModuleId: 'mod-site-orientation',
    requiredForCompletion: true,
    legalCritical: false,
    acknowledgedByEmployeeIds: [],
    createdAt: new Date().toISOString(),
    isDemo: true
  },
  {
    id: 'ack-defect-reporting',
    title: 'I understand how to report a defect',
    description: 'I confirm I understand the correct procedure for reporting a product defect and that I must not rework or conceal defects.',
    linkedLessonId: 'les-report-defects',
    linkedModuleId: 'mod-defect-reporting',
    requiredForCompletion: true,
    legalCritical: true,
    acknowledgedByEmployeeIds: [],
    createdAt: new Date().toISOString(),
    isDemo: true
  },
  {
    id: 'ack-supervisor-signoff',
    title: 'I understand that supervisor sign-off may be required',
    description: 'I confirm I understand that certain competencies require formal supervisor sign-off before I am authorised to work independently at that station.',
    linkedLessonId: 'les-supervisor-review',
    linkedModuleId: 'mod-supervisor-signoff',
    requiredForCompletion: true,
    legalCritical: false,
    acknowledgedByEmployeeIds: [],
    createdAt: new Date().toISOString(),
    isDemo: true
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 13: DEMO DATA — EMPLOYEES (the 4 required + mapped to dashboard)
// ─────────────────────────────────────────────────────────────────────────────

const _now = new Date().toISOString();

export const DEMO_EMPLOYEES = [
  {
    id: 'emp-jamie',
    displayName: 'Jamie Carter',
    employeeNumber: 'EMP-001',
    roleTitle: 'Assembly Trainee',
    departmentId: 'dept-assembly',
    shift: 'Morning',
    site: 'Site A',
    status: 'active',
    assignedPathwayIds: ['path-induction', 'path-assembly'],
    completedModuleIds: ['mod-site-orientation'],
    completedLessonIds: ['les-welcome', 'les-understand-workstation'],
    competencyStatus: 'in_progress',
    safetyAcknowledgementStatus: 'partial',
    lastActivityAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    progressPercent: 30,
    syncStatus: 'local',
    createdAt: _now,
    updatedAt: _now,
    isDemo: true,
    // Compatibility bridge: maps to dashboard DEMO_PATIENTS shape
    _dashboardId: 'P001'
  },
  {
    id: 'emp-aisha',
    displayName: 'Aisha Patel',
    employeeNumber: 'EMP-002',
    roleTitle: 'Quality Control Trainee',
    departmentId: 'dept-qc',
    shift: 'Morning',
    site: 'Site A',
    status: 'active',
    assignedPathwayIds: ['path-safety', 'path-qc'],
    completedModuleIds: ['mod-site-orientation', 'mod-ppe-safety'],
    completedLessonIds: ['les-welcome', 'les-ppe-entering', 'les-understand-workstation'],
    competencyStatus: 'in_progress',
    safetyAcknowledgementStatus: 'partial',
    lastActivityAt: new Date(Date.now() - 86400000).toISOString(),
    progressPercent: 60,
    syncStatus: 'local',
    createdAt: _now,
    updatedAt: _now,
    isDemo: true,
    _dashboardId: 'P002'
  },
  {
    id: 'emp-morgan',
    displayName: 'Morgan Lewis',
    employeeNumber: 'EMP-003',
    roleTitle: 'New Starter',
    departmentId: 'dept-safety',
    shift: 'Afternoon',
    site: 'Site A',
    status: 'active',
    assignedPathwayIds: ['path-induction'],
    completedModuleIds: [],
    completedLessonIds: ['les-welcome'],
    competencyStatus: 'not_started',
    safetyAcknowledgementStatus: 'pending',
    lastActivityAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    progressPercent: 10,
    syncStatus: 'local',
    createdAt: _now,
    updatedAt: _now,
    isDemo: true,
    _dashboardId: 'P004'
  },
  {
    id: 'emp-riley',
    displayName: 'Riley Evans',
    employeeNumber: 'EMP-004',
    roleTitle: 'Logistics Trainee',
    departmentId: 'dept-logistics',
    shift: 'Morning',
    site: 'Site A',
    status: 'active',
    assignedPathwayIds: ['path-induction'],
    completedModuleIds: ['mod-site-orientation', 'mod-ppe-safety', 'mod-workstation-readiness'],
    completedLessonIds: ['les-welcome', 'les-understand-workstation', 'les-ppe-entering'],
    competencyStatus: 'in_progress',
    safetyAcknowledgementStatus: 'complete',
    lastActivityAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    progressPercent: 80,
    syncStatus: 'local',
    createdAt: _now,
    updatedAt: _now,
    isDemo: true,
    _dashboardId: 'P005'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 14: DEMO DATA — TRAINERS / SUPERVISORS
// ─────────────────────────────────────────────────────────────────────────────

export const DEMO_TRAINERS = [
  {
    id: 'trainer-reyes',
    displayName: 'Dr. Reyes',
    roleTitle: 'Training Manager',
    departmentId: 'dept-assembly',
    permissions: {
      canApproveCompetency: true,
      canCreatePathway: true,
      canViewAnalytics: true
    },
    assignedEmployeeIds: ['emp-jamie', 'emp-aisha', 'emp-morgan', 'emp-riley'],
    reviewQueueIds: [],
    createdAt: _now,
    updatedAt: _now,
    isDemo: true
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 15: DEMO DATA — PROGRESS RECORDS
// ─────────────────────────────────────────────────────────────────────────────

export const DEMO_PROGRESS_RECORDS = [
  // Jamie Carter
  {
    id: 'prog-jamie-site-orientation',
    employeeId: 'emp-jamie',
    pathwayId: 'path-induction',
    moduleId: 'mod-site-orientation',
    lessonId: 'les-welcome',
    status: 'completed',
    progressPercent: 100,
    score: null,
    timeSpentMinutes: 12,
    completedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    lastUpdatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    source: 'demo',
    syncStatus: 'local',
    isDemo: true
  },
  {
    id: 'prog-jamie-workstation',
    employeeId: 'emp-jamie',
    pathwayId: 'path-induction',
    moduleId: 'mod-workstation-readiness',
    lessonId: 'les-understand-workstation',
    status: 'completed',
    progressPercent: 100,
    score: 85,
    timeSpentMinutes: 18,
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    lastUpdatedAt: new Date(Date.now() - 86400000).toISOString(),
    source: 'demo',
    syncStatus: 'local',
    isDemo: true
  },
  // Aisha Patel
  {
    id: 'prog-aisha-ppe',
    employeeId: 'emp-aisha',
    pathwayId: 'path-safety',
    moduleId: 'mod-ppe-safety',
    lessonId: 'les-ppe-entering',
    status: 'completed',
    progressPercent: 100,
    score: 100,
    timeSpentMinutes: 22,
    completedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    lastUpdatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    source: 'demo',
    syncStatus: 'local',
    isDemo: true
  },
  // Morgan Lewis
  {
    id: 'prog-morgan-welcome',
    employeeId: 'emp-morgan',
    pathwayId: 'path-induction',
    moduleId: 'mod-site-orientation',
    lessonId: 'les-welcome',
    status: 'completed',
    progressPercent: 100,
    score: null,
    timeSpentMinutes: 10,
    completedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    lastUpdatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    source: 'demo',
    syncStatus: 'local',
    isDemo: true
  },
  // Riley Evans
  {
    id: 'prog-riley-induction-complete',
    employeeId: 'emp-riley',
    pathwayId: 'path-induction',
    moduleId: 'mod-site-orientation',
    lessonId: 'les-welcome',
    status: 'completed',
    progressPercent: 100,
    score: null,
    timeSpentMinutes: 11,
    completedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    lastUpdatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    source: 'demo',
    syncStatus: 'local',
    isDemo: true
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 16: DEMO DATA — SUPERVISOR REVIEWS
// ─────────────────────────────────────────────────────────────────────────────

export const DEMO_SUPERVISOR_REVIEWS = [
  {
    id: 'rev-riley-ppe',
    employeeId: 'emp-riley',
    supervisorId: 'trainer-reyes',
    pathwayId: 'path-safety',
    moduleId: 'mod-ppe-safety',
    competencyId: 'comp-ppe-readiness',
    status: 'approved',
    notes: 'Riley demonstrated correct PPE procedure on first attempt. Signed off.',
    reviewedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    evidenceRecordIds: ['ev-riley-ppe-observation'],
    isDemo: true
  },
  {
    id: 'rev-jamie-pending',
    employeeId: 'emp-jamie',
    supervisorId: 'trainer-reyes',
    pathwayId: 'path-assembly',
    moduleId: 'mod-assembly-overview',
    competencyId: 'comp-assembly-awareness',
    status: 'pending',
    notes: '',
    reviewedAt: null,
    evidenceRecordIds: [],
    isDemo: true
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 17: DEMO DATA — EVIDENCE RECORDS
// ─────────────────────────────────────────────────────────────────────────────

export const DEMO_EVIDENCE_RECORDS = [
  {
    id: 'ev-riley-ppe-observation',
    employeeId: 'emp-riley',
    pathwayId: 'path-safety',
    moduleId: 'mod-ppe-safety',
    lessonId: 'les-ppe-entering',
    type: 'supervisor-note',
    title: 'PPE Observation — Riley Evans',
    description: 'Observed correct donning of all required PPE including safety glasses, gloves, and steel-capped boots. Passed on first attempt.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    source: 'dashboard',
    syncStatus: 'local',
    isDemo: true
  },
  {
    id: 'ev-aisha-quiz-qc',
    employeeId: 'emp-aisha',
    pathwayId: 'path-qc',
    moduleId: 'mod-qc-checks',
    lessonId: 'les-recognise-quality',
    type: 'quiz-result',
    title: 'Quality Recognition Quiz — Aisha Patel',
    description: 'Score: 100%. All defect recognition questions answered correctly.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    source: 'employee-pwa',
    syncStatus: 'local',
    isDemo: true
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 18: DEMO DATA — DASHBOARD ALERTS
// ─────────────────────────────────────────────────────────────────────────────

export const DEMO_DASHBOARD_ALERTS = [
  {
    id: 'alert-morgan-overdue',
    type: 'overdue-training',
    title: 'Overdue training — Morgan Lewis',
    message: 'Morgan Lewis has not completed the PPE and Safety Basics module. Induction is 5 days overdue.',
    severity: 'warning',
    linkedEmployeeId: 'emp-morgan',
    linkedPathwayId: 'path-induction',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    resolved: false,
    isDemo: true
  },
  {
    id: 'alert-morgan-safety-ack',
    type: 'safety-ack-missing',
    title: 'Safety acknowledgement missing — Morgan Lewis',
    message: 'PPE acknowledgement has not been completed. Employee cannot enter production area until this is resolved.',
    severity: 'critical',
    linkedEmployeeId: 'emp-morgan',
    linkedPathwayId: 'path-safety',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    resolved: false,
    isDemo: true
  },
  {
    id: 'alert-jamie-review',
    type: 'review-required',
    title: 'Supervisor review required — Jamie Carter',
    message: 'Jamie Carter has completed the Assembly Process Overview module and is awaiting supervisor sign-off.',
    severity: 'info',
    linkedEmployeeId: 'emp-jamie',
    linkedPathwayId: 'path-assembly',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    resolved: false,
    isDemo: true
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 19: FULL DEMO DATA BUNDLE (all entities in one object)
// ─────────────────────────────────────────────────────────────────────────────

export const DEMO_MANUFACTURING_DATA = {
  employees:          DEMO_EMPLOYEES,
  trainers:           DEMO_TRAINERS,
  departments:        DEMO_DEPARTMENTS,
  stations:           DEMO_STATIONS,
  pathways:           DEMO_PATHWAYS,
  processModules:     DEMO_MODULES,
  processLessons:     DEMO_LESSONS,
  skillCheckpoints:   DEMO_CHECKPOINTS,
  competencies:       DEMO_COMPETENCIES,
  safetyAcks:         DEMO_SAFETY_ACKS,
  progressRecords:    DEMO_PROGRESS_RECORDS,
  supervisorReviews:  DEMO_SUPERVISOR_REVIEWS,
  evidenceRecords:    DEMO_EVIDENCE_RECORDS,
  dashboardAlerts:    DEMO_DASHBOARD_ALERTS
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 20: SEED + RESET HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * getDemoManufacturingData()
 * Returns a deep copy of the full demo dataset. Safe to mutate.
 */
export function getDemoManufacturingData() {
  return JSON.parse(JSON.stringify(DEMO_MANUFACTURING_DATA));
}

/**
 * seedDemoManufacturingData()
 * Writes all demo entities to localStorage if not already seeded.
 * Idempotent — safe to call on every boot.
 */
export function seedDemoManufacturingData() {
  if (dmGet(DM_KEYS.DM_SEEDED)) return;

  const data = getDemoManufacturingData();
  dmSet(DM_KEYS.EMPLOYEES,          data.employees);
  dmSet(DM_KEYS.TRAINERS,           data.trainers);
  dmSet(DM_KEYS.DEPARTMENTS,        data.departments);
  dmSet(DM_KEYS.STATIONS,           data.stations);
  dmSet(DM_KEYS.PATHWAYS,           data.pathways);
  dmSet(DM_KEYS.PROCESS_MODULES,    data.processModules);
  dmSet(DM_KEYS.PROCESS_LESSONS,    data.processLessons);
  dmSet(DM_KEYS.SKILL_CHECKPOINTS,  data.skillCheckpoints);
  dmSet(DM_KEYS.COMPETENCIES,       data.competencies);
  dmSet(DM_KEYS.SAFETY_ACKS,        data.safetyAcks);
  dmSet(DM_KEYS.PROGRESS_RECORDS,   data.progressRecords);
  dmSet(DM_KEYS.SUPERVISOR_REVIEWS, data.supervisorReviews);
  dmSet(DM_KEYS.EVIDENCE_RECORDS,   data.evidenceRecords);
  dmSet(DM_KEYS.DASHBOARD_ALERTS,   data.dashboardAlerts);
  dmSet(DM_KEYS.DATA_MODE,          'demo');
  dmSet(DM_KEYS.BACKEND_CONFIG,     BACKEND_CONFIG_DEFAULTS);
  dmSet(DM_KEYS.DM_SEEDED,          true);

  console.log('[AutoSkill OS] Demo manufacturing data seeded.');
}

/**
 * resetDemoManufacturingData()
 * Clears and re-seeds all demo entities.
 * Use when demo mode is re-enabled or data is stale.
 */
export function resetDemoManufacturingData() {
  dmSet(DM_KEYS.DM_SEEDED, false);
  seedDemoManufacturingData();
  console.log('[AutoSkill OS] Demo manufacturing data reset.');
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 21: ENTITY READ HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export function getEmployees()        { return dmGet(DM_KEYS.EMPLOYEES, []); }
export function getTrainers()         { return dmGet(DM_KEYS.TRAINERS, []); }
export function getDepartments()      { return dmGet(DM_KEYS.DEPARTMENTS, []); }
export function getStations()         { return dmGet(DM_KEYS.STATIONS, []); }
export function getTrainingPathways() { return dmGet(DM_KEYS.PATHWAYS, []); }
export function getProcessModules()   { return dmGet(DM_KEYS.PROCESS_MODULES, []); }
export function getProcessLessons()   { return dmGet(DM_KEYS.PROCESS_LESSONS, []); }
export function getSkillCheckpoints() { return dmGet(DM_KEYS.SKILL_CHECKPOINTS, []); }
export function getCompetencies()     { return dmGet(DM_KEYS.COMPETENCIES, []); }
export function getSafetyAcks()       { return dmGet(DM_KEYS.SAFETY_ACKS, []); }
export function getProgressRecords()  { return dmGet(DM_KEYS.PROGRESS_RECORDS, []); }
export function getSupervisorReviews(){ return dmGet(DM_KEYS.SUPERVISOR_REVIEWS, []); }
export function getEvidenceRecords()  { return dmGet(DM_KEYS.EVIDENCE_RECORDS, []); }
export function getDashboardAlerts()  { return dmGet(DM_KEYS.DASHBOARD_ALERTS, []); }

/**
 * getEmployeeProgress(employeeId)
 * Returns all progress records for a specific employee.
 */
export function getEmployeeProgress(employeeId) {
  return getProgressRecords().filter(r => r.employeeId === employeeId);
}

/**
 * getPwaAssignedPathway(employeeId)
 * Returns the first active assigned pathway for the employee.
 * Used by the PWA to determine what to show the learner.
 */
export function getPwaAssignedPathway(employeeId) {
  const employee = getEmployees().find(e => e.id === employeeId);
  if (!employee || !employee.assignedPathwayIds?.length) return null;
  const pathways = getTrainingPathways();
  return pathways.find(p => p.id === employee.assignedPathwayIds[0]) || null;
}

/**
 * getDashboardTrainingStats()
 * Returns summary stats for the dashboard overview.
 */
export function getDashboardTrainingStats() {
  const employees  = getEmployees();
  const progress   = getProgressRecords();
  const alerts     = getDashboardAlerts().filter(a => !a.resolved);
  const reviews    = getSupervisorReviews().filter(r => r.status === 'pending');

  const activeEmployees    = employees.filter(e => e.status === 'active').length;
  const completedModules   = progress.filter(r => r.status === 'completed').length;
  const needsReview        = reviews.length;
  const criticalAlerts     = alerts.filter(a => a.severity === 'critical').length;
  const avgProgress        = employees.length
    ? Math.round(employees.reduce((sum, e) => sum + (e.progressPercent || 0), 0) / employees.length)
    : 0;

  return {
    activeEmployees,
    completedModules,
    needsReview,
    criticalAlerts,
    avgProgress,
    totalAlerts: alerts.length
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 22: ENTITY WRITE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * createProgressRecord(payload)
 * Creates and persists a new progress record.
 */
export function createProgressRecord(payload) {
  const record = {
    id:               'prog_' + Date.now(),
    employeeId:       payload.employeeId       || null,
    pathwayId:        payload.pathwayId        || null,
    moduleId:         payload.moduleId         || null,
    lessonId:         payload.lessonId         || null,
    status:           payload.status           || 'in_progress',
    progressPercent:  payload.progressPercent  || 0,
    score:            payload.score            ?? null,
    timeSpentMinutes: payload.timeSpentMinutes || 0,
    completedAt:      payload.completedAt      || null,
    lastUpdatedAt:    _ts(),
    source:           payload.source           || 'employee-pwa',
    syncStatus:       'local',
    isDemo:           payload.isDemo           || false
  };

  dmUpdate(DM_KEYS.PROGRESS_RECORDS, records => {
    const list = records || [];
    list.push(record);
    return list;
  });

  return record;
}

/**
 * queuePwaProgressUpdate(payload)
 * Adds a structured sync item to the PWA sync queue.
 * Compatible with existing tlEnqueueSync() — does NOT replace it.
 * Used for structured manufacturing entity sync in later runs.
 */
export function queuePwaProgressUpdate(payload) {
  const item = {
    id:           'sync_' + Date.now(),
    type:         payload.type || 'progress_update',
    employeeId:   payload.employeeId  || null,
    entityType:   payload.entityType  || 'progressRecord',
    entityId:     payload.entityId    || null,
    data:         payload.data        || {},
    queuedAt:     _ts(),
    syncStatus:   'queued',
    attempts:     0,
    isDemo:       payload.isDemo      || false
  };

  dmUpdate(DM_KEYS.PWA_SYNC_QUEUE, queue => {
    const q = queue || [];
    q.push(item);
    return q;
  });

  return item;
}

/**
 * createSupervisorReview(payload)
 * Creates a new supervisor review record.
 */
export function createSupervisorReview(payload) {
  const review = {
    id:                'rev_' + Date.now(),
    employeeId:        payload.employeeId   || null,
    supervisorId:      payload.supervisorId || null,
    pathwayId:         payload.pathwayId    || null,
    moduleId:          payload.moduleId     || null,
    competencyId:      payload.competencyId || null,
    status:            'pending',
    notes:             payload.notes        || '',
    reviewedAt:        null,
    evidenceRecordIds: [],
    isDemo:            payload.isDemo       || false
  };

  dmUpdate(DM_KEYS.SUPERVISOR_REVIEWS, reviews => {
    const list = reviews || [];
    list.push(review);
    return list;
  });

  return review;
}

/**
 * createDashboardAlert(payload)
 * Creates and persists a new dashboard alert.
 */
export function createDashboardAlert(payload) {
  const alert = {
    id:               'alert_' + Date.now(),
    type:             payload.type             || 'info',
    title:            payload.title            || '',
    message:          payload.message          || '',
    severity:         payload.severity         || 'info',
    linkedEmployeeId: payload.linkedEmployeeId || null,
    linkedPathwayId:  payload.linkedPathwayId  || null,
    createdAt:        _ts(),
    resolved:         false,
    isDemo:           payload.isDemo           || false
  };

  dmUpdate(DM_KEYS.DASHBOARD_ALERTS, alerts => {
    const list = alerts || [];
    list.push(alert);
    return list;
  });

  return alert;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 23: PWA EVENT RECORD GENERATORS
// These generate the structured local records the PWA saves
// when a learner interacts with training. Full sync wired in Run 7.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * PWA_EVENTS
 * Canonical event type names for PWA-generated records.
 */
export const PWA_EVENTS = {
  LESSON_STARTED:           'lesson_started',
  LESSON_COMPLETED:         'lesson_completed',
  CHECKPOINT_ANSWERED:      'checkpoint_answered',
  SAFETY_ACK_COMPLETED:     'safety_ack_completed',
  CHECK_IN_SUBMITTED:       'check_in_submitted',
  TRAINING_NOTE_SAVED:      'training_note_saved',
  EVIDENCE_CREATED:         'evidence_created',
  SYNC_QUEUED:              'sync_queued'
};

/**
 * recordLessonStarted({ employeeId, lessonId, moduleId, pathwayId })
 */
export function recordLessonStarted(payload) {
  return createProgressRecord({
    ...payload,
    status: 'in_progress',
    progressPercent: 0,
    source: 'employee-pwa'
  });
}

/**
 * recordLessonCompleted({ employeeId, lessonId, moduleId, pathwayId, score, timeSpentMinutes })
 */
export function recordLessonCompleted(payload) {
  const record = createProgressRecord({
    ...payload,
    status: 'completed',
    progressPercent: 100,
    completedAt: _ts(),
    source: 'employee-pwa'
  });
  queuePwaProgressUpdate({
    type: PWA_EVENTS.LESSON_COMPLETED,
    employeeId: payload.employeeId,
    entityType: 'progressRecord',
    entityId: record.id,
    data: record,
    isDemo: payload.isDemo || false
  });
  return record;
}

/**
 * recordSafetyAckCompleted({ employeeId, ackId })
 * Updates the safety acknowledgement to add the employee to acknowledgedByEmployeeIds.
 */
export function recordSafetyAckCompleted({ employeeId, ackId, isDemo = false }) {
  const acks = getSafetyAcks();
  const updated = acks.map(a => {
    if (a.id !== ackId) return a;
    const ids = a.acknowledgedByEmployeeIds || [];
    if (!ids.includes(employeeId)) ids.push(employeeId);
    return { ...a, acknowledgedByEmployeeIds: ids };
  });
  dmSet(DM_KEYS.SAFETY_ACKS, updated);
  queuePwaProgressUpdate({
    type: PWA_EVENTS.SAFETY_ACK_COMPLETED,
    employeeId,
    entityType: 'safetyAcknowledgement',
    entityId: ackId,
    data: { employeeId, ackId, acknowledgedAt: _ts() },
    isDemo
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 24: COMPATIBILITY BRIDGE — Legacy key aliases
// The existing dashboard and PWA use internal keys like 'patients', 'patient'.
// These helpers provide the bridge so the data model is visible
// without requiring a full rename of the dashboard internals.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * getLegacyPatients()
 * Returns employees in the shape expected by the existing dashboard PATIENTS array.
 * Maps: employees → DEMO_PATIENTS-compatible objects.
 * UI still shows 'Employees' — this is an internal data bridge only.
 */
export function getLegacyPatients() {
  return getEmployees().map(emp => ({
    id:         emp._dashboardId || emp.id,
    _empId:     emp.id,
    name:       emp.displayName,
    condition:  emp.roleTitle,
    status:     emp.status,
    pathwayPct: emp.progressPercent,
    pathway:    emp.assignedPathwayIds[0] || '',
    isDemo:     emp.isDemo
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 25: BOOT INIT
// Call once on app load. Seeds data if not already present.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * initAutoSkillOS()
 * Boot initialiser. Safe to call multiple times — idempotent.
 * Call from dashboard and PWA entry points.
 */
export function initAutoSkillOS() {
  seedDemoManufacturingData();
  console.log('[AutoSkill OS™] Data model initialised. Mode:', getDataMode());
}
