-- ════════════════════════════════════════════════════════════════════════════
-- AutoSkill OS™ — Demo Seed Data
-- 002_autoskill_seed_demo_live_data.sql
-- ────────────────────────────────────────────────────────────────────────────
-- Powered by 4P3X Intelligent AI™ — Created by Kyzel Kreates™
-- ────────────────────────────────────────────────────────────────────────────
-- ⚠ OPTIONAL — Run ONLY on development/demo environments.
-- ⚠ Skip this file entirely for production setup without demo data.
-- ⚠ All records have is_demo = true. They NEVER mix with live records.
--
-- REQUIRES: 001_autoskill_full_backend_setup.sql must be run first.
--
-- SAFETY DISCLAIMER:
--   AutoSkill OS™ supports training awareness, supervisor review, and evidence
--   capture. It does not replace workplace safety procedures, legal duties,
--   qualified supervision, employer responsibility, or site-specific training.
-- ════════════════════════════════════════════════════════════════════════════

-- ── All demo records use these UUIDs for cross-table consistency ───────────
-- We use fixed UUIDs so seed data is idempotent (safe to re-run).
-- Production data will use gen_random_uuid() dynamically.

do $$
declare
  -- Organisation
  v_org_id   uuid := '00000000-0000-0000-0001-000000000001';
  -- Site
  v_site_id  uuid := '00000000-0000-0000-0002-000000000001';
  -- Departments
  v_dept_assembly  uuid := '00000000-0000-0000-0003-000000000001';
  v_dept_qc        uuid := '00000000-0000-0000-0003-000000000002';
  v_dept_safety    uuid := '00000000-0000-0000-0003-000000000003';
  v_dept_logistics uuid := '00000000-0000-0000-0003-000000000004';
  -- Stations
  v_st_assembly_a  uuid := '00000000-0000-0000-0004-000000000001';
  v_st_qc_line     uuid := '00000000-0000-0000-0004-000000000002';
  v_st_induction   uuid := '00000000-0000-0000-0004-000000000003';
  -- Employees
  v_emp_jamie  uuid := '00000000-0000-0000-0005-000000000001';
  v_emp_aisha  uuid := '00000000-0000-0000-0005-000000000002';
  v_emp_morgan uuid := '00000000-0000-0000-0005-000000000003';
  v_emp_riley  uuid := '00000000-0000-0000-0005-000000000004';
  -- Pathway
  v_path_induction uuid := '00000000-0000-0000-0006-000000000001';
  -- Modules
  v_mod_1 uuid := '00000000-0000-0000-0007-000000000001'; -- Orientation & Induction
  v_mod_2 uuid := '00000000-0000-0000-0007-000000000002'; -- Quality Control & PPE
  v_mod_3 uuid := '00000000-0000-0000-0007-000000000003'; -- Competency & Final Check
  -- Lessons (3 per module for seed)
  v_les_m1_1 uuid := '00000000-0000-0000-0008-000000000101';
  v_les_m1_2 uuid := '00000000-0000-0000-0008-000000000102';
  v_les_m1_3 uuid := '00000000-0000-0000-0008-000000000103';
  v_les_m2_1 uuid := '00000000-0000-0000-0008-000000000201';
  v_les_m2_2 uuid := '00000000-0000-0000-0008-000000000202';
  v_les_m2_3 uuid := '00000000-0000-0000-0008-000000000203';
  v_les_m3_1 uuid := '00000000-0000-0000-0008-000000000301';
  v_les_m3_2 uuid := '00000000-0000-0000-0008-000000000302';
  v_les_m3_3 uuid := '00000000-0000-0000-0008-000000000303';
  -- Checkpoints
  v_chk_1 uuid := '00000000-0000-0000-0009-000000000001';
  v_chk_2 uuid := '00000000-0000-0000-0009-000000000002';
  v_chk_3 uuid := '00000000-0000-0000-0009-000000000003';
  -- Safety Acknowledgements
  v_ack_ppe    uuid := '00000000-0000-0000-0010-000000000001';
  v_ack_hazard uuid := '00000000-0000-0000-0010-000000000002';
  v_ack_site   uuid := '00000000-0000-0000-0010-000000000003';
  -- Supervisor reviews
  v_rev_jamie uuid := '00000000-0000-0000-0011-000000000001';
  v_rev_aisha uuid := '00000000-0000-0000-0011-000000000002';
  -- Competency
  v_comp_assembly uuid := '00000000-0000-0000-0012-000000000001';
begin

  -- ══════════════════════════════════════════════════════════════════════════
  -- 1. ORGANISATION
  -- ══════════════════════════════════════════════════════════════════════════
  insert into public.autoskill_organisations (id, name, slug, status, is_demo)
  values (v_org_id, 'AutoSkill Demo Manufacturing Ltd', 'autoskill-demo', 'active', true)
  on conflict (id) do nothing;

  -- ══════════════════════════════════════════════════════════════════════════
  -- 2. SITE
  -- ══════════════════════════════════════════════════════════════════════════
  insert into public.autoskill_sites (id, organisation_id, name, description, location_label, status)
  values (v_site_id, v_org_id, 'Demo Site — Main Manufacturing Plant',
    'Primary demo manufacturing site for AutoSkill OS™ presentations.',
    'Unit 1, Demo Industrial Estate, Demo City', 'active')
  on conflict (id) do nothing;

  -- ══════════════════════════════════════════════════════════════════════════
  -- 3. DEPARTMENTS
  -- ══════════════════════════════════════════════════════════════════════════
  insert into public.autoskill_departments (id, organisation_id, site_id, name, description, status)
  values
    (v_dept_assembly,  v_org_id, v_site_id, 'Assembly Line',      'Main product assembly and build operations.', 'active'),
    (v_dept_qc,        v_org_id, v_site_id, 'Quality Control',    'Product inspection, defect reporting, and QC standards.', 'active'),
    (v_dept_safety,    v_org_id, v_site_id, 'Safety Induction',   'Health, safety, PPE, and site hazard awareness training.', 'active'),
    (v_dept_logistics, v_org_id, v_site_id, 'Logistics',          'Goods receipt, dispatch, and warehouse operations.', 'active')
  on conflict (id) do nothing;

  -- ══════════════════════════════════════════════════════════════════════════
  -- 4. MANUFACTURING STATIONS
  -- ══════════════════════════════════════════════════════════════════════════
  insert into public.autoskill_manufacturing_stations
    (id, organisation_id, site_id, department_id, name, description, safety_critical, required_ppe, status)
  values
    (v_st_assembly_a, v_org_id, v_site_id, v_dept_assembly,
      'Assembly Station A — Automotive',
      'Primary vehicle component assembly workstation.',
      true, '["hard_hat","high_vis_vest","safety_boots","gloves"]', 'active'),
    (v_st_qc_line, v_org_id, v_site_id, v_dept_qc,
      'QC Inspection Line',
      'Final quality inspection and defect-reporting station.',
      false, '["safety_glasses","gloves"]', 'active'),
    (v_st_induction, v_org_id, v_site_id, v_dept_safety,
      'Safety Induction Suite',
      'New starter safety induction and training assessment area.',
      false, '[]', 'active')
  on conflict (id) do nothing;

  -- ══════════════════════════════════════════════════════════════════════════
  -- 5. EMPLOYEES (is_demo = true — not real people)
  -- ══════════════════════════════════════════════════════════════════════════
  insert into public.autoskill_employees
    (id, organisation_id, site_id, display_name, employee_number, role_title,
     department_id, employment_status, progress_percent, competency_status,
     safety_acknowledgement_status, is_demo)
  values
    (v_emp_jamie, v_org_id, v_site_id, 'Jamie Carter',  'EMP-001',
     'Assembly Operative',   v_dept_assembly, 'active', 65, 'in_progress', 'partial', true),
    (v_emp_aisha, v_org_id, v_site_id, 'Aisha Patel',   'EMP-002',
     'QC Inspector',         v_dept_qc,       'active', 80, 'in_progress', 'complete', true),
    (v_emp_morgan, v_org_id, v_site_id,'Morgan Lewis',  'EMP-003',
     'Logistics Coordinator',v_dept_logistics,'active', 20, 'not_assessed', 'pending', true),
    (v_emp_riley, v_org_id, v_site_id, 'Riley Evans',   'EMP-004',
     'Assembly Apprentice',  v_dept_assembly, 'active', 0,  'not_assessed', 'pending', true)
  on conflict (id) do nothing;

  -- ══════════════════════════════════════════════════════════════════════════
  -- 6. TRAINING PATHWAY
  -- ══════════════════════════════════════════════════════════════════════════
  insert into public.autoskill_training_pathways
    (id, organisation_id, site_id, department_id, title, description,
     required_for_roles, estimated_duration, status, safety_critical, is_demo)
  values (
    v_path_induction, v_org_id, v_site_id, v_dept_safety,
    'New Starter Automotive Manufacturing Induction',
    'Complete onboarding pathway for all new manufacturing employees. Covers site orientation, safety, quality control standards, and competency assessment.',
    '["employee","apprentice"]', '8 hours', 'active', true, true
  ) on conflict (id) do nothing;

  -- ── Pathway assignments
  insert into public.autoskill_pathway_assignments
    (organisation_id, employee_id, pathway_id, status, progress_percent, is_demo)
  values
    (v_org_id, v_emp_jamie,  v_path_induction, 'active', 65, true),
    (v_org_id, v_emp_aisha,  v_path_induction, 'active', 80, true),
    (v_org_id, v_emp_morgan, v_path_induction, 'active', 20, true),
    (v_org_id, v_emp_riley,  v_path_induction, 'active',  0, true)
  on conflict (employee_id, pathway_id) do nothing;

  -- ══════════════════════════════════════════════════════════════════════════
  -- 7. PROCESS MODULES
  -- ══════════════════════════════════════════════════════════════════════════
  insert into public.autoskill_process_modules
    (id, organisation_id, pathway_id, title, description, module_order,
     estimated_duration, safety_critical, completion_required, is_demo)
  values
    (v_mod_1, v_org_id, v_path_induction,
     'Module 1 — Site Orientation & Induction',
     'Welcome to the site. Covers layout, emergency procedures, site rules, and your role.',
     1, '2 hours', false, true, true),
    (v_mod_2, v_org_id, v_path_induction,
     'Module 2 — Quality Control & PPE',
     'Health, safety, PPE requirements, defect recognition, and quality standards.',
     2, '3 hours', true, true, true),
    (v_mod_3, v_org_id, v_path_induction,
     'Module 3 — Competency Assessment & Final Check',
     'Final skill checks, supervisor sign-off readiness, and pathway completion.',
     3, '3 hours', false, true, true)
  on conflict (id) do nothing;

  -- ══════════════════════════════════════════════════════════════════════════
  -- 8. PROCESS LESSONS (3 per module)
  -- ══════════════════════════════════════════════════════════════════════════
  insert into public.autoskill_process_lessons
    (id, organisation_id, module_id, pathway_id, title, summary,
     lesson_order, lesson_type, safety_critical, is_demo)
  values
    -- Module 1 lessons
    (v_les_m1_1, v_org_id, v_mod_1, v_path_induction,
     'Welcome & Site Overview', 'Introduction to the site, your team, and your role.',
     1, 'standard', false, true),
    (v_les_m1_2, v_org_id, v_mod_1, v_path_induction,
     'Emergency Procedures & Evacuation', 'Fire exits, muster points, and emergency contacts.',
     2, 'safety', true, true),
    (v_les_m1_3, v_org_id, v_mod_1, v_path_induction,
     'Site Rules & Code of Conduct', 'Behaviour, reporting, and site access rules.',
     3, 'standard', false, true),
    -- Module 2 lessons
    (v_les_m2_1, v_org_id, v_mod_2, v_path_induction,
     'Health & Safety Fundamentals', 'Key workplace health and safety principles.',
     1, 'safety', true, true),
    (v_les_m2_2, v_org_id, v_mod_2, v_path_induction,
     'PPE Readiness & Selection', 'Correct PPE for each work area and how to use it.',
     2, 'safety', true, true),
    (v_les_m2_3, v_org_id, v_mod_2, v_path_induction,
     'Quality Control & Defect Reporting', 'Identifying defects and using QC reporting processes.',
     3, 'checkpoint', false, true),
    -- Module 3 lessons
    (v_les_m3_1, v_org_id, v_mod_3, v_path_induction,
     'Workstation Readiness Check', 'Pre-shift setup, tool check, and readiness confirmation.',
     1, 'checkpoint', false, true),
    (v_les_m3_2, v_org_id, v_mod_3, v_path_induction,
     'Competency Self-Assessment', 'Review your training progress and self-assess readiness.',
     2, 'acknowledgement', false, true),
    (v_les_m3_3, v_org_id, v_mod_3, v_path_induction,
     'Supervisor Sign-Off Readiness', 'Prepare for supervisor review and final sign-off.',
     3, 'standard', false, true)
  on conflict (id) do nothing;

  -- ══════════════════════════════════════════════════════════════════════════
  -- 9. SKILL CHECKPOINTS
  -- ══════════════════════════════════════════════════════════════════════════
  insert into public.autoskill_skill_checkpoints
    (id, organisation_id, pathway_id, module_id, lesson_id, question,
     checkpoint_type, options, correct_answer, safety_critical, pass_required,
     feedback_text, is_demo)
  values
    (v_chk_1, v_org_id, v_path_induction, v_mod_1, v_les_m1_2,
     'What should you do first when you hear the fire alarm?',
     'multipleChoice',
     '["Continue working until a supervisor tells you to leave","Evacuate immediately using the nearest fire exit","Call the fire brigade from your workstation","Look for the source of fire before leaving"]',
     'Evacuate immediately using the nearest fire exit',
     true, true,
     'Always evacuate immediately on the fire alarm. Do not wait for confirmation. Your muster point is posted at each exit.', true),

    (v_chk_2, v_org_id, v_path_induction, v_mod_2, v_les_m2_2,
     'Which of the following PPE items is required at Assembly Station A?',
     'multipleChoice',
     '["Hard hat, high-vis vest, safety boots, gloves","Safety glasses only","No PPE required indoors","Hard hat only"]',
     'Hard hat, high-vis vest, safety boots, gloves',
     true, true,
     'Assembly Station A is a safety-critical area. All four items of PPE are required at all times on the assembly floor.', true),

    (v_chk_3, v_org_id, v_path_induction, v_mod_2, v_les_m2_3,
     'When you identify a product defect on the line, what is the correct procedure?',
     'multipleChoice',
     '["Set it aside and continue production","Report it immediately using the defect reporting system","Attempt to fix it yourself without reporting","Ignore it if it looks minor"]',
     'Report it immediately using the defect reporting system',
     false, true,
     'All defects must be reported immediately through the QC defect reporting system. Never attempt to fix a defect without authorisation.', true)
  on conflict (id) do nothing;

  -- ══════════════════════════════════════════════════════════════════════════
  -- 10. SAFETY ACKNOWLEDGEMENTS
  -- ══════════════════════════════════════════════════════════════════════════
  insert into public.autoskill_safety_acknowledgements
    (id, organisation_id, pathway_id, module_id, lesson_id, title, description,
     acknowledgement_text, required_for_completion, legal_critical, safety_critical, is_demo)
  values
    (v_ack_ppe, v_org_id, v_path_induction, v_mod_2, v_les_m2_2,
     'PPE Readiness Acknowledgement',
     'Confirms the employee understands PPE requirements for their assigned workstation.',
     'I confirm that I have read and understood the PPE requirements for my assigned workstation. I understand that correct PPE must be worn at all times in designated areas and that failure to do so may result in disciplinary action and/or personal injury.',
     true, false, true, true),

    (v_ack_hazard, v_org_id, v_path_induction, v_mod_2, v_les_m2_1,
     'Site Hazard Awareness Acknowledgement',
     'Confirms the employee is aware of key site hazards.',
     'I confirm that I have been made aware of the key hazards present on this site, including moving machinery, electrical equipment, chemical storage areas, and designated pedestrian routes. I understand my responsibility to report new or unknown hazards immediately.',
     true, false, true, true),

    (v_ack_site, v_org_id, v_path_induction, v_mod_1, v_les_m1_3,
     'Site Rules & Code of Conduct Acknowledgement',
     'Confirms the employee has read and accepts the site rules.',
     'I confirm that I have read and understood the site rules and code of conduct. I agree to abide by these rules throughout my employment at this site.',
     true, false, false, true)
  on conflict (id) do nothing;

  -- ══════════════════════════════════════════════════════════════════════════
  -- 11. EMPLOYEE SAFETY ACKNOWLEDGEMENT COMPLETIONS
  -- ══════════════════════════════════════════════════════════════════════════
  -- Jamie and Aisha have completed some acknowledgements.
  insert into public.autoskill_employee_safety_acknowledgements
    (organisation_id, employee_id, acknowledgement_id, pathway_id, module_id, lesson_id,
     acknowledged_text, acknowledged_at, source, sync_status, is_demo)
  values
    -- Jamie: PPE + Site Rules
    (v_org_id, v_emp_jamie, v_ack_ppe,    v_path_induction, v_mod_2, v_les_m2_2,
     'I confirm that I have read and understood the PPE requirements.',
     now() - interval '3 days', 'employee-pwa', 'synced', true),
    (v_org_id, v_emp_jamie, v_ack_site,   v_path_induction, v_mod_1, v_les_m1_3,
     'I confirm that I have read and understood the site rules.',
     now() - interval '4 days', 'employee-pwa', 'synced', true),
    -- Aisha: All 3
    (v_org_id, v_emp_aisha, v_ack_ppe,    v_path_induction, v_mod_2, v_les_m2_2,
     'I confirm that I have read and understood the PPE requirements.',
     now() - interval '6 days', 'employee-pwa', 'synced', true),
    (v_org_id, v_emp_aisha, v_ack_hazard, v_path_induction, v_mod_2, v_les_m2_1,
     'I confirm that I am aware of the key site hazards.',
     now() - interval '6 days', 'employee-pwa', 'synced', true),
    (v_org_id, v_emp_aisha, v_ack_site,   v_path_induction, v_mod_1, v_les_m1_3,
     'I confirm that I have read and understood the site rules.',
     now() - interval '7 days', 'employee-pwa', 'synced', true)
  on conflict (employee_id, acknowledgement_id) do nothing;

  -- ══════════════════════════════════════════════════════════════════════════
  -- 12. PROGRESS RECORDS
  -- ══════════════════════════════════════════════════════════════════════════
  insert into public.autoskill_progress_records
    (organisation_id, employee_id, pathway_id, module_id, lesson_id,
     status, progress_percent, source, sync_status, completed_at, is_demo)
  values
    -- Jamie: completed M1 lessons, partial M2
    (v_org_id, v_emp_jamie, v_path_induction, v_mod_1, v_les_m1_1,
     'completed', 100, 'employee-pwa', 'synced', now() - interval '4 days', true),
    (v_org_id, v_emp_jamie, v_path_induction, v_mod_1, v_les_m1_2,
     'completed', 100, 'employee-pwa', 'synced', now() - interval '4 days', true),
    (v_org_id, v_emp_jamie, v_path_induction, v_mod_1, v_les_m1_3,
     'completed', 100, 'employee-pwa', 'synced', now() - interval '3 days', true),
    (v_org_id, v_emp_jamie, v_path_induction, v_mod_2, v_les_m2_1,
     'completed', 100, 'employee-pwa', 'synced', now() - interval '2 days', true),
    (v_org_id, v_emp_jamie, v_path_induction, v_mod_2, v_les_m2_2,
     'in_progress', 50, 'employee-pwa', 'local', null, true),
    -- Aisha: completed M1 + M2, partial M3
    (v_org_id, v_emp_aisha, v_path_induction, v_mod_1, v_les_m1_1,
     'completed', 100, 'employee-pwa', 'synced', now() - interval '7 days', true),
    (v_org_id, v_emp_aisha, v_path_induction, v_mod_1, v_les_m1_2,
     'completed', 100, 'employee-pwa', 'synced', now() - interval '7 days', true),
    (v_org_id, v_emp_aisha, v_path_induction, v_mod_1, v_les_m1_3,
     'completed', 100, 'employee-pwa', 'synced', now() - interval '6 days', true),
    (v_org_id, v_emp_aisha, v_path_induction, v_mod_2, v_les_m2_1,
     'completed', 100, 'employee-pwa', 'synced', now() - interval '6 days', true),
    (v_org_id, v_emp_aisha, v_path_induction, v_mod_2, v_les_m2_2,
     'completed', 100, 'employee-pwa', 'synced', now() - interval '5 days', true),
    (v_org_id, v_emp_aisha, v_path_induction, v_mod_2, v_les_m2_3,
     'completed', 100, 'employee-pwa', 'synced', now() - interval '5 days', true),
    (v_org_id, v_emp_aisha, v_path_induction, v_mod_3, v_les_m3_1,
     'in_progress', 60, 'employee-pwa', 'local', null, true),
    -- Morgan: started M1 only
    (v_org_id, v_emp_morgan, v_path_induction, v_mod_1, v_les_m1_1,
     'completed', 100, 'employee-pwa', 'synced', now() - interval '1 day', true),
    (v_org_id, v_emp_morgan, v_path_induction, v_mod_1, v_les_m1_2,
     'in_progress', 30, 'employee-pwa', 'local', null, true)
  on conflict do nothing;

  -- ══════════════════════════════════════════════════════════════════════════
  -- 13. CHECKPOINT SUBMISSIONS
  -- ══════════════════════════════════════════════════════════════════════════
  insert into public.autoskill_checkpoint_submissions
    (organisation_id, employee_id, checkpoint_id, pathway_id, module_id, lesson_id,
     answer, is_correct, status, submitted_at, source, sync_status, is_demo)
  values
    (v_org_id, v_emp_jamie, v_chk_1, v_path_induction, v_mod_1, v_les_m1_2,
     '{"selected":"Evacuate immediately using the nearest fire exit"}',
     true, 'completed', now() - interval '4 days', 'employee-pwa', 'synced', true),
    (v_org_id, v_emp_jamie, v_chk_2, v_path_induction, v_mod_2, v_les_m2_2,
     '{"selected":"Hard hat, high-vis vest, safety boots, gloves"}',
     true, 'completed', now() - interval '3 days', 'employee-pwa', 'synced', true),
    (v_org_id, v_emp_aisha, v_chk_1, v_path_induction, v_mod_1, v_les_m1_2,
     '{"selected":"Evacuate immediately using the nearest fire exit"}',
     true, 'completed', now() - interval '7 days', 'employee-pwa', 'synced', true),
    (v_org_id, v_emp_aisha, v_chk_2, v_path_induction, v_mod_2, v_les_m2_2,
     '{"selected":"Hard hat, high-vis vest, safety boots, gloves"}',
     true, 'completed', now() - interval '6 days', 'employee-pwa', 'synced', true),
    (v_org_id, v_emp_aisha, v_chk_3, v_path_induction, v_mod_2, v_les_m2_3,
     '{"selected":"Report it immediately using the defect reporting system"}',
     true, 'completed', now() - interval '5 days', 'employee-pwa', 'synced', true)
  on conflict do nothing;

  -- ══════════════════════════════════════════════════════════════════════════
  -- 14. COMPETENCIES
  -- ══════════════════════════════════════════════════════════════════════════
  insert into public.autoskill_competencies
    (id, organisation_id, department_id, title, description,
     required_evidence, supervisor_signoff_required, status, is_demo)
  values (
    v_comp_assembly, v_org_id, v_dept_assembly,
    'Assembly Line Operative — Core Competency',
    'Demonstrated ability to perform basic assembly line tasks safely and to quality standard.',
    '["safety_acknowledgement","checkpoint_pass","supervisor_observation"]',
    true, 'active', true
  ) on conflict (id) do nothing;

  -- ══════════════════════════════════════════════════════════════════════════
  -- 15. SUPERVISOR REVIEWS
  -- ══════════════════════════════════════════════════════════════════════════
  insert into public.autoskill_supervisor_reviews
    (id, organisation_id, employee_id, pathway_id, status, notes,
     evidence_count, is_demo)
  values
    (v_rev_jamie, v_org_id, v_emp_jamie, v_path_induction,
     'pending',
     'Jamie is progressing well through Module 2. Review requested after PPE checkpoint completion.',
     2, true),
    (v_rev_aisha, v_org_id, v_emp_aisha, v_path_induction,
     'needs_more_evidence',
     'Aisha has completed all Module 2 content. Awaiting Module 3 competency self-assessment before final review.',
     3, true)
  on conflict (id) do nothing;

  -- ══════════════════════════════════════════════════════════════════════════
  -- 16. EVIDENCE RECORDS
  -- ══════════════════════════════════════════════════════════════════════════
  insert into public.autoskill_evidence_records
    (organisation_id, employee_id, pathway_id, module_id, lesson_id,
     supervisor_review_id, evidence_type, title, description,
     source, sync_status, metadata, is_demo)
  values
    (v_org_id, v_emp_jamie, v_path_induction, v_mod_2, v_les_m2_2,
     v_rev_jamie, 'quiz_result',
     'PPE Checkpoint Pass — Jamie Carter',
     'Jamie passed the PPE Readiness checkpoint with a correct answer on first attempt.',
     'employee-pwa', 'synced',
     '{"score": 100, "attempts": 1, "checkpoint_id": "' || v_chk_2::text || '"}',
     true),
    (v_org_id, v_emp_aisha, v_path_induction, v_mod_2, v_les_m2_3,
     v_rev_aisha, 'quiz_result',
     'QC Defect Reporting Checkpoint Pass — Aisha Patel',
     'Aisha passed the defect reporting checkpoint with correct identification of procedure.',
     'employee-pwa', 'synced',
     '{"score": 100, "attempts": 1, "checkpoint_id": "' || v_chk_3::text || '"}',
     true)
  on conflict do nothing;

  -- ══════════════════════════════════════════════════════════════════════════
  -- 17. DASHBOARD ALERTS
  -- ══════════════════════════════════════════════════════════════════════════
  insert into public.autoskill_dashboard_alerts
    (organisation_id, alert_type, title, message, severity,
     linked_employee_id, linked_pathway_id, resolved, is_demo)
  values
    (v_org_id, 'missing_safety_ack',
     'Safety Ack Missing — Morgan Lewis',
     'Morgan Lewis has not completed the Hazard Awareness acknowledgement. Module 2 requires completion.',
     'warning', v_emp_morgan, v_path_induction, false, true),

    (v_org_id, 'missing_safety_ack',
     'Safety Ack Missing — Riley Evans',
     'Riley Evans has not started the induction pathway or completed any acknowledgements.',
     'critical', v_emp_riley, v_path_induction, false, true),

    (v_org_id, 'review_required',
     'Supervisor Review Requested — Jamie Carter',
     'Jamie Carter has requested supervisor review after completing Module 2 checkpoints.',
     'info', v_emp_jamie, v_path_induction, false, true)
  on conflict do nothing;

  -- ══════════════════════════════════════════════════════════════════════════
  -- 18. SYNC QUEUE SAMPLE (mirrors Run 7 PWA local queue shape)
  -- ══════════════════════════════════════════════════════════════════════════
  insert into public.autoskill_sync_queue
    (organisation_id, event_type, source, target, employee_id, pathway_id,
     module_id, lesson_id, payload, status, priority, data_mode, is_demo,
     local_device_id, provider)
  values
    (v_org_id, 'lesson_completed', 'employee-pwa', 'control-dashboard',
     v_emp_morgan, v_path_induction, v_mod_1, v_les_m1_1,
     '{"lessonTitle": "Welcome & Site Overview", "completedAt": "' || (now() - interval '1 day')::text || '", "xpAwarded": 25}',
     'queued', 'normal', 'demo', true, 'pwa_demo_morgan', 'supabase'),

    (v_org_id, 'safety_acknowledged', 'employee-pwa', 'control-dashboard',
     v_emp_riley, v_path_induction, v_mod_2, v_les_m2_2,
     '{"ackId": "' || v_ack_ppe::text || '", "ackTitle": "PPE Readiness", "acknowledgedAt": "' || now()::text || '"}',
     'queued', 'safety_critical', 'demo', true, 'pwa_demo_riley', 'supabase')
  on conflict do nothing;

  -- ══════════════════════════════════════════════════════════════════════════
  -- 19. APP SETTINGS
  -- ══════════════════════════════════════════════════════════════════════════
  insert into public.autoskill_app_settings
    (organisation_id, setting_key, setting_value, public_safe)
  values
    (v_org_id, 'data_mode',
     '{"mode": "demo", "label": "Demo Mode", "description": "Demo Mode shows the product. Live Mode runs the product."}',
     true),
    (v_org_id, 'app_identity',
     '{"name": "AutoSkill OS™", "brand": "Powered by 4P3X Intelligent AI™ Created by Kyzel Kreates™", "version": "1.0.0"}',
     true)
  on conflict (organisation_id, setting_key) do nothing;

end $$;


-- ════════════════════════════════════════════════════════════════════════════
-- END OF 002_autoskill_seed_demo_live_data.sql
-- All records above have is_demo = true.
-- These records are for demonstration only and must not be treated as
-- production training records, compliance records, or legal documents.
--
-- AutoSkill OS™ supports training awareness, supervisor review, and evidence
-- capture. It does not replace workplace safety procedures, legal duties,
-- qualified supervision, employer responsibility, or site-specific training.
-- ════════════════════════════════════════════════════════════════════════════
