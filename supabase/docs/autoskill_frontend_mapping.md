# AutoSkill OS™ — Frontend to Backend Mapping

> Powered by 4P3X Intelligent AI™ — Created by Kyzel Kreates™
> Run 9 — Supabase Backend Schema

---

## Purpose

This document maps every frontend SSOT localStorage key and data object (Runs 2–8) to its corresponding Supabase backend table (Run 9+).

Use this when implementing Run 10 (Live Backend Connector) to wire the frontend Supabase client to the correct tables.

---

## Data Mode Context

| Mode | Frontend source | Backend source |
|---|---|---|
| Demo | `localStorage` (SSOT keys, `isDemo: true`) | `autoskill_*` tables WHERE `is_demo = true` |
| Live | `localStorage` (SSOT keys, `isDemo: false`) | `autoskill_*` tables WHERE `is_demo = false` |
| Local-only | `localStorage` only | No backend reads/writes |

---

## Core Entity Mapping

### Employees

| Frontend SSOT key | Supabase table | Notes |
|---|---|---|
| `ap3x_dm_employees` | `autoskill_employees` | `isDemo` → `is_demo`. `displayName` → `display_name`. `progressPercent` → `progress_percent`. `assignedPathwayIds[]` → resolved via `autoskill_pathway_assignments`. |
| Employee `id` (e.g. `emp-001`) | `autoskill_employees.id` (UUID) | Local IDs are string slugs. Backend uses UUIDs. Map on sync. |
| Employee `profileId` | `autoskill_employees.profile_id` | Links to `autoskill_profiles.id` (= `auth.uid()`). |

### Trainers / Supervisors

| Frontend SSOT key | Supabase table | Notes |
|---|---|---|
| `ap3x_dm_trainers` | `autoskill_trainers_supervisors` | `displayName` → `display_name`. `roleTitle` → `role_title`. `departmentId` → `department_id`. |

### Departments

| Frontend SSOT key | Supabase table | Notes |
|---|---|---|
| `ap3x_dm_departments` | `autoskill_departments` | `name` → `name`. `organisationId` → `organisation_id`. |

### Manufacturing Stations

| Frontend SSOT key | Supabase table | Notes |
|---|---|---|
| `ap3x_dm_stations` | `autoskill_manufacturing_stations` | `safetyCritical` → `safety_critical`. `requiredPPE[]` → `required_ppe` (jsonb). |

### Training Pathways

| Frontend SSOT key | Supabase table | Notes |
|---|---|---|
| `ap3x_dm_pathways` | `autoskill_training_pathways` | `title` → `title`. `targetDepartmentIds[]` → `department_id` (single FK; multi-dept via future join table). `estimatedDurationHours` → `estimated_duration`. `safetyCritical` → `safety_critical`. |

### Process Modules

| Frontend SSOT key | Supabase table | Notes |
|---|---|---|
| `ap3x_dm_process_modules` | `autoskill_process_modules` | `pathwayId` → `pathway_id`. `order` → `module_order`. `safetyCritical` → `safety_critical`. `completionRequired` → `completion_required`. |

### Process Lessons

| Frontend SSOT key | Supabase table | Notes |
|---|---|---|
| `ap3x_dm_process_lessons` | `autoskill_process_lessons` | `moduleId` → `module_id`. `pathwayId` → `pathway_id`. `keyPoints[]` → `key_points` (jsonb). `lessonType` → `lesson_type`. `safetyCritical` → `safety_critical`. `requiredAcknowledgementId` → `required_acknowledgement_id`. |

### Skill Checkpoints

| Frontend SSOT key | Supabase table | Notes |
|---|---|---|
| `ap3x_dm_skill_checkpoints` | `autoskill_skill_checkpoints` | `checkpointType` → `checkpoint_type`. `options[]` → `options` (jsonb). `correctAnswer` → `correct_answer`. `passRequired` → `pass_required`. `safetyCritical` → `safety_critical`. |

### Safety Acknowledgements

| Frontend SSOT key | Supabase table | Notes |
|---|---|---|
| `ap3x_dm_safety_acks` | `autoskill_safety_acknowledgements` + `autoskill_employee_safety_acknowledgements` | The definition goes in `autoskill_safety_acknowledgements`. Each employee's completion goes in `autoskill_employee_safety_acknowledgements`. Frontend stores `acknowledgedByEmployeeIds[]` — backend normalises to one row per employee per ack. |

### Competencies

| Frontend SSOT key | Supabase table | Notes |
|---|---|---|
| `ap3x_dm_competencies` | `autoskill_competencies` | `requiredEvidence[]` → `required_evidence` (jsonb). `supervisorSignoffRequired` → `supervisor_signoff_required`. |

### Progress Records

| Frontend SSOT key | Supabase table | Notes |
|---|---|---|
| `ap3x_dm_progress_records` | `autoskill_progress_records` | `employeeId` → `employee_id`. `pathwayId` → `pathway_id`. `moduleId` → `module_id`. `lessonId` → `lesson_id`. `status` → `status`. `progressPercent` → `progress_percent`. `source` → `source`. `syncStatus` → `sync_status`. `completedAt` → `completed_at`. `lastUpdatedAt` → `last_updated_at`. |

### Checkpoint Submissions (from sync queue events)

| Frontend SSOT key | Source | Supabase table | Notes |
|---|---|---|---|
| Sync queue `checkpoint_submitted` events | `ap3x_dm_pwa_sync_queue` | `autoskill_checkpoint_submissions` | Created when dashboard processes `checkpoint_submitted` queue items. `answer` → `answer` (jsonb). `isCorrect` → `is_correct`. |

### Supervisor Reviews

| Frontend SSOT key | Supabase table | Notes |
|---|---|---|
| `ap3x_dm_supervisor_reviews` | `autoskill_supervisor_reviews` | `employeeId` → `employee_id`. `pathwayId` → `pathway_id`. `status` → `status` (enum). `notes` → `notes`. `evidenceCount` → `evidence_count`. `reviewedAt` → `reviewed_at`. |

### Evidence Records

| Frontend SSOT key | Supabase table | Notes |
|---|---|---|
| `ap3x_dm_evidence_records` | `autoskill_evidence_records` | `evidenceType` → `evidence_type` (enum). `supervisorReviewId` → `supervisor_review_id`. `metadata` → `metadata` (jsonb). `syncStatus` → `sync_status`. |

### Dashboard Alerts

| Frontend SSOT key | Supabase table | Notes |
|---|---|---|
| `ap3x_dm_dashboard_alerts` | `autoskill_dashboard_alerts` | `type` → `alert_type`. `risk` → `severity` (mapped). `acked` → `resolved`. `linkedEmployeeId` → `linked_employee_id`. |

### Sync Queue

| Frontend SSOT key | Supabase table | Notes |
|---|---|---|
| `ap3x_dm_pwa_sync_queue` | `autoskill_sync_queue` | Full field mapping below. |

#### Sync Queue Field Mapping (Run 7 → Run 9)

| PWA local field | Supabase column | Notes |
|---|---|---|
| `id` | `id` | PWA uses string slug; backend uses UUID. Generate new UUID on insert. |
| `eventType` | `event_type` | Exact match. |
| `source` | `source` | Exact match. |
| `target` | `target` | Exact match. |
| `employeeId` | `employee_id` | Must resolve to `autoskill_employees.id` UUID. |
| `pathwayId` | `pathway_id` | Must resolve to `autoskill_training_pathways.id` UUID. |
| `moduleId` | `module_id` | Must resolve to `autoskill_process_modules.id` UUID. |
| `lessonId` | `lesson_id` | Must resolve to `autoskill_process_lessons.id` UUID. |
| `checkpointId` | `checkpoint_id` | Must resolve to `autoskill_skill_checkpoints.id` UUID. |
| `acknowledgementId` | `acknowledgement_id` | Must resolve to `autoskill_safety_acknowledgements.id` UUID. |
| `evidenceRecordId` | `evidence_record_id` | Must resolve to `autoskill_evidence_records.id` UUID. |
| `supervisorReviewId` | `supervisor_review_id` | Must resolve to `autoskill_supervisor_reviews.id` UUID. |
| `payload` | `payload` | jsonb — exact match. |
| `status` | `status` | `queued` / `synced` / `failed` → enum `autoskill_sync_status`. |
| `priority` | `priority` | `normal` / `safety-critical` → `normal` / `safety_critical` (note: underscore in enum). |
| `dataMode` | `data_mode` | `demo` / `live` / `local` → enum `autoskill_data_mode`. |
| `isDemo` | `is_demo` | Exact match. |
| `localDeviceId` | `local_device_id` | Exact match. |
| `provider` | `provider` | Exact match. |
| `retryCount` | `retry_count` | Exact match. |
| `errorMessage` | `error_message` | Exact match. |
| `notes` | `notes` | Exact match. |
| `createdAt` | `created_at` | Exact match. |
| `updatedAt` | `updated_at` | Exact match. |
| `processedAt` | `processed_at` | Exact match. |

### Backend Config / App Settings

| Frontend SSOT key | Supabase table | Notes |
|---|---|---|
| `ap3x_dm_backend_config` | `autoskill_app_settings` (key: `backend_config`) | Only public-safe values: `supabaseUrl`, `supabaseAnonKey`, `provider`. ⛔ Never `service_role_key` or secrets. |
| `ap3x_dm_data_mode` | `autoskill_app_settings` (key: `data_mode`) | `demo` / `live` / `local`. |
| `4p3x_demo_mode` | `autoskill_app_settings` (key: `demo_mode_active`) | Boolean. |

---

## ID Resolution Strategy (Run 10)

When PWA queue items are pushed to Supabase, local string IDs (e.g. `emp-001`, `path-ns-induction`) must be mapped to backend UUIDs.

Recommended approach:

1. Store a `local_id → backend_uuid` mapping in `autoskill_app_settings` (key: `id_map`) or as a separate local-to-backend mapping table.
2. When the frontend first syncs a demo/live employee, look up their profile from `autoskill_profiles` via `auth.uid()`, find their linked `autoskill_employees` record, and cache the UUID locally.
3. For content IDs (pathways, modules, lessons), fetch the canonical backend records on first live sync and cache locally.

---

## What Does NOT Change in Run 10

| System | Status |
|---|---|
| Local SSOT (`localStorage`) | Preserved — still used in Demo Mode |
| `processLocalSyncQueue()` | Preserved — still processes local queue in Demo Mode |
| `getActiveRecordsByMode()` | Preserved — filters local SSOT by demo/live |
| PWA `patient-app.js` | No structural change in Run 10 |
| Control Dashboard HTML | Adds Supabase client calls alongside existing local logic |
| Demo Mode | Unchanged — demo still works without backend |
| 4P3X API Config Guard™ | Unchanged — still blocks forbidden secrets |

---

*AutoSkill OS™ — Powered by 4P3X Intelligent AI™ — Created by Kyzel Kreates™*
