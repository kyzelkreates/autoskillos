/* AutoSkill OS™ — Employee Learning PWA App
   Standalone installable PWA version (ap3x/patient-pwa/index.html) — Employee Learning PWA
   All data via localStorage SSOT — no backend required
   Created by Kyzel Kreates™ · Powered by 4P3X Intelligent AI™     */
'use strict';

// ── Sync Queue (backend-ready local-first) ───────────────────────
const TL_SYNC_QUEUE_KEY = 'ap3x_sync_queue';
function tlEnqueueSync(eventType, data) {
  try {
    const q = JSON.parse(localStorage.getItem(TL_SYNC_QUEUE_KEY) || '[]');
    q.push({ id: Date.now() + '_' + Math.random().toString(36).slice(2), type: eventType, data, queued_at: new Date().toISOString(), status: 'pending', source: 'patient_pwa' });
    localStorage.setItem(TL_SYNC_QUEUE_KEY, JSON.stringify(q));
  } catch(e) { /* preserve data first, sync secondary */ }
}
function tlGetPendingCount() {
  try { return JSON.parse(localStorage.getItem(TL_SYNC_QUEUE_KEY) || '[]').length; } catch { return 0; }
}

// ── Storage helpers ───────────────────────────────────────────────
function sGet(k, d) { try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : d; } catch { return d; } }
function sSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

// ── AutoSkill OS™ Run 2: Manufacturing Data Model Boot (PWA) ─────────────────
// Seeds manufacturing training data model into localStorage on first load.
// Does NOT overwrite existing ap3x_* keys. Idempotent — safe to call repeatedly.
// Full module reads: Run 4. Sync wiring: Run 7.
(function bootAutoSkillOSDM() {
  'use strict';
  try {
    var SEEDED = 'ap3x_dm_seeded_v5';
    if (!localStorage.getItem(SEEDED)) {
      localStorage.setItem(SEEDED, JSON.stringify(true));

      // ── Data mode ─────────────────────────────────────────────
      if (!localStorage.getItem('ap3x_dm_data_mode')) {
        var _existingDemo = localStorage.getItem('4p3x_demo_mode');
        var _mode = (_existingDemo === null || JSON.parse(_existingDemo)) ? 'demo' : 'local';
        localStorage.setItem('ap3x_dm_data_mode', JSON.stringify(_mode));
      }

      // ── Backend config (no secrets) ────────────────────────────
      if (!localStorage.getItem('ap3x_dm_backend_config')) {
        localStorage.setItem('ap3x_dm_backend_config', JSON.stringify({
          mode: 'demo', provider: 'local-only',
          connectionStatus: 'not_configured',
          publicConfig: { projectUrl: '', anonKeyHint: '', region: '' },
          maskedStatus: '', lastTestedAt: null, updatedAt: null
        }));
      }

      // ── Run 5: Seed safety acknowledgements ─────────────────────
      if (!localStorage.getItem('ap3x_dm_safety_acks')) {
        var _now = new Date().toISOString();
        localStorage.setItem('ap3x_dm_safety_acks', JSON.stringify([
          { id:'ack-ppe', title:'PPE Readiness', legalCritical:true, safetyCritical:true,
            description:'I understand that PPE requirements must be checked before entering a production or training area.',
            acknowledgementText:'I confirm I have read and understood the PPE requirements and will not start work without required PPE in place.',
            linkedLessonId:'les-r5-2-1', linkedModuleId:'mod-r5-ppe-safety',
            requiredForCompletion:true, acknowledgedByEmployeeIds:[], createdAt:_now, isDemo:true },
          { id:'ack-ask-supervisor', title:'Stop-and-Ask Rule', legalCritical:false, safetyCritical:true,
            description:'I understand that I must stop and ask a supervisor when a task, tool, process, or safety instruction is unclear.',
            acknowledgementText:'I confirm I will stop any task and ask my supervisor if I am uncertain about a procedure, safety requirement, tool, or process step.',
            linkedLessonId:'les-r5-2-2', linkedModuleId:'mod-r5-ppe-safety',
            requiredForCompletion:true, acknowledgedByEmployeeIds:[], createdAt:_now, isDemo:true },
          { id:'ack-workstation', title:'Workstation Readiness', legalCritical:false, safetyCritical:true,
            description:'I understand that workstation readiness must be checked before starting a process step.',
            acknowledgementText:'I confirm I will complete a workstation readiness check before starting any process step.',
            linkedLessonId:'les-r5-3-2', linkedModuleId:'mod-r5-workstation-readiness',
            requiredForCompletion:true, acknowledgedByEmployeeIds:[], createdAt:_now, isDemo:true },
          { id:'ack-tool-auth', title:'Authorised Tool Use', legalCritical:false, safetyCritical:true,
            description:'I understand that I must only use tools and equipment I am trained and authorised to use.',
            acknowledgementText:'I confirm I will only use tools and equipment I am trained and authorised to use.',
            linkedLessonId:'les-r5-5-1', linkedModuleId:'mod-r5-tool-handling',
            requiredForCompletion:true, acknowledgedByEmployeeIds:[], createdAt:_now, isDemo:true },
          { id:'ack-defect-reporting', title:'Defect Reporting', legalCritical:true, safetyCritical:false,
            description:'I understand that defects and process issues must be reported honestly through the correct workplace route.',
            acknowledgementText:'I confirm I understand the correct procedure for reporting a product defect and that I must not hide or conceal defects.',
            linkedLessonId:'les-r5-7-1', linkedModuleId:'mod-r5-defect-handover',
            requiredForCompletion:true, acknowledgedByEmployeeIds:[], createdAt:_now, isDemo:true },
          { id:'ack-final-responsibility', title:'Final Pathway Responsibility Boundary', legalCritical:true, safetyCritical:false,
            description:'I understand that completing this pathway supports training awareness but does not replace workplace safety procedures or employer responsibility.',
            acknowledgementText:'I confirm that completing this AutoSkill OS™ pathway supports training awareness and may support supervisor review, but does not replace workplace safety procedures, qualified supervision, employer responsibility, or legal duties.',
            linkedLessonId:'les-r5-8-2', linkedModuleId:'mod-r5-supervisor-review',
            requiredForCompletion:true, acknowledgedByEmployeeIds:[], createdAt:_now, isDemo:true }
        ]));
      }

      // ── Run 5: Seed pathways ────────────────────────────────────
      if (!localStorage.getItem('ap3x_dm_pathways')) {
        localStorage.setItem('ap3x_dm_pathways', JSON.stringify([
          { id:'path-ns-induction', title:'New Starter Automotive Manufacturing Induction',
            description:'A structured local-first training pathway covering PPE, workstation readiness, assembly workflow, quality checks, defect reporting, and supervisor review.',
            departmentId:'dept-assembly', safetyCritical:true, status:'active',
            requiredForRoles:['New Starter','Assembly Trainee','Quality Control Trainee','Logistics Trainee'],
            estimatedDuration:'6–8 hours',
            moduleIds:['mod-r5-site-orientation','mod-r5-ppe-safety','mod-r5-workstation-readiness',
                       'mod-r5-assembly-overview','mod-r5-tool-handling','mod-r5-qc-defects',
                       'mod-r5-defect-handover','mod-r5-supervisor-review'],
            safetyAcknowledgementIds:['ack-ppe','ack-ask-supervisor','ack-workstation','ack-tool-auth','ack-defect-reporting','ack-final-responsibility'],
            isDemo:true }
        ]));
      }

      // ── Run 5: Seed process modules ─────────────────────────────
      if (!localStorage.getItem('ap3x_dm_process_modules')) {
        var _mods = [
          { id:'mod-r5-site-orientation', pathwayId:'path-ns-induction', order:1, safetyCritical:false,
            title:'Module 1: Manufacturing Site Orientation', estimatedDuration:'45 minutes', completionRequired:true, isDemo:true },
          { id:'mod-r5-ppe-safety', pathwayId:'path-ns-induction', order:2, safetyCritical:true,
            title:'Module 2: Health, Safety and PPE Basics', estimatedDuration:'60 minutes', completionRequired:true, isDemo:true },
          { id:'mod-r5-workstation-readiness', pathwayId:'path-ns-induction', order:3, safetyCritical:true,
            title:'Module 3: Workstation Readiness', estimatedDuration:'45 minutes', completionRequired:true, isDemo:true },
          { id:'mod-r5-assembly-overview', pathwayId:'path-ns-induction', order:4, safetyCritical:false,
            title:'Module 4: Assembly Line Process Overview', estimatedDuration:'60 minutes', completionRequired:true, isDemo:true },
          { id:'mod-r5-tool-handling', pathwayId:'path-ns-induction', order:5, safetyCritical:true,
            title:'Module 5: Safe Tool Handling and Equipment Awareness', estimatedDuration:'45 minutes', completionRequired:true, isDemo:true },
          { id:'mod-r5-qc-defects', pathwayId:'path-ns-induction', order:6, safetyCritical:false,
            title:'Module 6: Quality Control and Defect Recognition', estimatedDuration:'60 minutes', completionRequired:true, isDemo:true },
          { id:'mod-r5-defect-handover', pathwayId:'path-ns-induction', order:7, safetyCritical:false,
            title:'Module 7: Defect Reporting and Production Handover', estimatedDuration:'45 minutes', completionRequired:true, isDemo:true },
          { id:'mod-r5-supervisor-review', pathwayId:'path-ns-induction', order:8, safetyCritical:false,
            title:'Module 8: Supervisor Review and Final Competency Check', estimatedDuration:'45 minutes', completionRequired:true, isDemo:true }
        ];
        localStorage.setItem('ap3x_dm_process_modules', JSON.stringify(_mods));
      }

      console.log('[AutoSkill OS™ PWA] Run 5: 8-module pathway seeded. 6 safety acks. 15 checkpoints embedded in LESSON_CONTENT.');
    }
  } catch(e) {
    console.warn('[AutoSkill OS™ PWA] DM boot warning:', e.message);
  }
})();

// ── PWA Manufacturing Progress Record Helpers (Run 2) ────────────────────────
// These supplement existing tlEnqueueSync() with structured entity records.
// They write to the ap3x_dm_* namespace so they do not clash with ap3x_* keys.
// Full entity reads and sync: Run 4 and Run 7.

/**
 * createPwaProgressRecord(payload)
 * Saves a structured progress record to ap3x_dm_progress_records.
 * Called after lesson complete, checkpoint pass, or safety ack.
 * Does NOT replace existing sSet('ap3x_lesson_progress', ...) calls.
 */
function createPwaProgressRecord(payload) {
  try {
    const KEY = 'ap3x_dm_progress_records';
    const records = JSON.parse(localStorage.getItem(KEY) || '[]');
    const record = {
      id:               'prog_pwa_' + Date.now(),
      employeeId:       payload.employeeId       || sGet('ap3x_patient_profile', {}).userId || null,
      pathwayId:        payload.pathwayId        || null,
      moduleId:         payload.moduleId         || null,
      lessonId:         payload.lessonId         || null,
      status:           payload.status           || 'completed',
      progressPercent:  payload.progressPercent  !== undefined ? payload.progressPercent : 100,
      score:            payload.score            !== undefined ? payload.score : null,
      timeSpentMinutes: payload.timeSpentMinutes || 0,
      completedAt:      payload.completedAt      || new Date().toISOString(),
      lastUpdatedAt:    new Date().toISOString(),
      source:           'employee-pwa',
      syncStatus:       'local',
      isDemo:           sGet('4p3x_demo_mode', true)
    };
    records.push(record);
    localStorage.setItem(KEY, JSON.stringify(records));
    // Queue for future sync (Run 7)
    queueDmSyncItem({
      type:       'lesson_completed',
      entityType: 'progressRecord',
      entityId:   record.id,
      data:       record
    });
    return record;
  } catch(e) {
    console.warn('[AutoSkill OS™ PWA] createPwaProgressRecord failed:', e.message);
    return null;
  }
}

/**
 * queueDmSyncItem(payload)
 * Adds a structured item to ap3x_dm_pwa_sync_queue.
 * Supplements existing ap3x_sync_queue. Full sync wiring in Run 7.
 */
// ════════════════════════════════════════════════════════════════
// Run 7: Local-First PWA Sync Queue
// Spec-compliant queue records — backend-ready payload shape.
// All writes go through createSyncQueueItem() / queueDmSyncItem().
// ════════════════════════════════════════════════════════════════

var AP3X_SYNC_QUEUE_KEY = 'ap3x_dm_pwa_sync_queue';

function createSyncQueueItem(opts) {
  // opts: eventType, source, target, employeeId, pathwayId, moduleId,
  //       lessonId, checkpointId, acknowledgementId, evidenceRecordId,
  //       supervisorReviewId, payload, priority, notes, isDemo
  var now      = new Date().toISOString();
  var demoOn   = sGet('4p3x_demo_mode', true);
  var emp      = (getPwaActiveEmployeeByMode ? getPwaActiveEmployeeByMode() : null) || {};
  var beCfg    = dmGet('ap3x_dm_backend_config', {});
  return {
    id:                   'sqr_' + Date.now() + '_' + Math.random().toString(36).slice(2,6),
    eventType:            opts.eventType            || 'unknown',
    source:               opts.source               || 'employee-pwa',
    target:               opts.target               || 'control-dashboard',
    employeeId:           opts.employeeId           || emp.id || null,
    pathwayId:            opts.pathwayId            || null,
    moduleId:             opts.moduleId             || null,
    lessonId:             opts.lessonId             || null,
    checkpointId:         opts.checkpointId         || null,
    acknowledgementId:    opts.acknowledgementId    || null,
    evidenceRecordId:     opts.evidenceRecordId     || null,
    supervisorReviewId:   opts.supervisorReviewId   || null,
    payload:              opts.payload              || {},
    status:               'queued',
    priority:             opts.priority             || 'normal',
    createdAt:            now,
    updatedAt:            now,
    processedAt:          null,
    retryCount:           0,
    errorMessage:         null,
    dataMode:             demoOn ? 'demo' : 'live',
    isDemo:               opts.isDemo !== undefined ? opts.isDemo : demoOn,
    localDeviceId:        'pwa_' + (navigator.userAgent.length % 999),
    remoteId:             null,
    provider:             (beCfg.provider || beCfg.mode || 'local-only'),
    notes:                opts.notes || null
  };
}

function queueDmSyncItem(payload) {
  // Backward-compat wrapper used by existing createPwaProgressRecord / acknowledgeLocalSafetyItem
  try {
    var item = createSyncQueueItem({
      eventType:  payload.type       || 'unknown',
      lessonId:   payload.data && payload.data.lessonId || null,
      payload:    payload.data       || {},
      priority:   payload.priority   || 'normal'
    });
    var queue = dmGet(AP3X_SYNC_QUEUE_KEY, []);
    queue.push(item);
    sSet(AP3X_SYNC_QUEUE_KEY, queue);
  } catch(e) { /* non-fatal */ }
}

function getPwaSyncQueue(filters) {
  var all = dmGet(AP3X_SYNC_QUEUE_KEY, []);
  if (!filters) return all;
  return all.filter(function(item) {
    if (filters.status    && item.status    !== filters.status)    return false;
    if (filters.isDemo    !== undefined && item.isDemo !== filters.isDemo) return false;
    if (filters.eventType && item.eventType !== filters.eventType) return false;
    if (filters.priority  && item.priority  !== filters.priority)  return false;
    return true;
  });
}

function getPwaSyncQueueStats() {
  var all   = dmGet(AP3X_SYNC_QUEUE_KEY, []);
  var stats = { total:0, queued:0, processed:0, failed:0, safetyCritical:0, demo:0, live:0 };
  all.forEach(function(item) {
    stats.total++;
    if (item.status === 'queued' || item.status === 'processing')  stats.queued++;
    if (item.status === 'synced') stats.processed++;
    if (item.status === 'failed' || item.status === 'conflict')    stats.failed++;
    if (item.priority === 'safety-critical') stats.safetyCritical++;
    if (item.isDemo)  stats.demo++;
    else              stats.live++;
  });
  return stats;
}

function updatePwaSyncItemStatus(itemId, status, meta) {
  try {
    var queue = dmGet(AP3X_SYNC_QUEUE_KEY, []);
    var updated = queue.map(function(item) {
      if (item.id !== itemId) return item;
      return Object.assign({}, item, {
        status:       status,
        updatedAt:    new Date().toISOString(),
        processedAt:  (status === 'synced' || status === 'failed' || status === 'ignored') ? new Date().toISOString() : item.processedAt,
        errorMessage: (meta && meta.errorMessage) || item.errorMessage,
        retryCount:   (meta && meta.retry) ? (item.retryCount||0) + 1 : item.retryCount,
        remoteId:     (meta && meta.remoteId)     || item.remoteId
      });
    });
    sSet(AP3X_SYNC_QUEUE_KEY, updated);
  } catch(e) {}
}

// ─────────────────────────────────────────────────────────────────
// PWA event queue helpers — called by PWA UI actions
// ─────────────────────────────────────────────────────────────────
function queueLessonStarted(lessonId) {
  try {
    var lc  = LESSON_CONTENT && LESSON_CONTENT[lessonId];
    var emp = getPwaActiveEmployeeByMode ? getPwaActiveEmployeeByMode() : null;
    var item = createSyncQueueItem({
      eventType: 'lesson_started',
      lessonId:  lessonId,
      moduleId:  lc && lc.moduleId || null,
      pathwayId: emp && emp.assignedPathwayIds && emp.assignedPathwayIds[0] || null,
      payload:   { lessonTitle: lc && lc.title || lessonId, startedAt: new Date().toISOString() },
      priority:  'normal'
    });
    var q = dmGet(AP3X_SYNC_QUEUE_KEY, []); q.push(item); sSet(AP3X_SYNC_QUEUE_KEY, q);
    // Run 11: attempt live write if live mode active
    if (typeof r11_syncPwaLessonStartedLive === 'function') {
      r11_syncPwaLessonStartedLive(item).catch(function(){});
    }
  } catch(e) {}
}

function queueLessonCompleted(lessonId, xpAwarded) {
  try {
    var lc  = LESSON_CONTENT && LESSON_CONTENT[lessonId];
    var emp = getPwaActiveEmployeeByMode ? getPwaActiveEmployeeByMode() : null;
    var sc  = lc && lc.checkpoint && lc.checkpoint.safetyCritical;
    var item = createSyncQueueItem({
      eventType: 'lesson_completed',
      lessonId:  lessonId,
      moduleId:  lc && lc.moduleId || null,
      pathwayId: emp && emp.assignedPathwayIds && emp.assignedPathwayIds[0] || null,
      payload:   {
        lessonTitle:   lc && lc.title || lessonId,
        completedAt:   new Date().toISOString(),
        xpAwarded:     xpAwarded || 0,
        moduleTitle:   lc && lc.moduleTitle || null
      },
      priority: sc ? 'safety-critical' : 'normal'
    });
    var q = dmGet(AP3X_SYNC_QUEUE_KEY, []); q.push(item); sSet(AP3X_SYNC_QUEUE_KEY, q);
    sSet('ap3x_last_queue_at', new Date().toISOString());
    // Run 11: attempt live write
    if (typeof r11_syncPwaLessonCompletedLive === 'function') {
      r11_syncPwaLessonCompletedLive(item).catch(function(){});
    }
  } catch(e) {}
}

function queueCheckpointSubmitted(lessonId, answer, isCorrect, checkpointId) {
  try {
    var lc  = LESSON_CONTENT && LESSON_CONTENT[lessonId];
    var chk = lc && lc.checkpoint;
    var sc  = chk && chk.passRequired;
    var item = createSyncQueueItem({
      eventType:    'checkpoint_submitted',
      lessonId:     lessonId,
      checkpointId: checkpointId || (chk && chk.id) || null,
      moduleId:     lc && lc.moduleId || null,
      payload:      {
        answer:       answer,
        isCorrect:    isCorrect,
        question:     chk && chk.question || null,
        answeredAt:   new Date().toISOString(),
        safetyCritical: sc || false
      },
      priority: sc ? 'safety-critical' : 'normal'
    });
    var q = dmGet(AP3X_SYNC_QUEUE_KEY, []); q.push(item); sSet(AP3X_SYNC_QUEUE_KEY, q);
    if (typeof r11_syncPwaCheckpointSubmittedLive === 'function') {
      r11_syncPwaCheckpointSubmittedLive(item).catch(function(){});
    }
  } catch(e) {}
}

function queueSafetyAcknowledged(ackId, ackTitle) {
  try {
    var emp = getPwaActiveEmployeeByMode ? getPwaActiveEmployeeByMode() : null;
    var item = createSyncQueueItem({
      eventType:         'safety_acknowledged',
      acknowledgementId: ackId,
      payload: {
        ackId:       ackId,
        ackTitle:    ackTitle || ackId,
        employeeId:  emp && emp.id || null,
        acknowledgedAt: new Date().toISOString()
      },
      priority: 'safety-critical'
    });
    var q = dmGet(AP3X_SYNC_QUEUE_KEY, []); q.push(item); sSet(AP3X_SYNC_QUEUE_KEY, q);
    if (typeof r11_syncPwaSafetyAcknowledgedLive === 'function') {
      r11_syncPwaSafetyAcknowledgedLive(item).catch(function(){});
    }
  } catch(e) {}
}

function queueSupervisorReviewRequested(pathwayId, moduleId, notes) {
  try {
    var emp = getPwaActiveEmployeeByMode ? getPwaActiveEmployeeByMode() : null;
    var item = createSyncQueueItem({
      eventType:  'supervisor_review_requested',
      pathwayId:  pathwayId || null,
      moduleId:   moduleId  || null,
      payload: {
        employeeId:  emp && emp.id || null,
        employeeName: emp && emp.displayName || 'Employee',
        pathwayId:   pathwayId,
        moduleId:    moduleId,
        requestedAt: new Date().toISOString(),
        notes:       notes || null
      },
      priority: 'high'
    });
    var q = dmGet(AP3X_SYNC_QUEUE_KEY, []); q.push(item); sSet(AP3X_SYNC_QUEUE_KEY, q);
    sSet('ap3x_last_queue_at', new Date().toISOString());
  } catch(e) {}
}


// ── Curriculum ────────────────────────────────────────────────────
const CURRICULUM = [
  { id: 1, name: 'Module 1 — Manufacturing Site Orientation', icon: '🌱', color: '#22c55e', lessons: [
    { id: 'm1l1', name: 'Understanding your workstation', desc: 'Learn your workstation layout, responsibilities, and daily readiness checks.', xp: 60 },
    { id: 'm1l2', name: 'Health, Safety and PPE Basics', desc: 'Essential PPE requirements and safety protocols before entering the production area.', xp: 60 },
    { id: 'm1l3', name: 'Assembly Line Process Overview', desc: 'Understanding the production flow, stages, and your role within the line.', xp: 70 },
    { id: 'm1l4', name: 'Workstation Readiness', desc: 'How to prepare your workstation correctly at the start of each shift.', xp: 70 },
    { id: 'm1l5', name: 'Tool Handling and Equipment Safety', desc: 'Safe handling procedures for tools and equipment at your workstation.', xp: 80 },
  ]},
  { id: 2, name: 'Module 2 — Quality Control and Process Standards', icon: '🎯', color: '#c9a84c', lessons: [
    { id: 'm2l1', name: 'Quality Control and Defect Reporting', desc: 'How to identify quality issues and report defects correctly.', xp: 70 },
    { id: 'm2l2', name: 'Production Workflow and Handover', desc: 'Understanding production flow, shift handover, and workflow documentation.', xp: 70 },
    { id: 'm2l3', name: 'Process Checkpoint Procedures', desc: 'How to complete process checkpoints and verify your work at each stage.', xp: 80 },
    { id: 'm2l4', name: 'Workstation Safety Checks', desc: 'Daily safety checks required before and during your shift.', xp: 70 },
    { id: 'm2l5', name: 'Supervisor Sign-Off and Sign-On', desc: 'Understanding the supervisor sign-off process for completed tasks.', xp: 90 },
  ]},
  { id: 3, name: 'Module 3 — Competency Assessment and Development', icon: '🌍', color: '#a855f7', lessons: [
    { id: 'm3l1', name: 'Reviewing Your Training Progress', desc: 'How to review your competency progress and identify areas for growth.', xp: 80 },
    { id: 'm3l2', name: 'Recognising Process Errors Early', desc: 'How to spot and respond to process errors before they escalate.', xp: 80 },
    { id: 'm3l3', name: 'Strengthening Core Process Skills', desc: 'Reviewing and deepening the process skills that are most critical for your role.', xp: 80 },
    { id: 'm3l4', name: 'Preparing for Supervisor Check-In', desc: 'Getting the most from your supervisor check-in with notes and progress evidence.', xp: 80 },
    { id: 'm3l5', name: 'Final Competency Check', desc: 'Pulling everything together into your personal competency record and development plan.', xp: 100 },
  ]},
];

const LESSON_CONTENT = {

  m1l1: {
    id: 'm1l1',
    moduleId: 1,
    lessonNumber: 1,
    moduleTitle: 'Module 1 — Manufacturing Site Orientation',
    title: 'Welcome to AutoSkill OS™',
    estimatedTime: '8–10 minutes',
    summary: 'Welcome to AutoSkill OS™. This pathway introduces the process-learning structure used in an automotive/manufacturing environment. You will move through lessons, safety checks, process steps, and supervisor-review points. Progress is saved locally first and can be connected to a backend in live mode.',
    learningGoals: ['Understand the purpose and structure of AutoSkill OS™.', 'Know how to complete each lesson, checkpoint, and safety acknowledgement.', 'Understand how your progress is saved and what it is used for.', 'Know when to ask a supervisor during training.'],
    sections: [{  heading: 'What this app does', body: 'AutoSkill OS™ is a manufacturing training support tool. It helps employees complete structured process learning, record safety acknowledgements, and prepare evidence for supervisor review. It does not replace your supervisor, employer procedures, or site-specific safety training.' }, {  heading: 'How the pathway works', body: 'Your training is organised into modules and lessons. Each module covers a specific part of manufacturing such as PPE, workstation readiness, assembly, or quality control. Some lessons include a checkpoint question or a safety acknowledgement.' }, {  heading: 'Completing lessons', body: 'Read each lesson carefully. Complete the checkpoint if one is shown. Acknowledge any safety items when prompted. Press the complete button to record your progress locally. Your progress updates immediately.' }, {  heading: 'When to ask a supervisor', body: 'If any instruction is unclear, stop and ask a supervisor before continuing. This app supports awareness but does not replace qualified supervision or site-specific safety procedures.' }, {  heading: 'Demo vs Live mode', body: 'In Demo Mode, you explore the full training pathway using sample content. In Live Mode, your employer can configure live training data and connect to a backend. Progress is saved locally first in both modes.' }],
    reflectionPrompt: 'What does completing this training pathway mean for your role? Write a short note about why training consistency matters at your workstation.',
    patientExercise: 'Before your next shift, identify one aspect of your workstation setup you want to understand better. Write it down and ask your supervisor if you need clarification.',
    safetyNote: 'AutoSkill OS™ supports training awareness and evidence capture. It does not replace workplace safety procedures, legal duties, qualified supervision, or employer responsibility. For on-site emergencies, follow your site emergency procedure immediately.',
    completionLabel: 'I understand what AutoSkill OS™ is for and how to use it',
    checkpoint: {
      question: 'What is the purpose of AutoSkill OS™?',
      type: 'multipleChoice',
      options: ['To replace workplace supervision', 'To support training, progress tracking, safety awareness, and supervisor review', 'To guarantee legal compliance', 'To operate machinery automatically'],
      correctAnswer: 'To support training, progress tracking, safety awareness, and supervisor review',
      safetyCritical: false,
      feedbackText: 'Correct. AutoSkill OS™ supports training and progress tracking. It does not replace supervision or guarantee compliance.',
    },
  },

  m1l2: {
    id: 'm1l2',
    moduleId: 1,
    lessonNumber: 2,
    moduleTitle: 'Module 1 — Manufacturing Site Orientation',
    title: 'Understanding Your Training Pathway',
    estimatedTime: '8–10 minutes',
    summary: 'Your training pathway is a structured sequence of modules and lessons. Each module focuses on a specific part of the manufacturing process. Some lessons include checkpoints or safety acknowledgements that confirm you have understood the training and know when supervisor support is required.',
    learningGoals: ['Understand the structure of a training pathway.', 'Know the difference between a module, a lesson, and a checkpoint.', 'Understand when a safety acknowledgement is required.', 'Know how supervisor review fits into the pathway.'],
    sections: [{  heading: 'Pathway, module, lesson', body: 'A pathway contains modules. A module contains lessons. A lesson may include a checkpoint or a safety acknowledgement. Completing lessons in a module contributes to module progress. Completing all modules contributes to pathway progress.' }, {  heading: 'Checkpoints', body: 'A checkpoint is a short question that confirms you have understood the lesson content. Checkpoints are not a formal qualification. They support your learning and may form part of your evidence record for supervisor review.' }, {  heading: 'Safety acknowledgements', body: 'Some lessons require a safety acknowledgement. This confirms you have read and understood a specific safety requirement. Acknowledgements are recorded locally and can be reviewed by your supervisor.' }, {  heading: 'Supervisor review', body: 'Some steps in your pathway may require supervisor review. This means your supervisor needs to confirm your understanding or observe your practical skills. App completion is not the same as workplace authorisation.' }, {  heading: 'Honest progress', body: 'Your progress should be accurate and honest. Only complete a lesson or checkpoint when you have genuinely worked through the material. If unsure, ask a supervisor or trainer before marking it complete.' }],
    reflectionPrompt: 'What would you do if a training step is unclear? Write down the correct action in your own words.',
    patientExercise: 'Look at the lesson list for this module. Identify which lessons have checkpoint questions and which have safety acknowledgements.',
    safetyNote: 'AutoSkill OS™ supports training awareness and evidence capture. It does not replace workplace safety procedures, legal duties, qualified supervision, or employer responsibility. For on-site emergencies, follow your site emergency procedure immediately.',
    completionLabel: 'I understand how training pathways, modules, and checkpoints work',
    checkpoint: {
      question: 'What should you do if you do not understand a training step?',
      type: 'multipleChoice',
      options: ['Skip it and mark it complete', 'Guess and continue', 'Ask a supervisor or trainer for guidance', 'Ignore the training pathway'],
      correctAnswer: 'Ask a supervisor or trainer for guidance',
      safetyCritical: false,
      feedbackText: 'Correct. Always ask a supervisor or trainer if a training step is unclear before continuing.',
    },
  },

  m1l3: {
    id: 'm1l3',
    moduleId: 1,
    lessonNumber: 3,
    moduleTitle: 'Module 1 — Manufacturing Site Orientation',
    title: 'Assembly Line Process Overview',
    estimatedTime: '10–12 minutes',
    summary: 'The assembly line is a structured sequence of workstations, each contributing a specific step to the final product. Understanding how your workstation connects to the wider production flow helps you work consistently and communicate issues effectively.',
    learningGoals: ['Understand how work flows through an assembly line.', 'Know how one workstation connects to the next.', 'Understand why consistent process order matters.', 'Know how to communicate a delay or issue in the flow.'],
    sections: [{  heading: 'What is an assembly line?', body: 'An assembly line is a sequence of workstations where employees complete specific steps in a defined order. Each station receives work from the previous one and passes it forward. The quality and completeness of your step affects everything that follows.' }, {  heading: 'Why order matters', body: 'Manufacturing processes depend on steps being completed in the correct order. Skipping or changing a step without authorisation can affect safety, quality, traceability, and production flow. Always follow approved process instructions.' }, {  heading: 'Flow and handover', body: 'At the end of your step, work moves to the next station. If your step is incomplete or contains an issue, the next station may not be able to continue safely or correctly. Good handover information keeps the line running.' }, {  heading: 'When flow stops', body: 'A delay, missing part, or quality issue at one station can affect the next stage. If you encounter a blocker, report it through the correct workplace route rather than improvising or skipping ahead.' }, {  heading: 'Your role in the line', body: 'You need to understand your station clearly, complete your step correctly, and communicate when something is wrong. Understanding the wider flow helps you see why your consistency matters.' }],
    reflectionPrompt: 'How does your workstation connect to the next step in the process? Describe what you pass on and what you receive.',
    patientExercise: 'If you were explaining your workstation role to a new colleague, what would you say in three sentences? Write it down.',
    safetyNote: 'AutoSkill OS™ supports training awareness and evidence capture. It does not replace workplace safety procedures, legal duties, qualified supervision, or employer responsibility. For on-site emergencies, follow your site emergency procedure immediately.',
    completionLabel: 'I understand how assembly line flow works and my role within it',
    checkpoint: {
      question: 'What can happen if a problem at one station is not reported?',
      type: 'multipleChoice',
      options: ['It may affect later process stages', 'Nothing ever happens', 'It automatically fixes itself', 'The training pathway deletes it'],
      correctAnswer: 'It may affect later process stages',
      safetyCritical: false,
      feedbackText: 'Correct. Problems not reported at one station can cascade and affect downstream steps, quality, and safety.',
    },
  },

  m1l4: {
    id: 'm1l4',
    moduleId: 1,
    lessonNumber: 4,
    moduleTitle: 'Module 1 — Manufacturing Site Orientation',
    title: 'Workstation Readiness',
    estimatedTime: '10 minutes',
    summary: 'Before starting work at any workstation, employees must complete a readiness check. This confirms that the area, tools, materials, and PPE are ready, and that you understand the process step you are about to perform.',
    learningGoals: ['Know what a workstation readiness check involves.', 'Understand why readiness checks reduce errors.', 'Identify what to do if something is missing or incorrect.', 'Know when supervisor sign-off is required before starting.'],
    sections: [{  heading: 'What is a readiness check?', body: 'A readiness check is a brief review of your workstation before starting work. It confirms that PPE is available, tools are correct and undamaged, materials are correctly staged, the area is clean and clear, and you understand the process step.' }, {  heading: 'Why it matters', body: 'A missing tool or unclear instruction discovered before starting is far easier to resolve than one discovered mid-process. Consistent readiness checks reduce defects, delays, and safety incidents.' }, {  heading: 'What to check', body: 'Before starting: confirm PPE is available and worn correctly. Verify correct tools are present and in good condition. Check that right materials are at the station. Review the process instruction to confirm you understand the next step.' }, {  heading: 'If something is missing or wrong', body: 'Do not start work if required PPE, tools, or materials are missing. Do not start if you are unclear on the process step. Report the issue to your supervisor before beginning. Starting with incomplete preparation is a common cause of errors.' }, {  heading: 'Supervisor sign-off', body: 'Some workstation starts may require supervisor sign-off. If sign-off is required for your station, do not begin until it has been completed.' }],
    reflectionPrompt: 'What is the most important thing you check before starting at your workstation? Why does that item matter most?',
    patientExercise: 'Write a simple five-item readiness checklist for your workstation: PPE, tools, materials, area condition, and process step confirmation.',
    safetyNote: 'AutoSkill OS™ supports training awareness and evidence capture. It does not replace workplace safety procedures, legal duties, qualified supervision, or employer responsibility. For on-site emergencies, follow your site emergency procedure immediately.',
    completionLabel: 'I understand how to complete a workstation readiness check',
    checkpoint: {
      question: 'What should be checked before starting at a workstation?',
      type: 'multipleChoice',
      options: ['Only the time', 'Task instructions, tools/materials, area condition, and PPE', 'Nothing if the previous person used it', 'Only whether the training app opens'],
      correctAnswer: 'Task instructions, tools/materials, area condition, and PPE',
      safetyCritical: true,
      feedbackText: 'Correct. A proper readiness check covers the task instruction, tools, materials, area condition, and PPE before starting.',
    },
  },

  m1l5: {
    id: 'm1l5',
    moduleId: 1,
    lessonNumber: 5,
    moduleTitle: 'Module 1 — Manufacturing Site Orientation',
    title: 'Tool Handling and Equipment Safety',
    estimatedTime: '10–12 minutes',
    summary: 'Employees should only use tools and equipment they are trained and authorised to use. Safe tool handling reduces injury risk and protects product quality. This lesson covers tool selection, inspection, safe use, and what to do when a tool is damaged or unfamiliar.',
    learningGoals: ['Know which tools you are authorised to use.', 'Understand how to inspect a tool before use.', 'Know correct handling procedures for common manufacturing tools.', 'Know what to do if a tool is damaged, missing, or unfamiliar.'],
    sections: [{  heading: 'Authorised use only', body: 'Only use tools, equipment, or systems you are trained and authorised to use. If a task appears to require equipment you have not been trained on, stop and ask your supervisor before proceeding.' }, {  heading: 'Tool inspection before use', body: 'Before using any tool: check it is the correct tool for the task. Inspect for visible damage such as cracks, frayed wires, loose parts, or worn surfaces. Do not use a damaged tool. Report it and request a replacement.' }, {  heading: 'Safe handling', body: 'Use tools as designed. Do not use a tool for a purpose it was not designed for. Keep tools clear of moving machinery. Store tools in their correct location after every use.' }, {  heading: 'Equipment boundary awareness', body: 'Manufacturing areas may include machinery, restricted zones, moving parts, vehicles, or controlled processes. Respect barriers, signage, and restricted areas. Do not operate equipment outside your authorised scope.' }, {  heading: 'Report unsafe conditions', body: 'If a tool is missing, damaged, or behaving unusually, do not attempt to use or fix it yourself. Report to your supervisor immediately. Report unsafe conditions at any workstation, even if it is not your area.' }],
    reflectionPrompt: 'What would you do if you needed to complete a step but the correct tool was missing? Write down the steps you would take.',
    patientExercise: 'Identify two tools you use at your workstation. For each, write: what it does, how to inspect it before use, and where it is stored when not in use.',
    safetyNote: 'AutoSkill OS™ supports training awareness and evidence capture. It does not replace workplace safety procedures, legal duties, qualified supervision, or employer responsibility. For on-site emergencies, follow your site emergency procedure immediately.',
    completionLabel: 'I understand safe tool handling and equipment boundaries',
    checkpoint: {
      question: 'What should you do if a tool looks damaged or unfamiliar?',
      type: 'multipleChoice',
      options: ['Use it carefully', 'Hide it', 'Stop and ask a supervisor', 'Continue because production speed matters most'],
      correctAnswer: 'Stop and ask a supervisor',
      safetyCritical: true,
      feedbackText: 'Correct. Never use a damaged or unfamiliar tool. Stop and ask your supervisor before continuing.',
    },
  },

  m2l1: {
    id: 'm2l1',
    moduleId: 2,
    lessonNumber: 6,
    moduleTitle: 'Module 2 — Quality Control and Process Standards',
    title: 'Quality Control and Defect Reporting',
    estimatedTime: '10–12 minutes',
    summary: 'Quality control helps ensure that products, parts, and processes meet required standards. Employees should be alert for visible defects, missing parts, incorrect alignment, or anything that does not match the expected process. When an issue is found, it must be reported correctly.',
    learningGoals: ['Understand what quality control means at workstation level.', 'Know how to recognise a quality issue.', 'Understand the correct reporting process for defects.', 'Know why accurate reporting matters for the whole line.'],
    sections: [{  heading: 'What is quality control?', body: 'Quality control at workstation level means checking that your step meets the required standard before passing work to the next station. This may involve visual inspection, measurement, or functional checks depending on your role.' }, {  heading: 'Recognising a quality issue', body: 'A quality issue is anything that does not match the expected standard. This might include visible damage, incorrect assembly, missing components, wrong dimensions, surface defects, or incomplete steps. If in doubt, stop and ask.' }, {  heading: 'What to do when you find a defect', body: 'Do not pass defective work to the next station. Stop, quarantine the part if your site procedure requires it, and report the defect through the correct workplace route. Record what you found, where, and when.' }, {  heading: 'Accurate reporting', body: 'A useful defect report includes: what was found, where it was found, when it was found, and any action taken. Do not guess, hide, or change records. Accurate reporting protects employees, customers, and the business.' }, {  heading: 'Why it matters', body: 'Quality checks protect customers, employees, and the business. A missed defect can create rework, delays, safety concerns, customer dissatisfaction, or traceability issues.' }],
    reflectionPrompt: 'Can you describe a situation where missing a small quality issue could create a larger problem later in the process?',
    patientExercise: 'Write a brief defect report template for your workstation: what, where, when, and action taken.',
    safetyNote: 'AutoSkill OS™ supports training awareness and evidence capture. It does not replace workplace safety procedures, legal duties, qualified supervision, or employer responsibility. For on-site emergencies, follow your site emergency procedure immediately.',
    completionLabel: 'I understand quality control and the defect reporting process',
    checkpoint: {
      question: 'What should you do if something does not match the expected quality standard?',
      type: 'multipleChoice',
      options: ['Ignore it if it is small', 'Report it through the correct process or ask a supervisor', 'Hide it from the next station', 'Change the process yourself'],
      correctAnswer: 'Report it through the correct process or ask a supervisor',
      safetyCritical: false,
      feedbackText: 'Correct. Always report quality issues through the correct route. Do not hide or ignore them, even if minor.',
    },
  },

  m2l2: {
    id: 'm2l2',
    moduleId: 2,
    lessonNumber: 7,
    moduleTitle: 'Module 2 — Quality Control and Process Standards',
    title: 'Production Workflow and Handover',
    estimatedTime: '10 minutes',
    summary: 'Production flow describes how work moves through departments, stations, checks, and handover points. Good handovers reduce confusion and prevent missed issues. This lesson covers production flow awareness and what a good shift handover looks like.',
    learningGoals: ['Understand how production flow connects workstations.', 'Know what information a good handover should include.', 'Understand why handovers matter for the next shift or station.', 'Know what to do if a handover is unclear or incomplete.'],
    sections: [{  heading: 'Production flow', body: 'Production flow describes how work moves through departments, stations, quality checks, and handover points. A delay or issue at one station can affect the next stage. Understanding your position in the flow helps you communicate issues early.' }, {  heading: 'What is a handover?', body: 'A handover communicates the current state of work to the next person, team, shift, or station. A good handover reduces confusion, prevents missed issues, and keeps the line running safely.' }, {  heading: 'What to include in a handover', body: 'A useful handover includes: completed steps, pending or incomplete items, quality or safety concerns, missing materials, open defects, and any supervisor instructions. Do not assume the next person already knows.' }, {  heading: 'Clear communication', body: 'Clear communication supports production flow. Vague or missing handovers can cause defects, repeated work, safety incidents, or production delays. If your handover route requires written records, complete them accurately.' }, {  heading: 'If a handover you receive is unclear', body: 'If you receive an unclear handover, do not guess. Ask the previous operator or your supervisor for clarification before starting. Starting with incorrect information increases defect and error risk.' }],
    reflectionPrompt: 'What are the three most important items to communicate in your shift handover?',
    patientExercise: 'Write a sample handover note for your current or most recent workstation: completed items, pending issues, and safety concerns.',
    safetyNote: 'AutoSkill OS™ supports training awareness and evidence capture. It does not replace workplace safety procedures, legal duties, qualified supervision, or employer responsibility. For on-site emergencies, follow your site emergency procedure immediately.',
    completionLabel: 'I understand production workflow and how to complete a handover',
    checkpoint: {
      question: 'What should a handover communicate?',
      type: 'multipleChoice',
      options: ['Only positive updates', 'Completed steps, pending items, issues, and relevant safety or quality concerns', 'Nothing if the shift is busy', 'Only the training score'],
      correctAnswer: 'Completed steps, pending items, issues, and relevant safety or quality concerns',
      safetyCritical: false,
      feedbackText: 'Correct. A complete handover covers completed steps, pending items, and any safety or quality concerns.',
    },
  },

  m2l3: {
    id: 'm2l3',
    moduleId: 2,
    lessonNumber: 8,
    moduleTitle: 'Module 2 — Quality Control and Process Standards',
    title: 'Process Checkpoint Procedures',
    estimatedTime: '10 minutes',
    summary: 'Process checkpoints are defined verification points within the manufacturing process. At a checkpoint, an employee confirms that the required step has been completed correctly before work continues.',
    learningGoals: ['Understand what a process checkpoint is.', 'Know how to complete a checkpoint correctly.', 'Understand what to do if a step does not pass a checkpoint.', 'Know when supervisor involvement is required at a checkpoint.'],
    sections: [{  heading: 'What is a process checkpoint?', body: 'A process checkpoint is a point in the manufacturing sequence where an employee verifies that a step has been completed correctly before work continues. Checkpoints may be visual, dimensional, functional, or procedural.' }, {  heading: 'How to complete a checkpoint', body: 'At each checkpoint: review the quality standard for that step. Inspect the work against that standard. Record the result. If the step passes, continue. If it does not, follow the non-conformance process.' }, {  heading: 'If a step does not pass', body: 'Do not pass work that has not met the checkpoint standard. Quarantine the item if required. Report to your supervisor or follow the workplace non-conformance procedure. Do not skip a failed checkpoint to maintain production speed.' }, {  heading: 'Supervisor involvement', body: 'Some checkpoints require supervisor sign-off before work continues. If this is required at your station, do not proceed without it. The requirement will be shown in your process instruction.' }, {  heading: 'Recording accurately', body: 'Checkpoint records are part of your product traceability. Accurate records help the business track quality, investigate issues, and meet requirements. Do not record a pass when the step has not been properly checked.' }],
    reflectionPrompt: 'What is the checkpoint procedure at your workstation? Describe it in your own words from memory.',
    patientExercise: 'Write a step-by-step description of how you would complete a process checkpoint at your workstation.',
    safetyNote: 'AutoSkill OS™ supports training awareness and evidence capture. It does not replace workplace safety procedures, legal duties, qualified supervision, or employer responsibility. For on-site emergencies, follow your site emergency procedure immediately.',
    completionLabel: 'I understand how to complete a process checkpoint correctly',
    checkpoint: {
      question: 'What should you do if a process step does not meet the checkpoint standard?',
      type: 'multipleChoice',
      options: ['Record a pass anyway to keep production moving', 'Follow the non-conformance process and report to your supervisor', 'Skip the checkpoint record', 'Pass the work and fix it at the next station'],
      correctAnswer: 'Follow the non-conformance process and report to your supervisor',
      safetyCritical: false,
      feedbackText: 'Correct. A failed checkpoint must be reported and handled through the non-conformance process.',
    },
  },

  m2l4: {
    id: 'm2l4',
    moduleId: 2,
    lessonNumber: 9,
    moduleTitle: 'Module 2 — Quality Control and Process Standards',
    title: 'Workstation Safety Checks',
    estimatedTime: '8–10 minutes',
    summary: 'Workstation safety checks are brief but important reviews completed before and during a shift. They help identify hazards, confirm PPE, verify equipment condition, and confirm area readiness. Consistent safety checks protect employees and production quality.',
    learningGoals: ['Know what a workstation safety check involves.', 'Understand when safety checks should be completed.', 'Know what to do if a hazard is found during a safety check.', 'Understand the difference between a safety check and a process checkpoint.'],
    sections: [{  heading: 'What is a workstation safety check?', body: 'A workstation safety check is a structured review of the physical safety of your work area. It is different from a process checkpoint. A safety check looks for hazards, PPE issues, equipment problems, and area concerns.' }, {  heading: 'When to complete safety checks', body: 'Safety checks should be completed at the start of every shift before work begins. They may also be required after a break, after an incident, after equipment is moved, or when the workstation has been handed over from another shift.' }, {  heading: 'What to check', body: 'A typical safety check includes: PPE availability, equipment condition and guard positions, clear walkways and emergency exits, correct tool storage, absence of obvious spills or hazards, and confirmation that the area matches its expected state.' }, {  heading: 'If a hazard is found', body: 'If a hazard is found, do not start work in that area. Report the hazard to your supervisor immediately. Follow site-specific hazard reporting procedures. Do not attempt to resolve hazards yourself unless trained and authorised.' }, {  heading: 'Safety checks are not optional', body: 'Safety checks exist to protect you and your colleagues. Skipping them to save time is a false economy. A missed hazard that causes an incident costs far more than the minute spent on the check.' }],
    reflectionPrompt: 'Have you ever noticed a potential hazard at a workstation? What did you do, or what would you do next time?',
    patientExercise: 'Write a simple safety check list for your workstation covering at least five items: PPE, equipment, area condition, tool storage, and emergency access.',
    safetyNote: 'AutoSkill OS™ supports training awareness and evidence capture. It does not replace workplace safety procedures, legal duties, qualified supervision, or employer responsibility. For on-site emergencies, follow your site emergency procedure immediately.',
    completionLabel: 'I understand how to complete a workstation safety check',
    checkpoint: {
      question: 'What should you do if a hazard is found during a workstation safety check?',
      type: 'multipleChoice',
      options: ['Work around it carefully', 'Ignore it if it looks minor', 'Report it to your supervisor and do not start work in that area', 'Fix it yourself before anyone notices'],
      correctAnswer: 'Report it to your supervisor and do not start work in that area',
      safetyCritical: true,
      feedbackText: 'Correct. If a hazard is found, stop, do not start work, and report it to your supervisor immediately.',
    },
  },

  m2l5: {
    id: 'm2l5',
    moduleId: 2,
    lessonNumber: 10,
    moduleTitle: 'Module 2 — Quality Control and Process Standards',
    title: 'Supervisor Sign-Off and Sign-On',
    estimatedTime: '8–10 minutes',
    summary: 'Supervisor sign-off is a formal confirmation that a step, competency, or training milestone has been reviewed by a qualified supervisor. Sign-off is not automatic and is not replaced by app completion.',
    learningGoals: ['Understand what supervisor sign-off means.', 'Know which steps require supervisor sign-off.', 'Know how to prepare for a supervisor review.', 'Understand the difference between app completion and workplace authorisation.'],
    sections: [{  heading: 'What is supervisor sign-off?', body: 'Supervisor sign-off is formal confirmation from a qualified supervisor that you have demonstrated the required knowledge, skill, or safety behaviour for a specific step or competency. It is not automatic from completing training lessons.' }, {  heading: 'When is sign-off required?', body: 'Sign-off may be required before starting certain workstations, after completing a training module, when a competency is being assessed, or at the start of a new process. Your site procedures will state where sign-off is required.' }, {  heading: 'Preparing for supervisor review', body: 'To prepare: complete all required lessons and checkpoints. Review safety acknowledgements. Keep notes accurate. Be ready to explain or demonstrate what you have learned. Ask questions before the review if anything is unclear.' }, {  heading: 'App completion is not authorisation', body: 'Completing lessons in AutoSkill OS™ is a training milestone. It does not mean you are authorised to work independently at a station. Authorisation comes through supervisor sign-off and site-specific procedures.' }, {  heading: 'After sign-off', body: 'After sign-off, your progress record may be updated. Further sign-off may be required at later stages. Keep notes and evidence accurate throughout your pathway.' }],
    reflectionPrompt: 'What does your supervisor sign-off process look like at your site? What evidence would you bring to a review?',
    patientExercise: 'List three things you would check or prepare before requesting supervisor sign-off on a module.',
    safetyNote: 'AutoSkill OS™ supports training awareness and evidence capture. It does not replace workplace safety procedures, legal duties, qualified supervision, or employer responsibility. For on-site emergencies, follow your site emergency procedure immediately.',
    completionLabel: 'I understand the supervisor sign-off process and how to prepare for it',
    checkpoint: {
      question: 'Does completing app lessons automatically prove full workplace competence?',
      type: 'multipleChoice',
      options: ['Yes, always', 'No, supervisor review and workplace procedures may still be required', 'Only if the score is above 50%', 'Only in live mode'],
      correctAnswer: 'No, supervisor review and workplace procedures may still be required',
      safetyCritical: false,
      feedbackText: 'Correct. App completion is a training milestone. Workplace authorisation requires supervisor review and site procedures.',
    },
  },

  m3l1: {
    id: 'm3l1',
    moduleId: 3,
    lessonNumber: 11,
    moduleTitle: 'Module 3 — Competency Assessment and Development',
    title: 'Reviewing Your Training Progress',
    estimatedTime: '10 minutes',
    summary: 'Reviewing your training progress helps you and your supervisor identify what you have completed, what is pending, and where additional support may be useful. Progress review is a regular part of competency development.',
    learningGoals: ['Understand how to review your own training progress.', 'Know what progress information is recorded in AutoSkill OS™.', 'Understand how to use progress review in a supervisor conversation.', 'Know how to identify gaps in your training.'],
    sections: [{  heading: 'What progress is recorded?', body: 'AutoSkill OS™ records lesson completions, checkpoint answers, safety acknowledgements, evidence notes, and local sync queue items. This data is saved locally first and can support supervisor review conversations.' }, {  heading: 'How to review your progress', body: 'Open the Progress tab in the Employee Learning PWA. You will see completed lessons, pathway percentage, safety acknowledgement status, pending reviews, and evidence record counts. Review this before a supervisor check-in.' }, {  heading: 'Identifying gaps', body: 'If a module or lesson appears incomplete, check whether you missed a checkpoint or acknowledgement. If a supervisor review is pending, confirm when it is scheduled. If something appears incorrect, ask your supervisor to review it.' }, {  heading: 'Honest self-assessment', body: 'Progress should reflect your genuine understanding, not just task completion. If you completed a lesson but did not understand it fully, note that as a gap. Honest self-assessment makes supervisor conversations more useful.' }, {  heading: 'Progress is not a competition', body: 'Training speed varies between individuals and situations. A slower, more thorough review is more useful than a fast, shallow one. Competency is about understanding and capability, not speed.' }],
    reflectionPrompt: 'Looking at your current progress, where do you feel most confident? Where do you feel least confident? Write a short honest summary.',
    patientExercise: 'Open the Progress tab. Write down: how many lessons are complete, how many safety acknowledgements are done, and what you think is your biggest knowledge gap right now.',
    safetyNote: 'AutoSkill OS™ supports training awareness and evidence capture. It does not replace workplace safety procedures, legal duties, qualified supervision, or employer responsibility. For on-site emergencies, follow your site emergency procedure immediately.',
    completionLabel: 'I understand how to review and use my training progress',
    checkpoint: {
      question: 'What should honest training progress reflect?',
      type: 'multipleChoice',
      options: ['Only the lessons that were easy', 'Genuine understanding and capability, not just task completion speed', 'The highest possible score regardless of understanding', 'Only completed modules, not gaps'],
      correctAnswer: 'Genuine understanding and capability, not just task completion speed',
      safetyCritical: false,
      feedbackText: 'Correct. Progress should reflect genuine understanding. Rushing through reduces the value of the training.',
    },
  },

  m3l2: {
    id: 'm3l2',
    moduleId: 3,
    lessonNumber: 12,
    moduleTitle: 'Module 3 — Competency Assessment and Development',
    title: 'Recognising Process Errors Early',
    estimatedTime: '10 minutes',
    summary: 'Process errors are deviations from the expected standard. Recognising them early — before they cause defects, incidents, or escalated problems — is a valuable manufacturing skill. This lesson explains how to spot early warning signs and what to do when they appear.',
    learningGoals: ['Know what a process error looks like.', 'Understand the difference between a minor variation and a defect.', 'Know the correct early response when a process error is spotted.', 'Understand why early reporting is better than late correction.'],
    sections: [{  heading: 'What is a process error?', body: 'A process error is any deviation from the approved process instruction, quality standard, or expected output. This includes incorrect assembly sequence, wrong material, incorrect torque, surface damage, missing step, or out-of-tolerance measurement.' }, {  heading: 'Variation vs defect', body: 'Not all variation is a defect. Some processes have defined tolerance ranges. A result within the range may be acceptable. A result outside the range is a defect and must be treated as such. If unsure, ask a supervisor.' }, {  heading: 'Early warning signs', body: 'Early warning signs of a process problem include: tools behaving unusually, materials that look or feel different from expected, a step that takes longer than normal, a part that does not fit as expected, or a result that looks different from the approved sample.' }, {  heading: 'What to do when you spot an error', body: 'Stop the step if you can do so safely. Do not pass the issue to the next station. Report the error to your supervisor immediately using the correct reporting route. Record what you observed, when, and what action you took.' }, {  heading: 'Why early reporting matters', body: 'A process error caught early can be corrected with minimal disruption. An error that reaches the end of the line or the customer can result in rework, recalls, complaints, and significant cost.' }],
    reflectionPrompt: 'Can you think of a time when a small deviation in a process led to a bigger issue? What would earlier reporting have changed?',
    patientExercise: 'Write a list of three early warning signs that would tell you something may be wrong at your workstation. What would you do for each?',
    safetyNote: 'AutoSkill OS™ supports training awareness and evidence capture. It does not replace workplace safety procedures, legal duties, qualified supervision, or employer responsibility. For on-site emergencies, follow your site emergency procedure immediately.',
    completionLabel: 'I can recognise early process error signs and know how to respond',
    checkpoint: {
      question: 'Why is early error reporting better than waiting to report at the end?',
      type: 'multipleChoice',
      options: ['It is not — waiting gives more information', 'Early reporting allows correction before the error spreads or escalates', 'Only supervisors need to know about errors', 'Errors usually fix themselves over time'],
      correctAnswer: 'Early reporting allows correction before the error spreads or escalates',
      safetyCritical: false,
      feedbackText: 'Correct. Early error reporting prevents the problem from spreading to later stages or reaching the customer.',
    },
  },

  m3l3: {
    id: 'm3l3',
    moduleId: 3,
    lessonNumber: 13,
    moduleTitle: 'Module 3 — Competency Assessment and Development',
    title: 'Strengthening Core Process Skills',
    estimatedTime: '10–12 minutes',
    summary: 'Core process skills are the practical abilities you need to work safely and consistently at your workstation. This lesson helps you identify which skills matter most for your role and how to strengthen them through deliberate practice and review.',
    learningGoals: ['Identify the core process skills relevant to your role.', 'Understand how deliberate practice builds competency.', 'Know how to use supervisor feedback to improve skills.', 'Understand the relationship between skill confidence and quality output.'],
    sections: [{  heading: 'What are core process skills?', body: 'Core process skills are the specific practical abilities needed to complete your role effectively and safely. For an assembly trainee these might include tool handling, process step sequence, quality checking, and defect recognition.' }, {  heading: 'Deliberate practice', body: 'Deliberate practice means practising with attention and intent — not just repeating a step automatically. It involves noticing what you do well, noticing where you make errors, and working to improve specific areas.' }, {  heading: 'Using supervisor feedback', body: 'Supervisor feedback is one of the most valuable tools for skill development. Ask specific questions: What did I do well? What should I do differently? What is the most critical area to improve? Use feedback to adjust your approach deliberately.' }, {  heading: 'Skill confidence and quality', body: 'As skill confidence increases, you are likely to make fewer errors, work more consistently, and handle unexpected situations more calmly. Skill confidence comes from repetition with attention, feedback, and honest self-assessment.' }, {  heading: 'Continuous improvement', body: 'Even experienced employees continue to develop skills. Continuous improvement is a normal part of manufacturing culture. If you notice a better way to complete a step, raise it with your supervisor rather than changing the process independently.' }],
    reflectionPrompt: 'Which two process skills do you feel least confident about right now? What is your plan to strengthen them?',
    patientExercise: 'Write a simple skill development plan for one of your core process skills: what you want to improve, how you will practise, and what feedback you will ask your supervisor for.',
    safetyNote: 'AutoSkill OS™ supports training awareness and evidence capture. It does not replace workplace safety procedures, legal duties, qualified supervision, or employer responsibility. For on-site emergencies, follow your site emergency procedure immediately.',
    completionLabel: 'I understand how to identify and strengthen my core process skills',
    checkpoint: {
      question: 'What does deliberate practice mean in a manufacturing context?',
      type: 'multipleChoice',
      options: ['Repeating steps as fast as possible', 'Practising with attention, noticing errors, and working to improve specific areas', 'Only practising easy steps', 'Waiting for a supervisor to tell you what to do'],
      correctAnswer: 'Practising with attention, noticing errors, and working to improve specific areas',
      safetyCritical: false,
      feedbackText: 'Correct. Deliberate practice is focused and intentional. It means noticing errors and working to address them, not just repeating steps automatically.',
    },
  },

  m3l4: {
    id: 'm3l4',
    moduleId: 3,
    lessonNumber: 14,
    moduleTitle: 'Module 3 — Competency Assessment and Development',
    title: 'Preparing for Supervisor Check-In',
    estimatedTime: '10 minutes',
    summary: 'A supervisor check-in is a structured conversation where you and your supervisor review your progress, address gaps, and confirm next steps. Preparing well makes the check-in more useful for both of you.',
    learningGoals: ['Know how to prepare for a supervisor check-in.', 'Understand what evidence to bring to a review.', 'Know which questions to ask your supervisor.', 'Understand how check-ins contribute to your competency record.'],
    sections: [{  heading: 'What is a supervisor check-in?', body: 'A supervisor check-in is a scheduled conversation between an employee and their supervisor. It is used to review training progress, address gaps, discuss performance, and confirm next steps. It may include formal sign-off at pathway milestones.' }, {  heading: 'How to prepare', body: 'Before the check-in: review your progress in the app. Note which lessons are complete and which are pending. Review safety acknowledgements. Collect any evidence notes. Identify two or three specific questions you want to ask.' }, {  heading: 'What evidence to bring', body: 'Evidence may include lesson completion records, checkpoint answers, safety acknowledgements, notes from your reflection exercises, or practical observations noted by your supervisor. Keep records accurate and honest.' }, {  heading: 'Questions to ask', body: 'Useful questions: What am I doing well? What is my biggest area for improvement? Are there steps I need to repeat or review? What is my next sign-off milestone? Is there anything I should be aware of before my next step?' }, {  heading: 'After the check-in', body: 'After the check-in, note any feedback received. Update your action plan. Complete any steps your supervisor identified as priority. Do not wait for the next formal check-in to address a gap.' }],
    reflectionPrompt: 'What is one area of your training you would want to discuss at a supervisor check-in? What evidence would you bring to support that conversation?',
    patientExercise: 'Prepare a short brief for your next supervisor check-in: three completed milestones, one gap you have identified, and one question you want to ask.',
    safetyNote: 'AutoSkill OS™ supports training awareness and evidence capture. It does not replace workplace safety procedures, legal duties, qualified supervision, or employer responsibility. For on-site emergencies, follow your site emergency procedure immediately.',
    completionLabel: 'I know how to prepare for a supervisor check-in',
    checkpoint: {
      question: 'What is the purpose of a supervisor check-in?',
      type: 'multipleChoice',
      options: ['To review training progress, address gaps, and confirm next steps', 'To fill in paperwork with no real purpose', 'To prove that the training app was opened', 'Only to approve pay increases'],
      correctAnswer: 'To review training progress, address gaps, and confirm next steps',
      safetyCritical: false,
      feedbackText: 'Correct. A supervisor check-in reviews progress, addresses gaps, and confirms next steps in your competency development.',
    },
  },

  m3l5: {
    id: 'm3l5',
    moduleId: 3,
    lessonNumber: 15,
    moduleTitle: 'Module 3 — Competency Assessment and Development',
    title: 'Final Competency Check',
    estimatedTime: '10–12 minutes',
    summary: 'The final pathway check confirms you understand the basics of manufacturing training flow, PPE readiness, workstation preparation, process order, tool safety, quality checks, defect reporting, and supervisor review. Completion is a training milestone, not a guarantee of legal compliance or independent authorisation.',
    learningGoals: ['Review the key themes from all three modules.', 'Confirm understanding of safety-critical responsibilities.', 'Understand what final pathway completion means in AutoSkill OS™.', 'Know the correct next steps after completing the pathway.'],
    sections: [{  heading: 'Module 1 review: Site orientation', body: 'You covered the purpose of AutoSkill OS™, training pathway structure, assembly line flow, workstation readiness, and safe tool handling. These foundational topics apply across all manufacturing roles.' }, {  heading: 'Module 2 review: Quality and process', body: 'You covered quality control, defect reporting, production handover, process checkpoints, workstation safety checks, and supervisor sign-off. Quality and process consistency are shared responsibilities across the whole line.' }, {  heading: 'Module 3 review: Competency development', body: 'You covered progress review, early error recognition, core skill strengthening, and supervisor check-in preparation. Competency development is ongoing and does not stop at the end of this pathway.' }, {  heading: 'What pathway completion means', body: 'Completing this pathway in AutoSkill OS™ is a training milestone. It shows you have engaged with all three modules. It does not mean you are fully authorised to work independently. Supervisor review and site-specific authorisation steps still apply.' }, {  heading: 'Next steps', body: 'Review all safety acknowledgements. Confirm any outstanding supervisor reviews. Continue following workplace procedures. If further pathways are assigned, begin them when ready. Continue to ask questions and report issues as they arise.' }],
    reflectionPrompt: 'What are the three most important things you have learned from this training pathway? Write them in your own words.',
    patientExercise: 'Write a short personal commitment statement: what you will do differently after completing this pathway, and what you will ask for support with from your supervisor.',
    safetyNote: 'Completing this pathway supports training awareness and supervisor review, but does not replace workplace safety procedures, legal duties, qualified supervision, employer responsibility, or site-specific training. AutoSkill OS™ supports training awareness and evidence capture. It does not replace workplace safety procedures, legal duties, or qualified supervision.',
    completionLabel: 'I have completed the New Starter Manufacturing Training Pathway',
    checkpoint: {
      question: 'What does final pathway completion mean in AutoSkill OS™ demo mode?',
      type: 'multipleChoice',
      options: ['The employee can ignore workplace procedures', 'It shows a training milestone that may support supervisor review', 'It guarantees legal compliance', 'It replaces employer responsibility'],
      correctAnswer: 'It shows a training milestone that may support supervisor review',
      safetyCritical: false,
      feedbackText: 'Correct. Final pathway completion is a training milestone. It may support supervisor review but does not guarantee compliance or replace employer responsibility.',
    },
  },

};


const COPING = [
  { id: 'workstation_check', icon: '🔧', name: 'Workstation Readiness Check', desc: 'Before starting your shift: verify tools are in position, PPE is available, materials are correctly staged, and your area is clear of hazards.', cat: 'Workstation Readiness' },
  { id: 'ppe_check',         icon: '🦺', name: 'PPE Pre-Shift Check', desc: 'Confirm hard hat, hi-vis vest, safety boots, gloves, and any role-specific PPE are worn and in good condition before entering the production area.', cat: 'Safety' },
  { id: 'defect_report',     icon: '🎯', name: 'Defect Reporting Practice', desc: 'Identify the defect type, note the location on the assembly, record batch/serial, stop the line if required, and report to your supervisor before continuing.', cat: 'Quality Control' },
  { id: 'handover',          icon: '🤝', name: 'Shift Handover Checklist', desc: 'At shift end: update the handover log, notify the incoming operator of any open issues, confirm workstation is clean and tools are stored correctly.', cat: 'Production Workflow' },
  { id: 'process_checkpoint',icon: '✅', name: 'Process Checkpoint Verification', desc: 'At each process checkpoint: confirm the step is complete to spec, sign the checkpoint log, and alert your supervisor if the step does not meet quality standards.', cat: 'Process Standards' },
  { id: 'supervisor_signoff',icon: '👁️', name: 'Supervisor Sign-Off Preparation', desc: 'Gather evidence of your completed work, note any questions or concerns, and request your supervisor check-in when a completed task requires formal sign-off.', cat: 'Supervisor Review' },
  { id: 'qc_inspection',     icon: '🔍', name: 'Quality Inspection Technique', desc: 'Use the correct inspection method for your product stage — visual, dimensional, or functional. Always use the approved inspection sheet and record findings immediately.', cat: 'Quality Control' },
  { id: 'tool_safety',       icon: '⚙️', name: 'Safe Tool Handling Practice', desc: 'Select the correct tool for the task, inspect for damage before use, use correct technique, and return tools to the correct location after every task.', cat: 'Workstation Safety' },
  { id: 'focus_reset',       icon: '⏸️', name: 'Focus Reset — Short Pause', desc: 'If you feel rushed or unsure: stop, step back from the workstation, take a moment to review the process step, then continue. Rushing causes defects and accidents.', cat: 'Process Safety' },
  { id: 'ask_supervisor',    icon: '💬', name: 'Ask Your Supervisor', desc: 'If unsure about any step, quality requirement, or safety rule: stop work, ask your supervisor. Asking is the correct action — never guess on safety or quality.', cat: 'Supervisor Support' },
];

const INSIGHTS = [
  'Every process check you complete builds your competency record. Consistency matters more than speed.',
  'Quality control starts at your workstation. A defect caught early prevents a recall later.',
  'PPE is not optional — it is part of the job. Check yours before every shift.',
  'A good handover keeps the whole line running safely. Take it seriously every time.',
  'If you are unsure, stop and ask your supervisor. Guessing costs the line more than a short pause.',
  'Your training progress is recorded locally and will sync to the dashboard in a later run.',
  'Small consistent checks build the foundation for competency. Focus on one process step at a time.',
  'Supervisor sign-off is a quality gate — prepare your evidence before requesting it.',
  'Workstation readiness at the start of every shift prevents the most common line errors.',
  'Every safety acknowledgement you complete is logged. Your training record is building up.',
];



// ── App State ─────────────────────────────────────────────────────
let profile       = sGet('ap3x_patient_profile', null);
let checkins      = sGet('ap3x_patient_checkins', []);
let lessonDone    = sGet('ap3x_lesson_progress', {});
let copingUsed    = sGet('ap3x_coping_used', []);
let xp            = sGet('ap3x_xp', 0);
let streak        = sGet('ap3x_streak', 0);
let lastCIDate    = sGet('ap3x_last_checkin_date', null);
let dark          = sGet('ap3x_patient_theme', 'dark') === 'dark';
let ciStep        = 1;
let ciData        = freshCIData();
let selectedMood  = null;
const TOTAL_STEPS = 5;  // Run 4: shortened to 5-step training check-in

// ── Run 4: SSOT employee / pathway state ─────────────────────────
// Reads from ap3x_dm_* keys seeded by data model boot.
// Does not create a second store — reads SSOT only.
function dmGet(key, fallback) {
  try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch(e) { return fallback; }
}
function dmSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {} 
}
function dmGetAll(key) { return dmGet(key, []); }

// Active employee — use first demo employee if no live profile

// ════════════════════════════════════════════════════════════════
// Run 6: Data-Mode Awareness Helpers (PWA local-first)
// ════════════════════════════════════════════════════════════════

function getPwaDataMode() {
  return dmGet('ap3x_dm_data_mode', 'demo');
}

function isPwaDemoMode() {
  var stored = localStorage.getItem('4p3x_demo_mode');
  if (stored !== null) return JSON.parse(stored);
  return true; // default to demo
}

function setPwaDemoMode(on) {
  sSet('4p3x_demo_mode', on);
  sSet('ap3x_dm_data_mode', on ? 'demo' : 'live');
  showToast(on ? '🎭 Demo Mode enabled' : '🟢 Live Mode — demo records hidden');
  updateHeader();
  // Re-render current tab
  var tab = document.querySelector('.tab-btn.active') || {};
  if (typeof buildPortal === 'function') buildPortal();
}

function getPwaActiveEmployeeByMode() {
  var demoOn = isPwaDemoMode();
  var emps = dmGetAll('ap3x_dm_employees');
  if (demoOn) {
    var demos = emps.filter(function(e) { return e.isDemo; });
    return demos.length ? demos[0] : null;
  }
  // Live mode: only non-demo employees
  var live = emps.filter(function(e) { return !e.isDemo; });
  return live.length ? live[0] : null;
}

function getPwaPathwaysByMode() {
  var demoOn = isPwaDemoMode();
  var all = dmGetAll('ap3x_dm_pathways');
  if (demoOn) return all;
  return all.filter(function(p) { return !p.isDemo; });
}

function getPwaSafetyAcksByMode() {
  var demoOn = isPwaDemoMode();
  var all = dmGetAll('ap3x_dm_safety_acks');
  if (demoOn) return all;
  return all.filter(function(a) { return !a.isDemo; });
}


function getActiveEmployee() {
  if (profile && profile.userId) {
    var emps = dmGetAll('ap3x_dm_employees');
    var matched = emps.find(function(e) { return e.id === profile.userId; });
    if (matched) return matched;
  }
  // Fall back to first demo employee
  var demos = dmGetAll('ap3x_dm_employees').filter(function(e) { return e.isDemo; });
  return demos.length ? demos[0] : null;
}
function getEmployeeAssignedPathways(emp) {
  if (!emp) return [];
  var all = dmGetAll('ap3x_dm_pathways');
  return all.filter(function(p) { return (emp.assignedPathwayIds || []).includes(p.id); });
}
function getPathwayModules(pathwayId) {
  var all = dmGetAll('ap3x_dm_process_modules');
  return all.filter(function(m) { return (m.pathwayId === pathwayId) || (m.lessonIds && m.lessonIds.length); });
}
function getPwaLocalStatus() {
  var syncQ  = dmGetAll('ap3x_dm_pwa_sync_queue').length + (function(){ try{ return JSON.parse(localStorage.getItem('ap3x_sync_queue')||'[]').length; }catch(e){return 0;} })();
  var beCfg  = dmGet('ap3x_dm_backend_config', {});
  var mode   = dmGet('ap3x_dm_data_mode', 'demo');
  return { syncQueue: syncQ, backendMode: beCfg.provider || 'local-only', dataMode: mode, isDemo: dmGet('4p3x_demo_mode', true) };
}

// Safety acknowledgements local save
function acknowledgeLocalSafetyItem(ackId, employeeId) {
  var acks = dmGetAll('ap3x_dm_safety_acks');
  var updated = acks.map(function(a) {
    if (a.id !== ackId) return a;
    var ids = (a.acknowledgedByEmployeeIds || []).slice();
    if (!ids.includes(employeeId)) ids.push(employeeId);
    return Object.assign({}, a, { acknowledgedByEmployeeIds: ids, updatedAt: new Date().toISOString() });
  });
  dmSet('ap3x_dm_safety_acks', updated);
  queueDmSyncItem({ type: 'safety_ack_completed', entityType: 'safetyAck', entityId: ackId, data: { ackId: ackId, employeeId: employeeId } });
  return updated;
}

// Active pathway/module nav state (session only — no localStorage)
var pwaNav = { pathwayId: null, moduleId: null, lessonId: null };

function freshCIData() {
  return { mood: null, anxiety: null, sleep: null, energy: null, coping: null, copingList: [], overwhelmed: null, conc: null, conn: null, note: '', support: null };
}

// ── Boot ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loading-screen').style.display = 'none';
  if (!profile) {
    buildOnboarding();
    document.getElementById('onboarding').style.display = 'block';
  } else {
    buildPortal();
    document.getElementById('portal-root').style.display = 'block';
    renderAll();
  }
});

function applyTheme() {
  document.body.className = dark ? 'theme-dark' : 'theme-light';
}

// ── Onboarding ────────────────────────────────────────────────────
function buildOnboarding() {
  applyTheme();
  document.getElementById('onboarding').innerHTML = `
  <div class="ob-inner">
    <div class="ob-step active" id="ob1">
      <div class="ob-logo"><img src="../../icons/as-logo.png" alt="AutoSkill OS™" style="width:88px;height:88px;object-fit:contain;filter:drop-shadow(0 0 12px rgba(201,168,76,0.25))"/><div class="ob-brand">AutoSkill OS™</div><div class="ob-brand-sub">Employee Learning PWA</div></div>
      <h1 class="ob-title">Welcome to your Employee Learning Portal</h1>
      <p class="ob-desc">Manufacturing training check-ins, process modules, skill techniques, and competency tracking — all built around your competency development.</p>
      <div class="ob-feats">
        <div class="ob-feat"><span>📋</span>Daily training check-in (10 questions)</div>
        <div class="ob-feat"><span>🎓</span>Manufacturing Training Pathway — 3 modules</div>
        <div class="ob-feat"><span>📈</span>Competency and skills tracking</div>
        <div class="ob-feat"><span>🛠️</span>Skill practices &amp; process checkpoints</div>
      </div>
      <button class="btn-primary" onclick="obGo(1,2)">Set up my training profile →</button>
      <button class="ob-skip" onclick="obSkip()">Skip — already set up</button>
    </div>
    <div class="ob-step" id="ob2">
      <button class="ob-back" onclick="obGo(2,1)">‹ Back</button>
      <div class="ob-step-num">Step 1 of 3</div>
      <h2 class="ob-step-title">Tell us about yourself</h2>
      <p class="ob-step-sub">Only stored locally on this device — never shared.</p>
      <div class="ob-field"><label class="ob-label">First name or nickname</label><input type="text" id="ob-name" class="ob-input" placeholder="e.g. Alex, Jordan…"/></div>
      <div class="ob-field"><label class="ob-label">Age range</label>
        <div style="display:flex;flex-wrap:wrap;gap:8px" id="ob-age">
          ${['Under 18','18–24','25–34','35–44','45+'].map(a=>`<button class="ob-goal-btn" data-age="${a}" onclick="selOb(this,'ob-age')">${a}</button>`).join('')}
        </div>
      </div>
      <button class="btn-primary" style="margin-top:16px" onclick="obGo(2,3)">Next →</button>
    </div>
    <div class="ob-step" id="ob3">
      <button class="ob-back" onclick="obGo(3,2)">‹ Back</button>
      <div class="ob-step-num">Step 2 of 3</div>
      <h2 class="ob-step-title">What are your training goals?</h2>
      <p class="ob-step-sub">Select everything relevant — helps personalise your Training Pathway.</p>
      <div class="ob-goals-grid" id="ob-goals">
        ${['Site orientation','Quality control','Safety induction','Workstation readiness','Supervisor sign-off','Processing difficult feelings','Improving relationships','Building confidence','Managing intrusive thoughts','Trauma recovery'].map(g=>`<button class="ob-goal-btn" data-g="${g}" onclick="this.classList.toggle('active')">${g}</button>`).join('')}
      </div>
      <button class="btn-primary" style="margin-top:16px" onclick="obGo(3,4)">Next →</button>
    </div>
    <div class="ob-step" id="ob4">
      <button class="ob-back" onclick="obGo(4,3)">‹ Back</button>
      <div class="ob-step-num">Step 3 of 3</div>
      <h2 class="ob-step-title">Your experience with manufacturing training support</h2>
      <p class="ob-step-sub">Helps calibrate lesson depth and guidance.</p>
      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px" id="ob-exp">
        <button class="ob-goal-btn" style="padding:14px;text-align:left;border-radius:var(--r)" data-e="new" onclick="selOb(this,'ob-exp')"><strong>New to this training programme</strong><br/><span style="font-size:12px;color:var(--muted)">Just starting this training programme and new to this type of learning</span></button>
        <button class="ob-goal-btn" style="padding:14px;text-align:left;border-radius:var(--r)" data-e="some" onclick="selOb(this,'ob-exp')"><strong>Some experience</strong><br/><span style="font-size:12px;color:var(--muted)">Had some workplace training or onboarding before</span></button>
        <button class="ob-goal-btn" style="padding:14px;text-align:left;border-radius:var(--r)" data-e="ongoing" onclick="selOb(this,'ob-exp')"><strong>Ongoing support</strong><br/><span style="font-size:12px;color:var(--muted)">Currently working with a supervisor, want extra support</span></button>
      </div>
      <button class="btn-primary" onclick="obFinish()">Set up my training portal →</button>
    </div>
    <div class="ob-step" id="ob5">
      <div class="ob-ready-icon">✨</div>
      <div class="ob-ready-title">You're all set!</div>
      <div class="ob-ready-sub">Your personalised training portal is ready.</div>
      <div class="ob-summary" id="ob-summary"></div>
      <div class="safety-notice">
        <h4>⚠️ Important</h4>
        <p>AutoSkill OS™ supports manufacturing workforce training and competency tracking. It does not replace site-specific safety protocols or emergency procedures. For on-site emergencies, follow your site emergency procedure immedes or a crisis support line immediately.</p>
      </div>
      <button class="btn-primary" onclick="launchPortal()">Open My Training Portal →</button>
    </div>
  </div>`;
}

function selOb(btn, groupId) {
  document.querySelectorAll('#'+groupId+' .ob-goal-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}
function obGo(from, to) {
  document.getElementById('ob'+from).classList.remove('active');
  document.getElementById('ob'+to).classList.add('active');
}
function obSkip() {
  profile = { name: 'Friend', age: '', goals: [], exp: '', createdAt: Date.now() };
  sSet('ap3x_patient_profile', profile);
  // ── Run 4: seed employee into SSOT dm_employees if not already seeded ──
  try {
    var existing = JSON.parse(localStorage.getItem('ap3x_dm_employees') || '[]');
    var alreadyExists = existing.some(function(e) { return e.id === profile.userId; });
    if (!alreadyExists) {
      existing.push({
        id: profile.userId, displayName: profile.name, roleTitle: profile.role || 'Employee',
        departmentId: 'dept-general', employeeNumber: null, status: 'active',
        assignedPathwayIds: [], completedModuleIds: [], progressPercent: 0,
        competencyStatus: 'not_started', safetyAcknowledgementStatus: 'pending',
        syncStatus: 'local', isDemo: false, lastActivityAt: new Date().toISOString()
      });
      localStorage.setItem('ap3x_dm_employees', JSON.stringify(existing));
    }
  } catch(e) { /* non-fatal */ }
  launchPortal();
}
function obFinish() {
  const name = (document.getElementById('ob-name').value.trim()) || 'Friend';
  const age  = (document.querySelector('#ob-age .ob-goal-btn.active') || {}).dataset?.age || '';
  const goals = [...document.querySelectorAll('#ob-goals .ob-goal-btn.active')].map(b => b.dataset.g);
  const exp   = (document.querySelector('#ob-exp .ob-goal-btn.active') || {}).dataset?.e || '';
  profile = { name, age, goals, exp, createdAt: Date.now(), userId: 'emp_' + Date.now() };
  sSet('ap3x_patient_profile', profile);
  // ── Run 4: seed this employee into ap3x_dm_employees if not present ──
  try {
    var _emps = JSON.parse(localStorage.getItem('ap3x_dm_employees') || '[]');
    if (!_emps.some(function(e) { return e.id === profile.userId; })) {
      _emps.push({
        id: profile.userId, displayName: profile.name, roleTitle: 'Employee',
        departmentId: 'dept-general', employeeNumber: null, status: 'active',
        assignedPathwayIds: [], completedModuleIds: [], progressPercent: 0,
        competencyStatus: 'not_started', safetyAcknowledgementStatus: 'pending',
        syncStatus: 'local', isDemo: false, lastActivityAt: new Date().toISOString()
      });
      localStorage.setItem('ap3x_dm_employees', JSON.stringify(_emps));
    }
  } catch(e) { /* non-fatal */ }
  document.getElementById('ob-summary').innerHTML = `<strong>${name}</strong> · Age: ${age || 'Not specified'}<br/>Goals: ${goals.join(', ') || 'Not selected'}<br/>Experience: ${exp || 'Not specified'}`;
  obGo(4, 5);
}
function launchPortal() {
  document.getElementById('onboarding').style.display = 'none';
  document.getElementById('portal-root').style.display = 'block';
  buildPortal();
  renderAll();
}

// ── Build Portal Shell ────────────────────────────────────────────
function buildPortal() {
  applyTheme();
  document.getElementById('portal-root').innerHTML = `
    <header class="portal-header">
      <div class="ph-brand"><div class="brand-dot"></div><div><div class="brand-name">AutoSkill OS™</div><div class="brand-sub">Employee Learning PWA</div></div></div>
      <div class="ph-right">
        <span class="xp-chip" id="xp-chip">⚡ 0 XP</span>
        <button class="btn-icon" onclick="toggleTheme()">🌙</button>
      </div>
    </header>
    <div id="streak-banner" class="streak-banner" style="display:none">
      <div class="streak-left"><span>🔥</span><span id="streak-text">0-day streak</span></div>
      <span class="streak-xp" id="streak-xp-val">0 XP</span>
    </div>
    <nav class="bottom-nav">
      <button class="nav-tab active" id="tab-btn-home" onclick="switchTab('home')" aria-label="Home">
        <span style="font-size:20px">&#x1F3E0;</span>Home</button>
      <button class="nav-tab" id="tab-btn-pathway" onclick="switchTab('pathway')" aria-label="My Training">
        <span style="font-size:20px">&#x1F5FA;</span>Pathway</button>
      <button class="nav-tab" id="tab-btn-lessons" onclick="switchTab('lessons')" aria-label="Lessons">
        <span style="font-size:20px">&#x1F393;</span>Lessons</button>
      <button class="nav-tab" id="tab-btn-safety" onclick="switchTab('safety')" aria-label="Safety Checks">
        <span style="font-size:20px">&#x1F9BA;</span>Safety<span class="notif-dot" id="safety-dot" style="display:none"></span></button>
      <button class="nav-tab" id="tab-btn-progress" onclick="switchTab('progress')" aria-label="My Progress">
        <span style="font-size:20px">&#x1F4C8;</span>Progress</button>
    </nav>
    <div id="tab-home" class="tab-page"></div>
    <div id="tab-pathway" class="tab-page hidden"></div>
    <div id="tab-lessons" class="tab-page hidden"></div>
    <div id="tab-safety" class="tab-page hidden"></div>
    <div id="tab-progress" class="tab-page hidden"></div>`;
}

function toggleTheme() { dark = !dark; sSet('ap3x_patient_theme', dark ? 'dark' : 'light'); applyTheme(); }

function switchTab(name) {
  // Back-compat redirects for removed tabs
  if (name === 'checkin') name = 'home';
  if (name === 'coping')  name = 'safety';
  document.querySelectorAll('.tab-page').forEach(function(p) { p.classList.add('hidden'); });
  document.querySelectorAll('.nav-tab').forEach(function(b) { b.classList.remove('active'); });
  var pg  = document.getElementById('tab-' + name);
  var btn = document.getElementById('tab-btn-' + name);
  if (pg)  pg.classList.remove('hidden');
  if (btn) btn.classList.add('active');
  // Re-render on switch
  if (name === 'pathway')  renderPathway();
  if (name === 'safety')   renderSafetyChecks();
  if (name === 'progress') renderProgress();
  if (name === 'lessons')  renderLessons();
  if (name === 'home')     renderHome();
  // Scroll to top of PWA content area on every tab switch
  var scrollTarget = document.getElementById('portal-root') || document.documentElement;
  scrollTarget.scrollTop = 0;
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function renderAll() {
  renderHome();
  renderPathway();
  renderLessons();
  renderSafetyChecks();
  renderProgress();
  updateHeader();
}

// ── Header / streak ───────────────────────────────────────────────
function updateHeader() {
  document.getElementById('xp-chip').textContent = '&#x26A1; ' + xp + ' XP';
  // Safety dot — show if any missing safety acks
  var emp = getPwaActiveEmployeeByMode ? getPwaActiveEmployeeByMode() : getActiveEmployee();
  var acks = dmGetAll('ap3x_dm_safety_acks');
  var missingAcks = emp ? acks.filter(function(a) {
    return !(a.acknowledgedByEmployeeIds || []).includes(emp.id);
  }).length : 0;
  var dot = document.getElementById('safety-dot');
  if (dot) dot.style.display = missingAcks > 0 ? 'block' : 'none';
  if (streak > 0) {
    var sb = document.getElementById('streak-banner');
    if (sb) sb.style.display = 'flex';
    var st = document.getElementById('streak-text');
    if (st) st.textContent = streak + '-day streak';
    var sv = document.getElementById('streak-xp-val');
    if (sv) sv.textContent = xp + ' XP';
  }
}

// ── HOME ─────────────────────────────────────────────────
function renderHome() {
  var hr     = new Date().getHours();
  var greet  = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
  var demoOn = isPwaDemoMode ? isPwaDemoMode() : true;
  var emp    = getPwaActiveEmployeeByMode ? getPwaActiveEmployeeByMode() : getActiveEmployee();
  var status = getPwaLocalStatus();
  var totalLessons = Object.values(lessonDone).filter(Boolean).length;
  var insight = INSIGHTS[new Date().getDate() % INSIGHTS.length];

  var empName = emp ? emp.displayName : (profile ? profile.name : 'Trainee');
  var empRole = emp ? emp.roleTitle : 'Employee';
  var empDept = emp ? (emp.departmentId || '').replace('dept-','').replace(/-/g,' ') : '--';

  var pathways  = emp ? getEmployeeAssignedPathways(emp) : [];
  var firstPath = pathways[0];
  var pathPct   = emp ? (emp.progressPercent || 0) : Math.round((totalLessons / 15) * 100);

  var acks     = dmGetAll('ap3x_dm_safety_acks');
  var ackDone  = emp ? acks.filter(function(a) { return (a.acknowledgedByEmployeeIds||[]).includes(emp.id); }).length : 0;
  var ackTotal = acks.length;
  var syncCount = status.syncQueue;
  var modeLabel = status.isDemo ? 'Demo Mode' : 'Live Mode';
  var insight   = INSIGHTS[new Date().getDate() % INSIGHTS.length];

  document.getElementById('tab-home').innerHTML =
    '<div class="home-hero">' +
      '<div class="hh-title">' + greet + ', ' + empName + ' &#x1F44B;</div>' +
      '<div class="hh-sub">' + empRole + (empDept !== '--' ? ' &middot; ' + empDept : '') + '</div>' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">' +
        '<span style="font-size:11px;background:rgba(201,168,76,.15);color:var(--gold);border:1px solid rgba(201,168,76,.3);border-radius:99px;padding:2px 10px;font-weight:700">' + modeLabel + '</span>' +
        (syncCount > 0
          ? '<span style="font-size:11px;background:var(--surface2);color:var(--muted);border:1px solid var(--border);border-radius:99px;padding:2px 10px">' + syncCount + ' updates queued</span>'
          : '<span style="font-size:11px;background:rgba(34,197,94,.1);color:var(--green);border:1px solid rgba(34,197,94,.3);border-radius:99px;padding:2px 10px">&#x2713; Saved locally</span>') +
      '</div>' +
    '</div>' +
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">' + '<div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em">Quick Access</div>' + '<span style="font-size:10px;padding:2px 8px;border-radius:99px;font-weight:700;background:' + (demoOn?'rgba(201,168,76,.15)':'rgba(34,197,94,.12)') + ';color:' + (demoOn?'var(--gold)':'var(--green)') + ';border:1px solid ' + (demoOn?'rgba(201,168,76,.3)':'rgba(34,197,94,.25)') + '">' + (demoOn ? '\ud83c\udfad Demo' : '\ud83d\udfe2 Live') + '</span></div>' + '<div class="quick-grid">' +
      '<button class="qa-btn" onclick="switchTab(\'pathway\')" aria-label="View Training Pathway">' +
        '<div class="qa-icon">&#x1F5FA;</div><div class="qa-label">My Training</div>' +
        '<div class="qa-desc">' + (firstPath ? firstPath.title.substring(0,32) + (firstPath.title.length>32?'...':'') : 'No pathway assigned') + '</div>' +
      '</button>' +
      '<button class="qa-btn" onclick="switchTab(\'lessons\')" aria-label="Open Lessons">' +
        '<div class="qa-icon">&#x1F393;</div><div class="qa-label">Lessons</div>' +
        '<div class="qa-desc">' + totalLessons + '/15 lessons complete</div>' +
      '</button>' +
      '<button class="qa-btn" onclick="switchTab(\'safety\')" aria-label="Safety Checks">' +
        '<div class="qa-icon">&#x1F9BA;</div><div class="qa-label">Safety Checks</div>' +
        '<div class="qa-desc">' + ackDone + '/' + (ackTotal||'--') + ' acknowledged</div>' +
      '</button>' +
      '<button class="qa-btn" onclick="switchTab(\'progress\')" aria-label="My Progress">' +
        '<div class="qa-icon">&#x1F4C8;</div><div class="qa-label">My Progress</div>' +
        '<div class="qa-desc">' + pathPct + '% pathway complete</div>' +
      '</button>' +
    '</div>' +
    '<div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:14px;margin:12px 0">' +
      '<div style="font-size:11px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">&#x1F4A1; Training Tip</div>' +
      '<div style="font-size:13px;color:var(--text);line-height:1.6">' + insight + '</div>' +
    '</div>' +
    (emp && emp.isDemo ? '<div style="font-size:11px;color:var(--muted);background:rgba(201,168,76,.07);border:1px solid rgba(201,168,76,.2);border-radius:var(--rs);padding:8px 12px;margin-bottom:12px">&#x1F3AD; Demo employee profile &mdash; Demo Mode shows the product. Live Mode runs the product.</div>' : '') +
    '<div class="safety-notice"><div style="font-weight:700;margin-bottom:4px">&#x26A0;&#xFE0F; Training Notice</div>' +
    '<div>AutoSkill OS&#x2122; supports your learning between supervisor sessions. For on-site emergencies, follow your site emergency procedure immediately.</div></div>';
}

// ── CHECK-IN ─────────────────────────────────────────────
function renderCheckin() { /* preserved for compatibility — tab replaced in Run 4 */ }
function buildCheckinHTML() { return ''; }
function wireScales() {}
function wireCopingTags() {}
function updateCiProgress(step) {}
function pickMood(btn) {}
function ynPick(key, val) {}
function ciNext(step) {}
function ciBack(step) {}

function submitCheckin() {
  // Lightweight Run 4 training check-in — saves a simple work-readiness record locally
  var emp = getPwaActiveEmployeeByMode ? getPwaActiveEmployeeByMode() : getActiveEmployee();
  var record = {
    date: new Date().toISOString(),
    employeeId: emp ? emp.id : null,
    type: 'training_checkin',
    source: 'employee-pwa',
    isDemo: dmGet('4p3x_demo_mode', true)
  };
  checkins.unshift(record);
  sSet('ap3x_patient_checkins', checkins);
  lastCIDate = new Date().toDateString();
  sSet('ap3x_last_checkin_date', lastCIDate);
  streak = (streak || 0) + 1;
  sSet('ap3x_streak', streak);
  xp += 10;
  sSet('ap3x_xp', xp);
  tlEnqueueSync('training_checkin', record);
  showToast('+10 XP — Training check-in recorded ✓');
  updateHeader();
  renderHome();
  renderProgress();
}

function showCheckinResult(record, risk) { /* legacy stub */ }
function calcRisk(d) { return 'LOW'; }

// ── LESSONS ───────────────────────────────────────────────────────
function renderLessons() {
  const existing = document.getElementById('lesson-detail-panel');
  if (existing) existing.remove();
  document.getElementById('tab-lessons').innerHTML = `
    <div class="section-title">Manufacturing Training Pathway</div>
    <div class="section-sub">3 modules  &middot;  15 guided support lessons</div>
    ${CURRICULUM.map(mod => {
      const done = mod.lessons.filter(l => lessonDone[l.id]).length;
      const pct  = Math.round((done / mod.lessons.length) * 100);
      return '<div class="module-card">'
        + '<div class="module-hdr"><div class="mod-icon">' + mod.icon + '</div>'
        + '<div><div class="mod-name">' + mod.name + '</div>'
        + '<div style="font-size:11px;color:var(--muted);margin-top:2px">' + done + '/' + mod.lessons.length + ' complete  &middot;  ' + pct + '%</div></div></div>'
        + '<div class="mod-prog"><div class="mod-prog-bar" style="width:' + pct + '%;background:' + mod.color + '"></div></div>'
        + mod.lessons.map(l =>
            '<div class="lesson-item" onclick="openLesson(\'' + l.id + '\',' + l.xp + ')" role="button" tabindex="0" style="cursor:pointer">'
            + '<div class="lesson-info"><div class="lesson-name">' + l.name + '</div>'
            + '<div class="lesson-desc">' + l.desc + '</div></div>'
            + '<button class="lesson-check ' + (lessonDone[l.id] ? 'done' : '') + '"'
            + ' onclick="event.stopPropagation();toggleLesson(\'' + l.id + '\',' + l.xp + ')"'
            + ' title="' + (lessonDone[l.id] ? 'Mark incomplete' : 'Mark complete') + '">'
            + (lessonDone[l.id] ? '\u2713' : '') + '</button>'
            + '</div>'
          ).join('')
        + '</div>';
    }).join('')}`;
}

function toggleLesson(id, xpVal) {
  if (lessonDone[id]) { delete lessonDone[id]; }
  else { lessonDone[id] = Date.now(); xp += xpVal; sSet('ap3x_xp', xp); showToast('+' + xpVal + ' XP \u2014 Lesson complete! \u2713'); }
  sSet('ap3x_lesson_progress', lessonDone);
  renderLessons(); renderProgress(); updateHeader();
}

function openLesson(id, xpVal) {
  var lc = LESSON_CONTENT[id];
  // ── Run 7: Queue lesson_started event ─────────────────────────
  try { queueLessonStarted(id); } catch(e) {}
  if (!lc) { showToast('Lesson content loading\u2026'); return; }
  var noteKey = 'tl_lesson_note_' + id;
  var savedNote = sGet(noteKey, '');
  var isDone = !!lessonDone[id];
  var panel = document.createElement('div');
  panel.id = 'lesson-detail-panel';
  panel.style.cssText = 'position:fixed;inset:0;background:var(--bg);z-index:200;overflow-y:auto;animation:slideUp .22s ease';

  var goalsHTML = lc.learningGoals.map(function(g) {
    return '<div style="font-size:13px;padding:8px 12px;background:var(--surface);border-radius:var(--rs);margin-bottom:6px;border:1px solid var(--border);display:flex;align-items:flex-start;gap:8px;line-height:1.5"><span style="color:var(--gold);font-size:10px;margin-top:3px;flex-shrink:0">\u2726</span>' + g + '</div>';
  }).join('');

  var sectionsHTML = lc.sections.map(function(s) {
    return '<div style="margin-bottom:18px"><div style="font-size:14px;font-weight:700;margin-bottom:6px">' + s.heading + '</div><div style="font-size:14px;color:var(--text);line-height:1.75;background:var(--surface);padding:12px 14px;border-radius:var(--rs);border:1px solid var(--border)">' + s.body + '</div></div>';
  }).join('');

  panel.innerHTML =
    '<div style="position:sticky;top:0;background:var(--surface);border-bottom:1.5px solid var(--border);padding:12px 16px;display:flex;align-items:center;gap:10px;z-index:10">'
    + '<button onclick="closeLessonDetail()" style="background:none;border:none;font-size:22px;cursor:pointer;color:var(--text);padding:4px;line-height:1;flex-shrink:0" aria-label="Back">\u2190</button>'
    + '<div style="flex:1"><div style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;font-weight:600">' + lc.moduleTitle + '</div>'
    + '<div style="font-size:15px;font-weight:800;line-height:1.3">' + lc.title + '</div></div></div>'
    + '<div style="padding:16px 16px 120px">'
    + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap" id="ld-meta-row">'
    + '<span style="font-size:12px;color:var(--gold);background:var(--gold-xl);padding:4px 10px;border-radius:99px;border:1px solid var(--gold-d);font-weight:700">Lesson ' + lc.lessonNumber + ' of 15</span>'
    + '<span style="font-size:12px;color:var(--muted);background:var(--surface2);padding:4px 10px;border-radius:99px;border:1px solid var(--border)">\u23f1 ' + lc.estimatedTime + '</span>'
    + (isDone ? '<span style="font-size:11px;padding:3px 10px;border-radius:99px;background:rgba(34,197,94,.15);color:var(--green);font-weight:700">\u2713 Completed</span>' : '')
    + '</div>'
    + '<div style="font-size:14px;color:var(--text);line-height:1.7;margin-bottom:20px;padding:14px;background:var(--surface);border-radius:var(--r);border-left:4px solid var(--gold)">' + lc.summary + '</div>'
    + '<div style="margin-bottom:20px"><div style="font-size:13px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">What you will learn</div>' + goalsHTML + '</div>'
    + sectionsHTML
    + '<div style="background:var(--surface);border-radius:var(--r);padding:14px;margin-bottom:14px;border:1px solid var(--border)"><div style="font-size:12px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">\ud83d\udcad Reflection</div><div style="font-size:14px;line-height:1.7">' + lc.reflectionPrompt + '</div></div>'
    + '<div style="background:var(--surface);border-radius:var(--r);padding:14px;margin-bottom:14px;border:1px solid var(--border)"><div style="font-size:12px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">\u270f\ufe0f Your Exercise</div><div style="font-size:14px;line-height:1.7;margin-bottom:10px">' + lc.patientExercise + '</div>'
    + '<textarea id="ld-note-field" style="width:100%;background:var(--surface2);border:1.5px solid var(--border);border-radius:var(--rs);padding:10px 12px;font-size:13px;color:var(--text);font-family:inherit;resize:none;min-height:60px;outline:none" placeholder="Write your reflection or notes here\u2026" rows="3">' + savedNote + '</textarea></div>'
    + '<div style="background:rgba(239,68,68,.06);border:1.5px solid rgba(239,68,68,.2);border-radius:var(--r);padding:14px;margin-bottom:14px"><div style="font-size:12px;font-weight:700;color:var(--high);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">\u26a0\ufe0f Safety Notice</div><div style="font-size:12px;color:var(--muted);line-height:1.6">' + lc.safetyNote + '</div></div>'
    + (lc.checkpoint ? '<div class="chk-container">' + buildCheckpointHTML(lc.checkpoint, id) + '</div>' : '')
    + '</div>'
    + '<div id="ld-complete-bar" style="position:fixed;bottom:0;left:0;right:0;padding:14px 16px;background:var(--surface);border-top:1.5px solid var(--border);box-shadow:0 -4px 16px rgba(0,0,0,.3);z-index:20;max-width:480px;margin:0 auto">'
    + '<button id="ld-complete-btn" onclick="completeLessonFromDetail(\'' + id + '\',' + xpVal + ')" style="width:100%;padding:14px;background:' + (isDone ? 'var(--green)' : 'var(--gold)') + ';color:#000;border:none;border-radius:var(--r);font-size:15px;font-weight:700;cursor:pointer">'
    + (isDone ? '\u2713 ' + lc.completionLabel : lc.completionLabel)
    + '</button></div>';

  document.body.appendChild(panel);
  panel.scrollTop = 0;
}


// ── CHECKPOINT RENDERER (Run 5) ───────────────────────────────────
function buildCheckpointHTML(cp, lessonId) {
  if (!cp) return '';
  var answeredKey = 'ap3x_chk_ans_' + lessonId;
  var saved = sGet(answeredKey, null);
  var isCorrect = saved && saved.answer === cp.correctAnswer;
  var optionsHTML = cp.options.map(function(opt, i) {
    var isSelected = saved && saved.answer === opt;
    var isRight    = opt === cp.correctAnswer;
    var bg = isSelected ? (isCorrect ? 'rgba(34,197,94,.15)' : 'rgba(239,68,68,.12)') : 'var(--surface2)';
    var border = isSelected ? (isCorrect ? 'rgba(34,197,94,.4)' : 'rgba(239,68,68,.35)') : 'var(--border)';
    var prefix = saved ? (isRight ? '\u2713 ' : (isSelected ? '\u2717 ' : '')) : '';
    return '<div style="margin-bottom:8px">' +
      '<button data-lesson="' + lessonId + '" data-opt="' + i + '" data-answer="' + opt.replace(/"/g, '&quot;') + '" ' +
      'onclick="submitCheckpointAnswer(this)" ' +
      'style="width:100%;text-align:left;padding:10px 12px;background:' + bg + ';border:1.5px solid ' + border + ';' +
      'border-radius:var(--rs);font-size:13px;color:var(--text);cursor:' + (saved ? 'default' : 'pointer') + ';' +
      'font-family:inherit;line-height:1.4;transition:background .15s" ' +
      (saved ? 'disabled' : '') + '>' + prefix + opt + '</button></div>';
  }).join('');

  return '<div style="background:var(--surface);border:1.5px solid ' + (saved ? (isCorrect ? 'rgba(34,197,94,.4)' : 'rgba(239,68,68,.3)') : 'var(--gold-d)') + ';' +
    'border-radius:var(--r);padding:14px;margin-bottom:14px">' +
    '<div style="font-size:12px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">' +
    (cp.safetyCritical ? '\u26a0\ufe0f ' : '\u2753 ') + 'Skill Checkpoint</div>' +
    '<div style="font-size:14px;font-weight:600;margin-bottom:12px;line-height:1.5">' + cp.question + '</div>' +
    optionsHTML +
    (saved
      ? '<div style="margin-top:10px;font-size:12px;color:' + (isCorrect ? 'var(--green)' : 'var(--high)') + ';font-weight:700">' +
        (isCorrect ? '\u2713 Correct ' : '\u2717 Incorrect ') + '\u2014 ' + (cp.feedbackText || '') + '</div>'
      : '<div style="font-size:11px;color:var(--muted);margin-top:8px">Select your answer above to record it locally.</div>'
    ) +
  '</div>';
}

function submitCheckpointAnswer(btn) {
  var lessonId = btn.getAttribute('data-lesson');
  var answer   = btn.getAttribute('data-answer');
  if (!lessonId || !answer) return;

  var lc = LESSON_CONTENT[lessonId];
  if (!lc || !lc.checkpoint) return;
  var isCorrect = (answer === lc.checkpoint.correctAnswer);

  var answeredKey = 'ap3x_chk_ans_' + lessonId;
  var record = {
    lessonId: lessonId, answer: answer, isCorrect: isCorrect,
    answeredAt: new Date().toISOString(), attempts: (sGet(answeredKey, {attempts:0}).attempts || 0) + 1
  };
  sSet(answeredKey, record);

  // ── Run 7: Queue checkpoint_submitted sync event ──────────────
  queueCheckpointSubmitted(lessonId, answer, isCorrect, lc.checkpoint && lc.checkpoint.id || null);
  // Write to SSOT progress records
  createPwaProgressRecord({
    lessonId: lessonId, status: isCorrect ? 'checkpoint_passed' : 'checkpoint_failed',
    progressPercent: isCorrect ? 100 : 50, score: isCorrect ? 100 : 0
  });

  if (isCorrect && !lessonDone[lessonId]) {
    xp += 10; sSet('ap3x_xp', xp);
    showToast('+10 XP \u2014 Checkpoint correct! \u2713');
    updateHeader();
  } else if (!isCorrect) {
    showToast('\u26a0 Incorrect \u2014 review the lesson and try again.');
  }

  // Re-render checkpoint section in place
  var panel = document.getElementById('lesson-detail-panel');
  if (panel) {
    var chkOld = panel.querySelector('.chk-container');
    if (!chkOld) {
      // fallback: rebuild entire panel
      openLesson(lessonId, xp);
    } else {
      chkOld.outerHTML = '<div class="chk-container">' + buildCheckpointHTML(lc.checkpoint, lessonId) + '</div>';
    }
  }
}

function closeLessonDetail() {
  var panel = document.getElementById('lesson-detail-panel');
  if (!panel) return;
  var field = document.getElementById('ld-note-field');
  var btn = document.getElementById('ld-complete-btn');
  if (btn && field && field.value.trim()) {
    var oc = btn.getAttribute('onclick') || '';
    var m = oc.match(/completeLessonFromDetail\('([^']+)'/);
    if (m) sSet('tl_lesson_note_' + m[1], field.value.trim());
  }
  panel.remove();
}

function completeLessonFromDetail(id, xpVal) {
  var field = document.getElementById('ld-note-field');
  var noteText = field && field.value.trim() ? field.value.trim() : null;
  if (noteText) {
    sSet('tl_lesson_note_' + id, noteText);
    // Run 11: attempt live evidence record write
    if (typeof r11_syncPwaEvidenceSubmittedLive === 'function') {
      try { r11_syncPwaEvidenceSubmittedLive({ lessonId: id, noteText: noteText, type: 'lesson_note' }).catch(function(){}); } catch(e) {}
    }
  }
  if (!lessonDone[id]) {
    lessonDone[id] = Date.now();
    xp += xpVal;
    sSet('ap3x_xp', xp);
    showToast('+' + xpVal + ' XP \u2014 Lesson complete! \u2713');
  }
  sSet('ap3x_lesson_progress', lessonDone);
  // ── Run 7: Queue structured sync event for Control Dashboard ──────────────
  queueLessonCompleted(id, xpVal);
  // Legacy queue (backward compat)
  tlEnqueueSync('lesson_progress', { lessonId: id, completedAt: new Date().toISOString(), xpAwarded: xpVal });
  // Structured DM progress record
  createPwaProgressRecord({ lessonId: id, status: 'completed', progressPercent: 100, score: null });
  renderProgress(); updateHeader();
  var btn = document.getElementById('ld-complete-btn');
  var lc = LESSON_CONTENT[id];
  if (btn && lc) { btn.textContent = '\u2713 ' + lc.completionLabel; btn.style.background = 'var(--green)'; }
  renderLessons();
}

// ── SKILL ACTIONS (internal key: COPING, preserved for JS refs) ──────────────

// ── PATHWAY TAB ────────────────────────────────────────────────────
function renderPathway() {
  var el = document.getElementById('tab-pathway');
  if (!el) return;
  var demoOn = isPwaDemoMode ? isPwaDemoMode() : true;
  var emp    = getPwaActiveEmployeeByMode ? getPwaActiveEmployeeByMode() : getActiveEmployee();
  var pathways = emp ? getEmployeeAssignedPathways(emp) : [];
  var modules  = dmGetAll('ap3x_dm_process_modules');
  var lessons  = dmGetAll('ap3x_dm_process_lessons');

  if (!emp) {
    el.innerHTML =
      '<div class="section-title">My Training Pathway</div>' +
      '<div class="section-sub">Assigned training pathways and process modules</div>' +
      '<div style="padding:32px 16px;text-align:center;color:var(--muted)">' +
        '<div style="font-size:40px;margin-bottom:12px">&#x1F5FA;</div>' +
        '<div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:6px">No employee profile active</div>' +
        '<div style="font-size:13px;line-height:1.6">' + (isPwaDemoMode && isPwaDemoMode() ? 'Demo employee profiles appear when Demo Mode is active.' : 'Live Mode is active. Employee records and training assignments are loaded from the configured backend when available. If no live profile is found, ask a training manager to assign training. (Employee PWA live write-sync is completed in Run 11.)') + '</div>' +
      '</div>' +
      '<div class="safety-notice" style="margin:0 0 16px">Your progress is saved locally first. Employee PWA live write-sync is completed in Run 11. Local-first mode active until live sync is enabled.</div>';
    return;
  }

  var empPathHtml = pathways.length === 0
    ? '<div style="padding:20px;text-align:center;color:var(--muted);font-size:13px">No pathways assigned. Demo pathways appear when Demo Mode is active.</div>'
    : pathways.map(function(path) {
        var pathMods = modules.filter(function(m) { return m.pathwayId === path.id; });
        var compRate = emp.progressPercent || 0;
        var hasSafety = path.safetyCritical || pathMods.some(function(m) { return m.safetyCritical; });
        var bgColor = compRate >= 80 ? 'var(--green)' : compRate >= 40 ? 'var(--gold)' : 'var(--warn)';
        return '<div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:16px;margin-bottom:14px">' +
          '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:10px">' +
            '<div>' +
              '<div style="font-size:15px;font-weight:800;color:var(--text)">' + path.title + '</div>' +
              '<div style="font-size:12px;color:var(--muted);margin-top:2px">' + (path.estimatedDuration || '--') + ' &middot; ' + pathMods.length + ' module' + (pathMods.length !== 1 ? 's' : '') + '</div>' +
            '</div>' +
            (hasSafety ? '<span style="font-size:10px;background:rgba(239,68,68,.12);color:var(--high);border:1px solid rgba(239,68,68,.25);border-radius:99px;padding:2px 8px;flex-shrink:0">&#x26A0; Safety-critical</span>' : '') +
          '</div>' +
          '<div style="height:6px;background:var(--surface2);border-radius:99px;overflow:hidden;margin-bottom:8px">' +
            '<div style="height:100%;width:' + compRate + '%;background:' + bgColor + ';border-radius:99px;transition:width .3s"></div>' +
          '</div>' +
          '<div style="font-size:12px;color:var(--muted);margin-bottom:12px">' + compRate + '% complete</div>' +
          (pathMods.length > 0
            ? '<div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Modules</div>' +
              pathMods.map(function(mod) {
                var modLessons = lessons.filter(function(l) { return l.moduleId === mod.id; });
                return '<div style="background:var(--surface2);border-radius:var(--rs);padding:10px 12px;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;gap:8px">' +
                  '<div><div style="font-size:13px;font-weight:700">' + (mod.safetyCritical ? '&#x26A0; ' : '') + mod.title + '</div>' +
                  '<div style="font-size:11px;color:var(--muted);margin-top:2px">' + modLessons.length + ' lesson' + (modLessons.length !== 1 ? 's' : '') + (mod.estimatedDuration ? ' &middot; ' + mod.estimatedDuration : '') + '</div></div>' +
                  '<button onclick="switchTab(\'lessons\')" aria-label="Open lessons" style="font-size:11px;padding:5px 10px;background:var(--gold);color:#000;border:none;border-radius:99px;font-weight:700;cursor:pointer;white-space:nowrap">Open &#x2192;</button>' +
                '</div>';
              }).join('')
            : '<div style="font-size:12px;color:var(--muted);padding:8px 0">Module list will be expanded in Run 5.</div>'
          ) +
        '</div>';
      }).join('');

  el.innerHTML =
    '<div class="section-title">&#x1F5FA; My Training Pathway</div>' +
    '<div class="section-sub">Assigned pathways, modules, and progress</div>' +
    '<div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:14px;margin-bottom:14px">' +
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">' +
        '<div style="width:36px;height:36px;border-radius:50%;background:var(--gold);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#000;flex-shrink:0">' +
          emp.displayName.split(' ').map(function(w){return w[0];}).join('').slice(0,2).toUpperCase() +
        '</div>' +
        '<div>' +
          '<div style="font-size:14px;font-weight:700">' + emp.displayName + '</div>' +
          '<div style="font-size:12px;color:var(--muted)">' + emp.roleTitle + ' &middot; ' + (emp.departmentId||'').replace('dept-','').replace(/-/g,' ') + (emp.employeeNumber ? ' &middot; ' + emp.employeeNumber : '') + '</div>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
        '<span style="font-size:11px;background:var(--surface2);border:1px solid var(--border);border-radius:99px;padding:2px 10px;color:var(--text)">' + (emp.competencyStatus||'not_started').replace(/_/g,' ') + '</span>' +
        '<span style="font-size:11px;background:var(--surface2);border:1px solid var(--border);border-radius:99px;padding:2px 10px;color:var(--text)">' + (emp.syncStatus||'local') + '</span>' +
        (emp.isDemo ? '<span style="font-size:11px;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.2);border-radius:99px;padding:2px 10px;color:var(--gold)">Demo profile</span>' : '') +
      '</div>' +
    '</div>' +
    empPathHtml +
    '<div class="safety-notice" style="margin-top:4px">Your progress is saved locally first. Employee PWA live write-sync is completed in Run 11. Local-first mode active.</div>';
}

// ── SAFETY CHECKS TAB ──────────────────────────────────────────────
function renderSafetyChecks() {
  var el = document.getElementById('tab-safety');
  if (!el) return;
  var emp      = getActiveEmployee();
  var acks     = dmGetAll('ap3x_dm_safety_acks');
  var modules  = dmGetAll('ap3x_dm_process_modules');
  var lessons  = dmGetAll('ap3x_dm_process_lessons');

  var ackHtml = '';
  if (!acks.length) {
    ackHtml = '<div style="padding:24px;text-align:center;color:var(--muted);font-size:13px">' +
      '<div style="font-size:36px;margin-bottom:10px">&#x1F9BA;</div>' +
      '<div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:6px">No safety checks found</div>' +
      '<div>Safety acknowledgements appear when Demo Mode is active.</div></div>';
  } else {
    ackHtml = acks.map(function(ack) {
      var empId   = emp ? emp.id : null;
      var isDone  = empId && (ack.acknowledgedByEmployeeIds||[]).includes(empId);
      var mod     = modules.find(function(m) { return m.id === ack.linkedModuleId; });
      var les     = lessons.find(function(l) { return l.id === ack.linkedLessonId; });
      return '<div style="background:var(--surface);border:1px solid ' + (isDone ? 'rgba(34,197,94,.3)' : ack.legalCritical ? 'rgba(239,68,68,.3)' : 'var(--border)') + ';border-radius:var(--r);padding:14px;margin-bottom:12px;border-left:4px solid ' + (isDone ? 'var(--green)' : ack.legalCritical ? 'var(--high)' : 'var(--gold)') + '">' +
        '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:8px">' +
          '<div style="flex:1">' +
            '<div style="font-size:14px;font-weight:700">' + (ack.legalCritical ? '&#x26A0; ' : '') + ack.title + '</div>' +
            (ack.description ? '<div style="font-size:12px;color:var(--muted);margin-top:4px;line-height:1.5">' + ack.description + '</div>' : '') +
            (mod || les ? '<div style="font-size:11px;color:var(--muted);margin-top:6px">' + (mod ? 'Module: ' + mod.title : '') + (les ? ' &middot; Lesson: ' + les.title : '') + '</div>' : '') +
          '</div>' +
          '<div style="flex-shrink:0;display:flex;flex-direction:column;align-items:flex-end;gap:4px">' +
            (ack.legalCritical ? '<span style="font-size:10px;background:rgba(239,68,68,.12);color:var(--high);border:1px solid rgba(239,68,68,.25);border-radius:99px;padding:2px 8px">Legal-critical</span>' : '') +
            (isDone ? '<span style="font-size:11px;background:rgba(34,197,94,.12);color:var(--green);border:1px solid rgba(34,197,94,.3);border-radius:99px;padding:2px 10px;font-weight:700">&#x2713; Acknowledged</span>' : '') +
          '</div>' +
        '</div>' +
        (!isDone && empId
          ? '<button data-ack="' + ack.id + '" onclick="handleSafetyAck(this.getAttribute(\x27data-ack\x27))" aria-label="Acknowledge safety check" style="width:100%;padding:10px;background:var(--gold);color:#000;border:none;border-radius:var(--rs);font-size:13px;font-weight:700;cursor:pointer;margin-top:6px">&#x2713; Acknowledge &mdash; I confirm I have read and understood this requirement</button>'
          : (!empId ? '<div style="font-size:11px;color:var(--muted);margin-top:6px;padding:8px;background:var(--surface2);border-radius:var(--rs)">Log in as an employee to acknowledge safety checks.</div>' : '')
        ) +
      '</div>';
    }).join('');
  }

  el.innerHTML =
    '<div class="section-title">&#x1F9BA; Safety Checks</div>' +
    '<div class="section-sub">Required safety acknowledgements before production</div>' +
    '<div style="background:rgba(239,68,68,.07);border:1px solid rgba(239,68,68,.18);border-radius:var(--rs);padding:10px 14px;font-size:12px;color:var(--muted);line-height:1.6;margin-bottom:14px">' +
      'Safety acknowledgements support training awareness and supervisor review. They do not replace workplace safety procedures, legal duties, or qualified supervision.' +
    '</div>' +
    ackHtml +
    '<div style="margin-top:8px"><div class="section-title" style="margin-bottom:10px">&#x1F527; Skill Techniques</div>' +
    '<div class="section-sub" style="margin-bottom:12px">Quick-reference job skill practices</div>' +
    COPING.map(function(s) {
      return '<div class="coping-card">' +
        '<div class="coping-icon">' + s.icon + '</div>' +
        '<div class="coping-body">' +
          '<div class="coping-name">' + s.name + '</div>' +
          '<div class="coping-desc">' + s.desc + '</div>' +
          '<span class="coping-cat">' + s.cat + '</span>' +
          '<div style="margin-top:10px">' +
            '<button class="btn-sm ' + (copingUsed.includes(s.id) ? 'filled' : '') + '" data-skill="' + s.id + '" onclick="markSkillTechnique(this.dataset.skill)" aria-label="' + (copingUsed.includes(s.id) ? 'Technique logged' : 'Mark technique as practised') + '">' +
            (copingUsed.includes(s.id) ? '&#x2713; Practised today' : 'Mark as practised') + '</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('') +
    '</div>';
}

function handleSafetyAck(ackId) {
  var emp = getPwaActiveEmployeeByMode ? getPwaActiveEmployeeByMode() : getActiveEmployee();
  if (!emp) { showToast('No employee profile active'); return; }
  acknowledgeLocalSafetyItem(ackId, emp.id);
  // ── Run 7: Queue safety_acknowledged sync event ────────────────
  var acks = dmGetAll('ap3x_dm_safety_acks');
  var ack  = acks.filter(function(a) { return a.id === ackId; })[0] || {};
  queueSafetyAcknowledged(ackId, ack.title || ackId);
  showToast(r11_getLiveSyncStatusMessage ? r11_getLiveSyncStatusMessage('safety_acknowledged') : '✓ Safety acknowledgement queued for Dashboard review');
  renderSafetyChecks();
  updateHeader();
}

function markSkillTechnique(id) {
  if (!copingUsed.includes(id)) {
    copingUsed.push(id); xp += 5;
    sSet('ap3x_xp', xp);
    showToast('+5 XP — Skill technique logged ✓');
  }
  sSet('ap3x_coping_used', copingUsed);
  renderSafetyChecks(); updateHeader();
}

// Legacy stub preserved
function renderCoping() { renderSafetyChecks(); }
function markCoping(id) { markSkillTechnique(id); }

// ── PROGRESS ─────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────
// Run 7: Supervisor Review Request
// ─────────────────────────────────────────────────────────────────
function requestSupervisorReview() {
  var emp  = getPwaActiveEmployeeByMode ? getPwaActiveEmployeeByMode() : getActiveEmployee();
  var acks = dmGetAll('ap3x_dm_safety_acks');
  if (!emp) {
    showToast('⚠ No active employee profile. Enable Demo Mode or configure live employee.');
    return;
  }
  var ackDone  = acks.filter(function(a) { return (a.acknowledgedByEmployeeIds||[]).includes(emp.id); }).length;
  var totalL   = Object.values(lessonDone).filter(Boolean).length;
  // Create supervisor review record in SSOT
  var revId = 'rev_pwa_' + Date.now();
  try {
    var revs = dmGetAll('ap3x_dm_supervisor_reviews');
    revs.push({
      id:            revId,
      employeeId:    emp.id,
      employeeName:  emp.displayName || emp.id,
      pathwayId:     (emp.assignedPathwayIds || [])[0] || null,
      moduleId:      null,
      status:        'pending',
      requestedAt:   new Date().toISOString(),
      reviewedAt:    null,
      reviewedBy:    null,
      notes:         'Requested from Employee Learning PWA. Lessons: ' + totalL + '/15. Safety acks: ' + ackDone + '/' + acks.length + '.',
      completedXP:   xp,
      lessonsDone:   totalL,
      acksDone:      ackDone,
      isDemo:        isPwaDemoMode ? isPwaDemoMode() : true,
      source:        'employee-pwa'
    });
    sSet('ap3x_dm_supervisor_reviews', revs);
  } catch(e) {}
  // Queue sync event
  queueSupervisorReviewRequested(
    (emp.assignedPathwayIds || [])[0] || null,
    null,
    'Employee requested review after ' + Object.values(lessonDone).filter(Boolean).length + ' lessons completed.'
  );
  // Run 11: attempt live supervisor review write
  if (typeof r11_syncPwaSupervisorReviewRequestedLive === 'function') {
    try { r11_syncPwaSupervisorReviewRequestedLive({ reviewId: revId, emp: emp }).catch(function(){}); } catch(e) {}
  }
  showToast(r11_getLiveSyncStatusMessage ? r11_getLiveSyncStatusMessage('supervisor_review_requested') : '✓ Supervisor review request queued for Control Dashboard');
  renderProgress();
}

function renderProgress() {
  var el = document.getElementById('tab-progress');
  if (!el) return;
  var totalL  = Object.values(lessonDone).filter(Boolean).length;
  var emp     = getActiveEmployee();
  var acks    = dmGetAll('ap3x_dm_safety_acks');
  var reviews = dmGetAll('ap3x_dm_supervisor_reviews');
  var evidence= dmGetAll('ap3x_dm_evidence_records');
  var status  = getPwaLocalStatus();

  var ackDone  = emp ? acks.filter(function(a) { return (a.acknowledgedByEmployeeIds||[]).includes(emp.id); }).length : 0;
  var ackTotal = acks.length;
  var pendingRevs = emp ? reviews.filter(function(r) { return r.employeeId === emp.id && r.status === 'pending'; }).length : 0;
  var evidenceCount = emp ? evidence.filter(function(e) { return e.employeeId === emp.id; }).length : 0;
  var pathPct = emp ? (emp.progressPercent || Math.round((totalL / 15) * 100)) : Math.round((totalL / 15) * 100);
  var syncQ   = status.syncQueue;
  // Run 10: live data source label for progress view
  var r10mode = (window.r10_getActiveDataMode ? window.r10_getActiveDataMode() : (status.isDemo ? 'demo' : 'local'));
  var r10label= (window.r10_getActiveDataSourceLabel ? window.r10_getActiveDataSourceLabel() : (status.isDemo ? '🎭 Demo' : '🖥️ Local'));
  var r11liveStatus = (window.getPwaLiveSyncStatus ? window.getPwaLiveSyncStatus() : { statusLabel: r10mode === 'demo' ? 'Demo local' : 'Local fallback', statusClass: 'neutral' });
  var lastSaved = sGet('ap3x_last_checkin_date', null);

  el.innerHTML =
    '<div class="section-title">&#x1F4C8; My Progress</div>' +
    '<div style="font-size:11px;color:var(--muted);margin-bottom:14px;display:flex;align-items:center;gap:8px">' +
      '<span>Data source:</span>' +
      '<span style="background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:1px 8px;font-size:11px">' + r10label + '</span>' +
      (r10mode !== 'demo' ? '<span style="color:var(--muted)"> — Employee PWA live write-sync: Run 11</span>' : '') +
    '</div>' + +
    '<div class="section-sub">Your personal training journey at a glance</div>' +
    '<div class="prog-grid">' +
      '<div class="prog-stat"><div class="prog-val">' + totalL + '/15</div><div class="prog-lbl">Lessons Done</div></div>' +
      '<div class="prog-stat"><div class="prog-val">' + pathPct + '%</div><div class="prog-lbl">Pathway</div></div>' +
      '<div class="prog-stat"><div class="prog-val">' + ackDone + '/' + (ackTotal||'--') + '</div><div class="prog-lbl">Safety Acks</div></div>' +
      '<div class="prog-stat"><div class="prog-val">' + xp + '</div><div class="prog-lbl">Training XP</div></div>' +
    '</div>' +
    '<div class="prog-grid">' +
      '<div class="prog-stat"><div class="prog-val" style="font-size:20px">' + (pendingRevs||0) + '</div><div class="prog-lbl">Pending Reviews</div></div>' +
      '<div class="prog-stat"><div class="prog-val" style="font-size:20px">' + evidenceCount + '</div><div class="prog-lbl">Evidence Records</div></div>' +
      '<div class="prog-stat"><div class="prog-val" style="font-size:20px">' + streak + '</div><div class="prog-lbl">Day Streak</div></div>' +
      '<div class="prog-stat"><div class="prog-val" style="font-size:20px">' + syncQ + '</div><div class="prog-lbl">Queued Updates</div></div>' +
    '</div>' +
    '<div style="font-size:14px;font-weight:700;margin:16px 0 10px">&#x1F4DA; Lesson Progress</div>' +
    '<div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;margin-bottom:14px">' +
    [1,2,3].map(function(mId) {
      var mod = [
        {id:1,name:'Module 1 — Site Orientation',icon:'&#x1F331;',color:'#22c55e'},
        {id:2,name:'Module 2 — Quality Control',icon:'&#x1F3AF;',color:'#c9a84c'},
        {id:3,name:'Module 3 — Competency Assessment',icon:'&#x1F30D;',color:'#a855f7'}
      ][mId-1];
      var lessons_m = [
        ['m1l1','m1l2','m1l3','m1l4','m1l5'],
        ['m2l1','m2l2','m2l3','m2l4','m2l5'],
        ['m3l1','m3l2','m3l3','m3l4','m3l5']
      ][mId-1];
      var done = lessons_m.filter(function(id){return lessonDone[id];}).length;
      var pct  = Math.round((done/5)*100);
      return '<div style="padding:12px 14px;border-bottom:1px solid var(--border)">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">' +
          '<div style="font-size:13px;font-weight:700">' + mod.icon + ' ' + mod.name + '</div>' +
          '<div style="font-size:12px;color:var(--muted)">' + done + '/5</div>' +
        '</div>' +
        '<div style="height:5px;background:var(--surface2);border-radius:99px;overflow:hidden">' +
          '<div style="height:100%;width:' + pct + '%;background:' + mod.color + ';border-radius:99px"></div>' +
        '</div>' +
      '</div>';
    }).join('') + '</div>' +
    (function() {
      var sqStats = getPwaSyncQueueStats ? getPwaSyncQueueStats() : { total:0, queued:0, processed:0, failed:0, safetyCritical:0 };
      var lastQ   = sGet('ap3x_last_queue_at', null);
      var lastQStr= lastQ ? new Date(lastQ).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) : 'Never';
      return '<div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:14px;margin-bottom:14px">' +
        '<div style="font-size:12px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">&#x1F4BE; Sync Queue Status &mdash; ' + (demoOn ? '&#x1F3AD; Demo' : '&#x1F7E2; Live') + '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px">' +
          [['Queued', sqStats.queued], ['Processed', sqStats.processed], ['Failed', sqStats.failed]].map(function(p) {
            return '<div style="text-align:center;padding:6px;background:var(--surface2);border-radius:var(--rs);border:1px solid var(--border)">' +
              '<div style="font-size:16px;font-weight:700">' + p[1] + '</div>' +
              '<div style="font-size:10px;color:var(--muted)">' + p[0] + '</div></div>';
          }).join('') +
        '</div>' +
        '<div style="font-size:12px;line-height:1.8;color:var(--muted)">' +
          (sqStats.queued > 0 ? '&#x1F504; ' + sqStats.queued + ' update(s) queued for Control Dashboard review<br>' : '&#x2713; No pending queue items<br>') +
          (sqStats.safetyCritical > 0 ? '&#x26A0;&#xFE0F; ' + sqStats.safetyCritical + ' safety-critical update(s) in queue<br>' : '') +
          'Last queued: ' + lastQStr + '<br>' +
          'Progress saved locally. Dashboard queue prepared.<br>' +
          '<span style="color:var(--muted)">Remote backend not connected. Configure a live backend in Settings when ready.</span>' +
        '</div>' +
      '</div>';
    })() +
    '<div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--rs);padding:10px 14px;margin-bottom:10px;display:flex;align-items:center;gap:10px">' +
    '<span style="font-size:18px">&#x1F4F2;</span>' +
    '<div style="flex:1">' +
      '<div style="font-size:12px;font-weight:700;color:var(--gold)">Install AutoSkill OS&#x2122;</div>' +
      '<div style="font-size:11px;color:var(--muted)">Tap your browser menu and select <strong>“Add to Home Screen”</strong> to install this app and use it offline.</div>' +
    '</div>' +
  '</div>' +
  '<button onclick="submitCheckin()" aria-label="Log training check-in" style="width:100%;padding:13px;background:var(--gold);color:#000;border:none;border-radius:var(--r);font-size:14px;font-weight:700;cursor:pointer;margin-bottom:10px">&#x1F4CB; Log Training Check-In (+10 XP)</button>' +
    '<button onclick="requestSupervisorReview()" aria-label="Request supervisor review" style="width:100%;padding:12px;background:rgba(201,168,76,.12);color:var(--gold);border:1.5px solid rgba(201,168,76,.3);border-radius:var(--r);font-size:13px;font-weight:700;cursor:pointer;margin-bottom:14px">&#x1F464; Request Supervisor Review — Queued Locally</button>' +
    '<div class="safety-notice">' +
      '<div style="font-weight:700;margin-bottom:4px">&#x26A0;&#xFE0F; AutoSkill OS&#x2122; Notice</div>' +
      '<div>AutoSkill OS&#x2122; supports training awareness, supervisor review, and evidence capture. It does not replace workplace safety procedures, legal duties, qualified supervision, or employer responsibility.</div>' +
    '</div>';
}

// ── Toast ─────────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 2800);
}

// ════════════════════════════════════════════════════════════════════════════
// AutoSkill OS™ — Run 10: PWA Data Mode Awareness Layer
// ────────────────────────────────────────────────────────────────────────────
// These helpers bridge the PWA with the Run 10 connector layer.
// The dashboard connector functions (r10_*) are available if loaded.
// PWA stays local-first — live sync comes in Run 11.

function pwa_r10_getDataMode() {
  if (window.r10_getActiveDataMode) return window.r10_getActiveDataMode();
  var demoOn = (typeof sGet === 'function') ? sGet('4p3x_demo_mode', true) : true;
  return demoOn ? 'demo' : 'live';
}

function pwa_r10_getDataSourceLabel() {
  if (window.r10_getActiveDataSourceLabel) return window.r10_getActiveDataSourceLabel();
  var mode = pwa_r10_getDataMode();
  return mode === 'demo' ? '🎭 Demo' : '🖥️ Local';
}

function pwa_r10_getStatusSummary() {
  var mode  = pwa_r10_getDataMode();
  var label = pwa_r10_getDataSourceLabel();
  var msgs = {
    demo:  'Demo Mode — local demo data active. Demo Mode shows the product. Live Mode runs the product.',
    live:  'Live Mode active. Employee PWA live write-sync is completed in Run 11. Progress saved locally until then.',
    local: 'Local-only mode. No remote backend active. AutoSkill OS™ remains local-first.'
  };
  return { mode: mode, label: label, message: msgs[mode] || msgs['local'] };
}

function pwa_r10_isLiveMode() { return pwa_r10_getDataMode() === 'live'; }
function pwa_r10_isDemoMode() { return pwa_r10_getDataMode() === 'demo'; }

// AutoSkill OS™ supports training awareness, supervisor review, and evidence
// capture. It does not replace workplace safety procedures, legal duties,
// qualified supervision, employer responsibility, or site-specific training.
// ════════════════════════════════════════════════════════════════════════════


// ════════════════════════════════════════════════════════════════════════════
// AutoSkill OS™ — Run 11: Employee PWA Live Sync
// ────────────────────────────────────────────────────────────────────────────
// Powered by 4P3X Intelligent AI™ — Created by Kyzel Kreates™
//
// ARCHITECTURE: Live write layer injected at end of PWA JS.
// Works alongside Run 10 connector (r10_*) and Run 7 local queue.
// Demo Mode → local queue only. Live Mode → Supabase anon client.
// Offline/failed → local fallback queue, honest status shown.
//
// SECURITY: 4P3X API Config Guard™. Anon key only. Never service role.
// ════════════════════════════════════════════════════════════════════════════

// ── R11.0: FAILED WRITE LOCAL QUEUE ─────────────────────────────────────────
// Stores items that failed to write to live backend for retry.

var R11_FAILED_QUEUE_KEY = 'ap3x_r11_failed_live_writes';
var R11_MAX_RETRY        = 3;

function r11_getFailedQueue() {
  try { return JSON.parse(localStorage.getItem(R11_FAILED_QUEUE_KEY) || '[]'); } catch(e) { return []; }
}

function r11_saveFailedQueue(q) {
  try { localStorage.setItem(R11_FAILED_QUEUE_KEY, JSON.stringify(q)); } catch(e) {}
}

function r11_queueFailedLiveSyncLocally(payload, errorMessage) {
  // Stores a failed live write for later retry.
  // Does NOT accept demo records.
  if (payload && payload.isDemo) return;
  var q    = r11_getFailedQueue();
  var item = {
    id:           payload.id || ('fail_' + Date.now() + '_' + Math.random().toString(36).slice(2,5)),
    eventType:    payload.eventType || 'unknown',
    payload:      payload,
    errorMessage: (errorMessage || '').substring(0, 200).replace(/eyJ[A-Za-z0-9_\-\.]{10,}/g,'[token_redacted]'),
    retryCount:   (payload.retryCount || 0),
    status:       'failed',
    failedAt:     new Date().toISOString(),
    updatedAt:    new Date().toISOString()
  };
  // De-duplicate by id
  q = q.filter(function(i) { return i.id !== item.id; });
  q.push(item);
  r11_saveFailedQueue(q);
}

function r11_markFailedItemSynced(itemId) {
  var q = r11_getFailedQueue().filter(function(i) { return i.id !== itemId; });
  r11_saveFailedQueue(q);
}

function r11_updateFailedItemRetry(itemId, error) {
  var q = r11_getFailedQueue().map(function(item) {
    if (item.id !== itemId) return item;
    return Object.assign({}, item, {
      retryCount:   (item.retryCount || 0) + 1,
      errorMessage: (error || '').substring(0, 200),
      updatedAt:    new Date().toISOString()
    });
  });
  r11_saveFailedQueue(q);
}

// ── R11.1: LIVE SYNC GUARDS ───────────────────────────────────────────────────

function r11_canWriteLive() {
  // Returns true only when: live mode + Supabase configured + SDK available
  if (isPwaDemoMode && isPwaDemoMode()) return false;
  if (window.r10_shouldUseRemoteBackend) return window.r10_shouldUseRemoteBackend();
  if (window.pwa_r10_isLiveMode && !window.pwa_r10_isLiveMode()) return false;
  // Check Supabase config directly
  if (typeof sGet !== 'function') return false;
  var bs = sGet('4p3x_backend_settings', null);
  if (!bs || bs.mode !== 'supabase') return false;
  var cfg = bs.supabase || {};
  return !!(cfg.url && cfg.anonKey && ['configured','connected','rls_required'].includes(cfg.status));
}

function r11_getSupabaseClientForPwa() {
  // Use Run 10's initialised client if available
  if (window.r10_getSupabaseClient) {
    var client = window.r10_getSupabaseClient();
    if (client) return client;
  }
  // Attempt direct init if window.supabase loaded and config present
  if (window.supabase && window.supabase.createClient) {
    var bs  = typeof sGet === 'function' ? sGet('4p3x_backend_settings', null) : null;
    var cfg = bs && bs.supabase;
    if (cfg && cfg.url && cfg.anonKey) {
      try { return window.supabase.createClient(cfg.url, cfg.anonKey, { auth: { persistSession: true } }); }
      catch(e) { return null; }
    }
  }
  return null;
}

function r11_buildLiveSyncQueuePayload(localItem) {
  // Maps local sync queue item to Supabase autoskill_sync_queue schema (Run 9)
  return {
    event_type:        localItem.eventType || 'unknown',
    source:            'employee-pwa',
    target:            'control-dashboard',
    employee_id:       localItem.employeeId    || null,
    pathway_id:        localItem.pathwayId     || null,
    module_id:         localItem.moduleId      || null,
    lesson_id:         localItem.lessonId      || null,
    checkpoint_id:     localItem.checkpointId  || null,
    acknowledgement_id:localItem.acknowledgementId || null,
    evidence_record_id:localItem.evidenceRecordId  || null,
    supervisor_review_id: localItem.supervisorReviewId || null,
    payload:           localItem.payload       || {},
    status:            'queued',
    priority:          localItem.priority      || 'normal',
    data_mode:         'live',
    is_demo:           false,
    local_device_id:   localItem.localDeviceId || ('pwa_' + (navigator.userAgent.length % 999)),
    provider:          'supabase',
    notes:             localItem.notes         || null,
    retry_count:       localItem.retryCount    || 0,
    error_message:     null
  };
}

// ── R11.2: CORE LIVE WRITE FUNCTION ──────────────────────────────────────────

async function r11_writeLiveSyncQueueEvent(localItem) {
  // Returns { ok: bool, remoteId: string|null, error: string|null }
  if (!r11_canWriteLive()) {
    return { ok: false, reason: 'not_live', error: null };
  }
  var client = r11_getSupabaseClientForPwa();
  if (!client) {
    return { ok: false, reason: 'no_client', error: 'Supabase client not initialised.' };
  }
  // Guard: never write demo items to live backend
  if (localItem.isDemo || localItem.dataMode === 'demo') {
    return { ok: false, reason: 'demo_record', error: null };
  }
  try {
    var row    = r11_buildLiveSyncQueuePayload(localItem);
    var result = await client.from('autoskill_sync_queue').insert(row).select('id').single();
    if (result.error) {
      var errMsg = result.error.message || JSON.stringify(result.error).substring(0, 150);
      // Guard: never log or return secret-looking values
      errMsg = errMsg.replace(/eyJ[A-Za-z0-9_\-\.]{10,}/g, '[token_redacted]');
      return { ok: false, reason: result.status === 401 ? 'rls_blocked' : 'insert_failed', error: errMsg };
    }
    return { ok: true, remoteId: result.data && result.data.id || null, error: null };
  } catch(e) {
    var msg = e.message || 'Unknown error';
    if (msg.includes('service_role')) msg = 'Auth error — check anon key configuration.';
    return { ok: false, reason: 'exception', error: msg.substring(0, 200) };
  }
}

async function r11_writeLiveProgressRecord(payload) {
  if (!r11_canWriteLive()) return { ok: false, reason: 'not_live' };
  var client = r11_getSupabaseClientForPwa();
  if (!client) return { ok: false, reason: 'no_client', error: 'Client not ready.' };
  if (payload.isDemo) return { ok: false, reason: 'demo_record' };
  try {
    var result = await client.from('autoskill_progress_records').upsert({
      employee_id:       payload.employeeId       || null,
      pathway_id:        payload.pathwayId        || null,
      module_id:         payload.moduleId         || null,
      lesson_id:         payload.lessonId         || null,
      status:            payload.status           || 'completed',
      progress_percent:  payload.progressPercent  !== undefined ? payload.progressPercent : 100,
      score:             payload.score            !== undefined ? payload.score : null,
      time_spent_minutes:payload.timeSpentMinutes || 0,
      completed_at:      payload.completedAt      || new Date().toISOString(),
      source:            'employee-pwa',
      sync_status:       'synced',
      is_demo:           false,
      data_mode:         'live',
      updated_at:        new Date().toISOString()
    });
    if (result.error) {
      return { ok: false, reason: 'upsert_failed', error: (result.error.message || '').substring(0,150) };
    }
    return { ok: true };
  } catch(e) { return { ok: false, reason: 'exception', error: e.message }; }
}

async function r11_writeLiveCheckpointSubmission(payload) {
  if (!r11_canWriteLive()) return { ok: false, reason: 'not_live' };
  var client = r11_getSupabaseClientForPwa();
  if (!client) return { ok: false, reason: 'no_client', error: 'Client not ready.' };
  if (payload.isDemo) return { ok: false, reason: 'demo_record' };
  try {
    var result = await client.from('autoskill_checkpoint_submissions').insert({
      employee_id:   payload.employeeId    || null,
      checkpoint_id: payload.checkpointId  || null,
      pathway_id:    payload.pathwayId     || null,
      module_id:     payload.moduleId      || null,
      lesson_id:     payload.lessonId      || null,
      answer:        payload.answer        || {},
      is_correct:    payload.isCorrect     !== undefined ? payload.isCorrect : null,
      status:        'completed',
      submitted_at:  new Date().toISOString(),
      source:        'employee-pwa',
      sync_status:   'synced',
      is_demo:       false,
      data_mode:     'live'
    });
    if (result.error) return { ok: false, reason: 'insert_failed', error: (result.error.message||'').substring(0,150) };
    return { ok: true };
  } catch(e) { return { ok: false, reason: 'exception', error: e.message }; }
}

async function r11_writeLiveSafetyAcknowledgement(payload) {
  if (!r11_canWriteLive()) return { ok: false, reason: 'not_live' };
  var client = r11_getSupabaseClientForPwa();
  if (!client) return { ok: false, reason: 'no_client', error: 'Client not ready.' };
  if (payload.isDemo) return { ok: false, reason: 'demo_record' };
  try {
    var result = await client.from('autoskill_employee_safety_acknowledgements').upsert({
      employee_id:        payload.employeeId       || null,
      acknowledgement_id: payload.acknowledgementId|| null,
      pathway_id:         payload.pathwayId        || null,
      module_id:          payload.moduleId         || null,
      lesson_id:          payload.lessonId         || null,
      acknowledged_text:  payload.acknowledgedText || 'Confirmed',
      acknowledged_at:    new Date().toISOString(),
      source:             'employee-pwa',
      sync_status:        'synced',
      is_demo:            false,
      data_mode:          'live'
    });
    if (result.error) return { ok: false, reason: 'upsert_failed', error: (result.error.message||'').substring(0,150) };
    return { ok: true };
  } catch(e) { return { ok: false, reason: 'exception', error: e.message }; }
}

async function r11_writeLiveEvidenceRecord(payload) {
  if (!r11_canWriteLive()) return { ok: false, reason: 'not_live' };
  var client = r11_getSupabaseClientForPwa();
  if (!client) return { ok: false, reason: 'no_client', error: 'Client not ready.' };
  if (payload.isDemo) return { ok: false, reason: 'demo_record' };
  try {
    var result = await client.from('autoskill_evidence_records').insert({
      employee_id:   payload.employeeId  || null,
      pathway_id:    payload.pathwayId   || null,
      module_id:     payload.moduleId    || null,
      lesson_id:     payload.lessonId    || null,
      evidence_type: payload.type        || 'lesson_note',
      title:         payload.title       || 'Training note',
      description:   payload.noteText    || payload.description || '',
      submitted_at:  new Date().toISOString(),
      source:        'employee-pwa',
      sync_status:   'synced',
      is_demo:       false,
      data_mode:     'live'
    });
    if (result.error) return { ok: false, reason: 'insert_failed', error: (result.error.message||'').substring(0,150) };
    return { ok: true };
  } catch(e) { return { ok: false, reason: 'exception', error: e.message }; }
}

async function r11_writeLiveSupervisorReview(payload) {
  if (!r11_canWriteLive()) return { ok: false, reason: 'not_live' };
  var client = r11_getSupabaseClientForPwa();
  if (!client) return { ok: false, reason: 'no_client', error: 'Client not ready.' };
  if (payload.isDemo) return { ok: false, reason: 'demo_record' };
  try {
    var result = await client.from('autoskill_supervisor_reviews').insert({
      employee_id:     payload.employeeId  || null,
      reviewer_id:     null,  // awaits supervisor assignment
      pathway_id:      payload.pathwayId   || null,
      module_id:       payload.moduleId    || null,
      status:          'pending',
      notes:           payload.notes       || null,
      requested_at:    new Date().toISOString(),
      source:          'employee-pwa',
      sync_status:     'synced',
      is_demo:         false,
      data_mode:       'live'
    });
    if (result.error) return { ok: false, reason: 'insert_failed', error: (result.error.message||'').substring(0,150) };
    return { ok: true, remoteId: result.data && result.data[0] && result.data[0].id || null };
  } catch(e) { return { ok: false, reason: 'exception', error: e.message }; }
}

// ── R11.3: HIGH-LEVEL SYNC FUNCTIONS ─────────────────────────────────────────
// Called from patched Run 7 queue functions above.
// Each: writes queue event + specific record, handles fallback.

async function r11_syncPwaLessonStartedLive(localItem) {
  if (!r11_canWriteLive()) return;
  var result = await r11_writeLiveSyncQueueEvent(localItem);
  if (!result.ok) {
    if (result.reason !== 'not_live' && result.reason !== 'demo_record') {
      r11_queueFailedLiveSyncLocally(localItem, result.error || result.reason);
      r11_showPwaSyncToast('started', false, result.reason);
    }
    return;
  }
  // Mark local item as remote-synced
  r11_markLocalItemSynced(localItem.id, result.remoteId);
  r11_showPwaSyncToast('started', true, null);
}

async function r11_syncPwaLessonCompletedLive(localItem) {
  if (!r11_canWriteLive()) return;
  // 1. Write sync queue event
  var qResult = await r11_writeLiveSyncQueueEvent(localItem);
  // 2. Write progress record
  var emp = getPwaActiveEmployeeByMode ? getPwaActiveEmployeeByMode() : null;
  var pResult = await r11_writeLiveProgressRecord({
    employeeId:      emp && emp.id || localItem.employeeId,
    pathwayId:       localItem.pathwayId,
    moduleId:        localItem.moduleId,
    lessonId:        localItem.lessonId,
    status:          'completed',
    progressPercent: 100,
    score:           localItem.payload && localItem.payload.score !== undefined ? localItem.payload.score : null,
    completedAt:     localItem.payload && localItem.payload.completedAt || new Date().toISOString(),
    isDemo:          false
  });
  var ok = qResult.ok || pResult.ok;
  if (ok) {
    r11_markLocalItemSynced(localItem.id, qResult.remoteId);
    r11_showPwaSyncToast('completed', true, null);
  } else {
    r11_queueFailedLiveSyncLocally(localItem, qResult.error || pResult.error || 'Write failed');
    r11_showPwaSyncToast('completed', false, qResult.reason || pResult.reason);
  }
}

async function r11_syncPwaCheckpointSubmittedLive(localItem) {
  if (!r11_canWriteLive()) return;
  var payload = localItem.payload || {};
  var emp     = getPwaActiveEmployeeByMode ? getPwaActiveEmployeeByMode() : null;
  var qResult = await r11_writeLiveSyncQueueEvent(localItem);
  var cResult = await r11_writeLiveCheckpointSubmission({
    employeeId:   emp && emp.id || localItem.employeeId,
    checkpointId: localItem.checkpointId,
    pathwayId:    localItem.pathwayId,
    moduleId:     localItem.moduleId,
    lessonId:     localItem.lessonId,
    answer:       { answer: payload.answer, question: payload.question },
    isCorrect:    payload.isCorrect !== undefined ? payload.isCorrect : null,
    isDemo:       false
  });
  var ok = qResult.ok || cResult.ok;
  if (ok) {
    r11_markLocalItemSynced(localItem.id, qResult.remoteId);
    r11_showPwaSyncToast('checkpoint', true, null);
  } else {
    r11_queueFailedLiveSyncLocally(localItem, qResult.error || cResult.error || 'Checkpoint write failed');
    r11_showPwaSyncToast('checkpoint', false, qResult.reason || cResult.reason);
  }
}

async function r11_syncPwaSafetyAcknowledgedLive(localItem) {
  if (!r11_canWriteLive()) return;
  var payload = localItem.payload || {};
  var emp     = getPwaActiveEmployeeByMode ? getPwaActiveEmployeeByMode() : null;
  var qResult = await r11_writeLiveSyncQueueEvent(localItem);
  var aResult = await r11_writeLiveSafetyAcknowledgement({
    employeeId:        emp && emp.id || payload.employeeId,
    acknowledgementId: localItem.acknowledgementId || payload.ackId,
    pathwayId:         localItem.pathwayId,
    moduleId:          localItem.moduleId,
    lessonId:          localItem.lessonId,
    acknowledgedText:  'I confirm I have read and understood this requirement',
    isDemo:            false
  });
  var ok = qResult.ok || aResult.ok;
  if (ok) {
    r11_markLocalItemSynced(localItem.id, qResult.remoteId);
    r11_showPwaSyncToast('safety', true, null);
  } else {
    r11_queueFailedLiveSyncLocally(localItem, qResult.error || aResult.error || 'Safety ack write failed');
    r11_showPwaSyncToast('safety', false, qResult.reason || aResult.reason);
  }
}

async function r11_syncPwaEvidenceSubmittedLive(payload) {
  if (!r11_canWriteLive()) return;
  var emp     = getPwaActiveEmployeeByMode ? getPwaActiveEmployeeByMode() : null;
  var eResult = await r11_writeLiveEvidenceRecord({
    employeeId:  emp && emp.id || null,
    lessonId:    payload.lessonId,
    type:        payload.type || 'lesson_note',
    title:       'Training note — ' + (payload.lessonId || ''),
    noteText:    payload.noteText,
    isDemo:      false
  });
  if (eResult.ok) {
    // also write a sync queue event for dashboard visibility
    var emp2 = emp || {};
    var qItem = createSyncQueueItem({
      eventType: 'evidence_submitted',
      lessonId:  payload.lessonId,
      payload:   { type: payload.type || 'lesson_note', hasNote: !!payload.noteText },
      priority:  'normal'
    });
    r11_writeLiveSyncQueueEvent(qItem).catch(function(){});
    r11_showPwaSyncToast('note', true, null);
  } else {
    r11_showPwaSyncToast('note', false, eResult.reason);
  }
}

async function r11_syncPwaSupervisorReviewRequestedLive(opts) {
  if (!r11_canWriteLive()) return;
  var emp    = opts.emp || (getPwaActiveEmployeeByMode ? getPwaActiveEmployeeByMode() : null);
  var revResult = await r11_writeLiveSupervisorReview({
    employeeId: emp && emp.id || null,
    pathwayId:  emp && emp.assignedPathwayIds && emp.assignedPathwayIds[0] || null,
    notes:      'Employee requested review via PWA',
    isDemo:     false
  });
  var qItem = createSyncQueueItem({
    eventType:         'supervisor_review_requested',
    supervisorReviewId: revResult.ok ? revResult.remoteId : null,
    payload:           { employeeId: emp && emp.id, requestedAt: new Date().toISOString(), remoteReviewId: revResult.remoteId || null },
    priority:          'high'
  });
  r11_writeLiveSyncQueueEvent(qItem).catch(function(){});
  if (revResult.ok) {
    r11_showPwaSyncToast('review', true, null);
  } else {
    r11_queueFailedLiveSyncLocally(qItem, revResult.error || 'Review write failed');
    r11_showPwaSyncToast('review', false, revResult.reason);
  }
}

// ── R11.4: LOCAL ITEM SYNC STATUS UPDATE ─────────────────────────────────────

function r11_markLocalItemSynced(localId, remoteId) {
  // Marks a local sync queue item as remote_synced
  try {
    var q = dmGet(AP3X_SYNC_QUEUE_KEY, []);
    q = q.map(function(item) {
      if (item.id !== localId) return item;
      return Object.assign({}, item, {
        status:    'remote_synced',
        remoteId:  remoteId || null,
        updatedAt: new Date().toISOString(),
        syncedAt:  new Date().toISOString()
      });
    });
    sSet(AP3X_SYNC_QUEUE_KEY, q);
  } catch(e) {}
}

// ── R11.5: STATUS HELPERS ─────────────────────────────────────────────────────

function getPwaLiveSyncStatus() {
  // Returns current live sync status for UI display
  if (isPwaDemoMode && isPwaDemoMode()) {
    return { statusLabel: 'Demo local', statusClass: 'demo', statusEmoji: '🎭',
             message: 'Demo Mode — local demo data only. Demo Mode shows the product. Live Mode runs the product.' };
  }
  if (!r11_canWriteLive()) {
    var bs = typeof sGet === 'function' ? sGet('4p3x_backend_settings', null) : null;
    if (!bs || bs.mode === 'local') {
      return { statusLabel: 'Local fallback', statusClass: 'local', statusEmoji: '🖥️',
               message: 'Local-only mode. AutoSkill OS™ remains local-first until a live backend is configured.' };
    }
    var cfg = bs[bs.mode] || {};
    if (cfg.status === 'rls_required' || cfg.status === 'auth_required') {
      return { statusLabel: 'Auth required', statusClass: 'auth', statusEmoji: '🔑',
               message: 'Live backend requires authorised employee profile access before this update can sync.' };
    }
    return { statusLabel: 'Backend required', statusClass: 'warning', statusEmoji: '⚙️',
             message: 'Live backend is not configured. Progress is saved locally.' };
  }
  var failedQ = r11_getFailedQueue().filter(function(i) { return i.retryCount < R11_MAX_RETRY; });
  if (failedQ.length > 0) {
    return { statusLabel: 'Sync pending retry', statusClass: 'pending', statusEmoji: '⟳',
             message: 'Some updates failed to sync. Saved locally for retry. ' + failedQ.length + ' item(s) pending.', failedCount: failedQ.length };
  }
  return { statusLabel: 'Live backend connected', statusClass: 'live', statusEmoji: '✅',
           message: 'Live Mode — training activity syncs to the configured backend when authorised and available.' };
}

function getEmployeeLiveProfileStatus() {
  // Returns auth/profile status for the current employee in live mode
  if (isPwaDemoMode && isPwaDemoMode()) {
    return { type: 'demo', message: 'Demo employee profile active.' };
  }
  var emp = getPwaActiveEmployeeByMode ? getPwaActiveEmployeeByMode() : null;
  if (!emp) {
    return { type: 'no_profile', message: 'No live employee profile found. Ask a training manager to set up your employee record in AutoSkill OS™.' };
  }
  if (!r11_canWriteLive()) {
    return { type: 'local', message: 'Employee record loaded locally. Live backend not connected.' };
  }
  return { type: 'live', message: 'Live employee profile active. Training activity syncs to backend.' };
}

function r11_getLiveSyncStatusMessage(eventType) {
  // Short toast message based on current sync capability and event type
  if (isPwaDemoMode && isPwaDemoMode()) {
    return '🎭 Demo Mode — update saved locally';
  }
  if (!r11_canWriteLive()) {
    var bs  = typeof sGet === 'function' ? sGet('4p3x_backend_settings', null) : null;
    var cfg = bs && bs[bs && bs.mode] || {};
    if (cfg.status === 'rls_required') return '🔑 Auth required — saved locally';
    return '💾 Saved locally';
  }
  var labels = {
    lesson_started:             '▶ Lesson start queued for live backend',
    lesson_completed:           '✅ Lesson synced to live backend',
    checkpoint_submitted:       '✅ Checkpoint synced to live backend',
    safety_acknowledged:        '✅ Safety acknowledgement synced to live backend',
    evidence_submitted:         '📝 Training note synced to live backend',
    supervisor_review_requested:'✅ Review request queued for live backend'
  };
  return labels[eventType] || '✅ Saved';
}

function r11_showPwaSyncToast(action, success, reason) {
  if (typeof showToast !== 'function') return;
  var isDemo = isPwaDemoMode && isPwaDemoMode();
  if (isDemo) return; // demo mode toasts are handled by existing logic
  if (success) {
    var successMsgs = {
      started:    '▶ Lesson start queued for live dashboard.',
      completed:  '✅ Lesson completion synced to live backend.',
      checkpoint: '✅ Checkpoint synced to live backend.',
      safety:     '✅ Safety acknowledgement synced to live backend.',
      note:       '📝 Training note synced to live backend.',
      review:     '✅ Review request synced to live backend.'
    };
    showToast(successMsgs[action] || '✅ Training update synced to live backend.');
  } else {
    var rlsReasons = ['rls_blocked','rls_required','auth_required'];
    if (rlsReasons.includes(reason)) {
      showToast('🔑 Live backend requires authorised access. Saved locally for retry.');
    } else if (reason === 'no_client' || reason === 'sdk_not_loaded') {
      showToast('⚙️ Backend not ready. Saved locally. Live sync pending.');
    } else if (reason === 'not_live' || reason === 'demo_record') {
      // silent — demo / local-only is expected
    } else {
      showToast('💾 Saved locally. Live sync failed and is queued for retry.');
    }
  }
}

// ── R11.6: RETRY SUPPORT ──────────────────────────────────────────────────────

async function retryFailedLiveSyncItem(itemId) {
  var q    = r11_getFailedQueue();
  var item = q.find(function(i) { return i.id === itemId; });
  if (!item) { showToast && showToast('Item not found in retry queue.'); return; }
  if (item.retryCount >= R11_MAX_RETRY) {
    showToast && showToast('⚠ Max retries reached for this item. Manual intervention required.');
    return;
  }
  if (!r11_canWriteLive()) {
    showToast && showToast('⚙️ Backend not available for retry right now.');
    return;
  }
  showToast && showToast('Retrying live sync…');
  var result = await r11_writeLiveSyncQueueEvent(item.payload || item);
  if (result.ok) {
    r11_markFailedItemSynced(itemId);
    r11_markLocalItemSynced(itemId, result.remoteId);
    showToast && showToast('✅ Retry succeeded. Item synced to live backend.');
    if (typeof r11_renderPwaLiveSyncBadge === 'function') r11_renderPwaLiveSyncBadge();
  } else {
    r11_updateFailedItemRetry(itemId, result.error);
    showToast && showToast('⚠ Retry failed. Item remains in local retry queue (' + ((item.retryCount||0)+1) + '/' + R11_MAX_RETRY + ').');
  }
}

async function retryAllFailedLiveSyncItems() {
  var q = r11_getFailedQueue().filter(function(i) { return (i.retryCount || 0) < R11_MAX_RETRY; });
  if (!q.length) { showToast && showToast('No failed items to retry.'); return; }
  showToast && showToast('Retrying ' + q.length + ' failed item(s)…');
  var ok = 0, fail = 0;
  for (var i = 0; i < q.length; i++) {
    var result = await r11_writeLiveSyncQueueEvent(q[i].payload || q[i]);
    if (result.ok) { r11_markFailedItemSynced(q[i].id); ok++; }
    else { r11_updateFailedItemRetry(q[i].id, result.error); fail++; }
  }
  showToast && showToast('Retry complete: ' + ok + ' synced, ' + fail + ' still pending.');
  if (typeof r11_renderPwaLiveSyncBadge === 'function') r11_renderPwaLiveSyncBadge();
}

// ── R11.7: PWA LIVE SYNC BADGE UI ────────────────────────────────────────────

function r11_renderPwaLiveSyncBadge() {
  var el = document.getElementById('r11-pwa-sync-badge');
  if (!el) return;
  var st       = getPwaLiveSyncStatus();
  var failedQ  = r11_getFailedQueue();
  var retryable= failedQ.filter(function(i){ return (i.retryCount||0) < R11_MAX_RETRY; });

  var bgColors = {
    demo:    'rgba(201,168,76,.1)',
    local:   'rgba(148,163,184,.08)',
    live:    'rgba(34,197,94,.1)',
    auth:    'rgba(201,168,76,.1)',
    warning: 'rgba(239,68,68,.08)',
    pending: 'rgba(201,168,76,.1)'
  };
  var borderColors = {
    demo:    'rgba(201,168,76,.25)',
    local:   'rgba(148,163,184,.2)',
    live:    'rgba(34,197,94,.25)',
    auth:    'rgba(201,168,76,.25)',
    warning: 'rgba(239,68,68,.2)',
    pending: 'rgba(201,168,76,.25)'
  };
  var bg  = bgColors[st.statusClass]  || bgColors['local'];
  var brd = borderColors[st.statusClass] || borderColors['local'];

  el.innerHTML =
    '<div style="background:' + bg + ';border:1px solid ' + brd + ';border-radius:var(--rs);padding:10px 14px;font-size:12px;line-height:1.5">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px">' +
        '<span style="font-weight:700">' + st.statusEmoji + ' ' + st.statusLabel + '</span>' +
        (retryable.length > 0
          ? '<button onclick="retryAllFailedLiveSyncItems()" style="font-size:11px;padding:2px 8px;border-radius:6px;background:rgba(201,168,76,.15);color:var(--gold);border:1px solid rgba(201,168,76,.3);cursor:pointer" aria-label="Retry failed sync items">Retry ' + retryable.length + '</button>'
          : '') +
      '</div>' +
      '<div style="color:var(--muted);font-size:11px">' + st.message + '</div>' +
      '<div style="font-size:10px;color:var(--muted);margin-top:6px;line-height:1.4">' +
        'Demo Mode shows the product. Live Mode runs the product.<br/>' +
        'AutoSkill OS™ supports training awareness — it does not replace workplace safety procedures or supervisor oversight.' +
      '</div>' +
    '</div>';
}

// ── R11.8: INJECT SYNC BADGE INTO PROGRESS TAB ───────────────────────────────
// Extends renderProgress to inject the live sync badge.

var _r11_origRenderProgress = null;
function r11_extendRenderProgress() {
  var progressEl = document.getElementById('tab-progress');
  if (!progressEl) return;
  // Inject badge container after existing content if not present
  if (!document.getElementById('r11-pwa-sync-badge')) {
    var badgeDiv = document.createElement('div');
    badgeDiv.id  = 'r11-pwa-sync-badge';
    badgeDiv.style.marginTop = '16px';
    progressEl.appendChild(badgeDiv);
  }
  r11_renderPwaLiveSyncBadge();
}

// ── R11.9: DASHBOARD SYNC QUEUE COMPATIBILITY ─────────────────────────────────
// No dashboard rebuild. Just expose status function for dashboard if it reads from PWA context.
// Dashboard's renderSyncQueueView() already reads AP3X_SYNC_QUEUE_KEY items.
// Run 11 adds 'remote_synced' status — dashboard should handle it gracefully.

function r11_getDashboardCompatSyncStatus() {
  // Returns count summary for dashboard compatibility
  var q         = dmGet(AP3X_SYNC_QUEUE_KEY, []);
  var failed    = r11_getFailedQueue();
  return {
    total:          q.length,
    queued:         q.filter(function(i){return i.status==='queued';}).length,
    remoteSynced:   q.filter(function(i){return i.status==='remote_synced';}).length,
    failedLive:     failed.length,
    retryable:      failed.filter(function(i){return (i.retryCount||0) < R11_MAX_RETRY;}).length,
    hasLiveItems:   q.some(function(i){return i.provider==='supabase';}),
    lastSyncAt:     sGet('ap3x_last_queue_at', null)
  };
}

// ── R11.10: INITIALISATION ────────────────────────────────────────────────────

function r11_init() {
  // Attempt Supabase CDN load if configured and not yet loaded
  if (window.r10_loadSupabaseSdkIfNeeded) {
    window.r10_loadSupabaseSdkIfNeeded(function() {
      if (typeof r11_renderPwaLiveSyncBadge === 'function') r11_renderPwaLiveSyncBadge();
    });
  }
  // Extend renderProgress to include sync badge (called after DOMContentLoaded)
  var _origRP = window.renderProgress;
  if (typeof _origRP === 'function') {
    window.renderProgress = function() {
      _origRP.apply(this, arguments);
      setTimeout(r11_extendRenderProgress, 0);
    };
  }
  var liveStatus = getPwaLiveSyncStatus();
  console.info('[AutoSkill OS™ R11] PWA live sync initialised. Status:', liveStatus.statusLabel);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', r11_init);
} else {
  r11_init();
}

// ── End of Run 11 PWA Live Sync Block ────────────────────────────────────────
// AutoSkill OS™ supports training awareness, supervisor review, and evidence
// capture. It does not replace workplace safety procedures, legal duties,
// qualified supervision, employer responsibility, or site-specific training.
// ════════════════════════════════════════════════════════════════════════════


// ════════════════════════════════════════════════════════════════════════════
// AutoSkill OS™ — Run 12: PWA Final Validation
// ════════════════════════════════════════════════════════════════════════════

function getFinalPwaReadinessSummary() {
  var liveStatus = getPwaLiveSyncStatus();
  var empStatus  = getEmployeeLiveProfileStatus();
  var failedQ    = r11_getFailedQueue ? r11_getFailedQueue() : [];
  return {
    runPhase:          'Run 12 — Final Validation',
    installable:       'serviceWorker' in navigator,
    demoModeActive:    isPwaDemoMode ? isPwaDemoMode() : true,
    liveStatus:        liveStatus,
    employeeStatus:    empStatus,
    failedLiveWrites:  failedQ.length,
    retryable:         failedQ.filter(function(i){return (i.retryCount||0) < 3;}).length,
    canWriteLive:      typeof r11_canWriteLive === 'function' ? r11_canWriteLive() : false,
    localQueueItems:   (function(){try{return JSON.parse(localStorage.getItem('ap3x_dm_pwa_sync_queue')||'[]').length;}catch(e){return 0;}}()),
    brandLine:         'Powered by 4P3X Intelligent AI™ Created by Kyzel Kreates™',
    safetyDisclaimer:  'AutoSkill OS™ supports training awareness, supervisor review, and evidence capture. It does not replace workplace safety procedures, legal duties, qualified supervision, employer responsibility, or site-specific training.',
    deploymentNotes: [
      'PWA installable via browser install prompt when served over HTTPS.',
      'Service worker caches app shell for offline access.',
      'Demo Mode works fully offline without any backend.',
      'Live Mode requires Supabase URL + anon key configured in Control Dashboard Settings.',
      'Auth/profile setup required in Supabase before live records sync (RLS active).'
    ]
  };
}

// ════════════════════════════════════════════════════════════════════════════
// End of Run 12 PWA Final Validation
// AutoSkill OS™ supports training awareness — does not replace safety procedures.
// ════════════════════════════════════════════════════════════════════════════
