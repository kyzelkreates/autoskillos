/* TherapyLink™ — Patient Recovery PWA App
   Standalone installable PWA version (patient-pwa/index.html)
   All data via localStorage SSOT — no backend required
   Created by Kyzel Kreates · Powered by 4P3X Intelligent AI     */
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

// ── Curriculum ────────────────────────────────────────────────────
const CURRICULUM = [
  { id: 1, name: 'Module 1 — Understanding Your Mental Health', icon: '🌱', color: '#22c55e', lessons: [
    { id: 'm1l1', name: 'What mental health recovery can look like', desc: 'Exploring what recovery means — it is not linear and that is okay.', xp: 60 },
    { id: 'm1l2', name: 'Understanding mood, anxiety, and stress', desc: 'How mood, anxiety, and stress interact and influence each other daily.', xp: 60 },
    { id: 'm1l3', name: 'Recognising personal triggers', desc: 'Learning to identify situations, thoughts, or feelings that worsen symptoms.', xp: 70 },
    { id: 'm1l4', name: 'Tracking patterns safely', desc: 'Using gentle observation to notice patterns without judgement.', xp: 70 },
    { id: 'm1l5', name: 'When to ask for support', desc: 'Recognising when to reach out and how to communicate your needs.', xp: 80 },
  ]},
  { id: 2, name: 'Module 2 — Coping Skills and Daily Regulation', icon: '🎯', color: '#c9a84c', lessons: [
    { id: 'm2l1', name: 'Breathing and grounding techniques', desc: 'Practical tools to reduce anxiety and return to the present moment.', xp: 70 },
    { id: 'm2l2', name: 'Building a daily wellbeing routine', desc: 'Small, consistent habits that support mental health over time.', xp: 70 },
    { id: 'm2l3', name: 'Managing overwhelming thoughts', desc: 'Strategies for cognitive defusion and reducing thought rumination.', xp: 80 },
    { id: 'm2l4', name: 'Sleep, rest, and recovery basics', desc: 'Understanding the relationship between sleep quality and mental health.', xp: 70 },
    { id: 'm2l5', name: 'Creating a personal support plan', desc: 'Designing a simple, practical plan for difficult days.', xp: 90 },
  ]},
  { id: 3, name: 'Module 3 — Progress, Reflection, and Relapse Prevention', icon: '🌍', color: '#a855f7', lessons: [
    { id: 'm3l1', name: 'Reflecting on progress', desc: 'How to acknowledge growth while being compassionate with setbacks.', xp: 80 },
    { id: 'm3l2', name: 'Identifying early warning signs', desc: 'Recognising your personal signs that a difficult period may be starting.', xp: 80 },
    { id: 'm3l3', name: 'Strengthening coping strategies', desc: 'Reviewing and deepening the tools that work best for you.', xp: 80 },
    { id: 'm3l4', name: 'Preparing for therapy sessions', desc: 'Getting the most from your sessions with planning and reflection.', xp: 80 },
    { id: 'm3l5', name: 'Building a personal recovery plan', desc: 'Pulling everything together into a lasting personal recovery framework.', xp: 100 },
  ]},
];

const LESSON_CONTENT = {

  /* ── MODULE 1 ─────────────────────────────────────────── */

  m1l1: {
    id: 'm1l1', moduleId: 1, lessonNumber: 1,
    moduleTitle: 'Module 1 — Understanding Your Mental Health',
    title: 'What Mental Health Recovery Can Look Like',
    estimatedTime: '8–10 minutes',
    summary: 'Recovery is not always a straight line. Some days may feel easier, while others may feel more difficult. This lesson helps you understand recovery as a process of learning, noticing patterns, building support, and taking small steps that help you feel safer and more able to cope.',
    learningGoals: [
      'Understand that recovery can look different for every person.',
      'Recognise that progress can happen gradually.',
      'Learn why small steps matter.',
      'Understand how TherapyLink™ can support reflection between sessions.'
    ],
    sections: [
      { heading: 'Recovery is personal', body: 'Mental health recovery does not mean feeling perfect all the time. It can mean understanding yourself better, recognising what affects your wellbeing, learning coping strategies, and feeling more able to ask for help when needed. Everyone\'s recovery looks different.' },
      { heading: 'Progress is not always linear', body: 'It is normal to have good days, difficult days, and days that feel somewhere in between. A difficult day does not mean you have failed. It may simply show that your mind and body need care, rest, support, or a different strategy.' },
      { heading: 'Small steps count', body: 'Small actions can support recovery. This might include completing a check-in, noticing a trigger, using a breathing exercise, writing down a thought, contacting someone supportive, or attending therapy. These steps can build confidence over time.' },
      { heading: 'Why tracking helps', body: 'Tracking mood, stress, sleep, coping strategies, and reflections can help you and your therapist notice patterns. These patterns may help guide future support and make therapy sessions more focused.' },
      { heading: 'Using TherapyLink™ safely', body: 'TherapyLink™ is designed to support reflection, learning, and therapist-guided monitoring. It is not an emergency service and does not replace professional care. Use it as a support tool between sessions.' }
    ],
    reflectionPrompt: 'What would progress look like for you this week, even if it is only a small step?',
    patientExercise: 'Write down one small action you can take today to support your wellbeing.',
    therapistNote: 'Review the patient\'s definition of progress. It may reveal expectations, pressure points, or opportunities for realistic goal-setting.',
    safetyNote: 'This lesson is for education and reflection only. It does not replace therapy, medical advice, diagnosis, emergency support, or professional judgement. If you feel at immediate risk or in crisis, contact local emergency services or a crisis support line immediately.',
    completionLabel: 'I understand what recovery can look like'
  },

  m1l2: {
    id: 'm1l2', moduleId: 1, lessonNumber: 2,
    moduleTitle: 'Module 1 — Understanding Your Mental Health',
    title: 'Understanding Mood, Anxiety, and Stress',
    estimatedTime: '8–10 minutes',
    summary: 'Mood, anxiety, and stress can affect thoughts, feelings, body sensations, and behaviour. This lesson helps you understand how these experiences can show up and why tracking them may help you and your therapist recognise useful patterns.',
    learningGoals: [
      'Understand the difference between mood, anxiety, and stress.',
      'Notice how emotional experiences can affect the body.',
      'Learn why rating mood and stress can be useful.',
      'Build confidence in describing your experience.'
    ],
    sections: [
      { heading: 'What mood means', body: 'Mood is your general emotional state. It can include feeling low, calm, hopeful, numb, irritable, motivated, tired, or unsettled. Mood can change throughout the day and may be affected by sleep, relationships, thoughts, health, work, and life events.' },
      { heading: 'What anxiety can feel like', body: 'Anxiety can include worry, fear, tension, racing thoughts, restlessness, avoidance, or physical sensations such as a tight chest, fast heartbeat, sweating, or stomach discomfort. Anxiety is not a personal failure. It is a signal that your mind or body may be responding to perceived threat or pressure.' },
      { heading: 'What stress can feel like', body: 'Stress often appears when demands feel greater than your current capacity. It can affect concentration, patience, sleep, energy, motivation, and physical tension. Stress can build slowly, so noticing early signs is important.' },
      { heading: 'Why rating helps', body: 'Rating mood, anxiety, or stress from 1–10 can make invisible experiences easier to track. A number is not the whole story, but it can help show patterns over time.' },
      { heading: 'Talking about your experience', body: 'You do not need perfect words to describe how you feel. Simple descriptions like "heavy," "wired," "flat," "overwhelmed," or "on edge" can be useful starting points.' }
    ],
    reflectionPrompt: 'How do mood, anxiety, or stress usually show up for you?',
    patientExercise: 'Choose one word that describes how you feel today. Then rate your mood and stress from 1–10.',
    therapistNote: 'Look for differences between patient ratings and written descriptions. These may help guide conversation.',
    safetyNote: 'This lesson is for education and reflection only. It does not replace therapy, medical advice, diagnosis, emergency support, or professional judgement. If you feel at immediate risk or in crisis, contact local emergency services or a crisis support line immediately.',
    completionLabel: 'I understand mood, anxiety, and stress better'
  },

  m1l3: {
    id: 'm1l3', moduleId: 1, lessonNumber: 3,
    moduleTitle: 'Module 1 — Understanding Your Mental Health',
    title: 'Recognising Personal Triggers',
    estimatedTime: '10–12 minutes',
    summary: 'Triggers are situations, thoughts, memories, sensations, or events that can affect emotional wellbeing. This lesson helps you identify possible triggers gently and safely without judging yourself.',
    learningGoals: [
      'Understand what a trigger can be.',
      'Notice common types of triggers.',
      'Learn how to track triggers safely.',
      'Reduce self-blame around emotional reactions.'
    ],
    sections: [
      { heading: 'What is a trigger?', body: 'A trigger is something that leads to a strong emotional, physical, or behavioural response. It might be obvious, such as an argument, or subtle, such as a tone of voice, a memory, a smell, a place, a deadline, or a feeling in the body.' },
      { heading: 'Triggers are not weakness', body: 'Having triggers does not mean you are weak or broken. Triggers often develop because the mind and body are trying to protect you. Understanding them can help you respond with more care and less judgement.' },
      { heading: 'Common trigger areas', body: 'Triggers may relate to relationships, work, health, money, conflict, uncertainty, rejection, trauma reminders, sensory overload, tiredness, loneliness, or feeling out of control.' },
      { heading: 'Tracking gently', body: 'When tracking triggers, avoid forcing yourself to relive painful experiences. Start with simple notes: what happened, how you felt, what your body did, what you needed, and what helped.' },
      { heading: 'Building awareness', body: 'Over time, trigger tracking can help you and your therapist identify patterns. This can support planning, coping strategies, boundaries, and safer responses.' }
    ],
    reflectionPrompt: 'What is one situation that often affects your wellbeing?',
    patientExercise: 'Write down one possible trigger and one supportive response you could try next time.',
    therapistNote: 'Review trigger notes carefully and avoid pushing for detail too quickly. Focus on safety, pacing, and stabilisation.',
    safetyNote: 'This lesson is for education and reflection only. It does not replace therapy, medical advice, diagnosis, emergency support, or professional judgement. If you feel at immediate risk or in crisis, contact local emergency services or a crisis support line immediately.',
    completionLabel: 'I can recognise some of my triggers'
  },

  m1l4: {
    id: 'm1l4', moduleId: 1, lessonNumber: 4,
    moduleTitle: 'Module 1 — Understanding Your Mental Health',
    title: 'Tracking Patterns Safely',
    estimatedTime: '8–10 minutes',
    summary: 'Tracking can help you notice patterns in mood, stress, sleep, energy, coping strategies, and support needs. This lesson explains how to track safely without becoming overwhelmed or overly self-critical.',
    learningGoals: [
      'Understand the value of pattern tracking.',
      'Learn what to track.',
      'Avoid turning tracking into pressure.',
      'Use check-ins as supportive information.'
    ],
    sections: [
      { heading: 'Why patterns matter', body: 'Mental health experiences can feel random, but patterns often appear over time. You may notice that stress rises after poor sleep, mood drops after isolation, or coping improves after routine, movement, connection, or rest.' },
      { heading: 'What can be tracked', body: 'Useful areas include mood, anxiety, stress, sleep, energy, appetite, concentration, coping strategies, social connection, symptoms, triggers, and notes for your therapist.' },
      { heading: 'Tracking should not become punishment', body: 'Tracking is not about judging yourself or getting a perfect score. It is about gathering information. Missing a check-in does not mean failure. It may itself be useful information.' },
      { heading: 'Look for trends, not single days', body: 'One difficult day does not define your recovery. Patterns become clearer when you look across several days or weeks. Your therapist can help interpret what the data might mean.' },
      { heading: 'Keep it simple', body: 'A short check-in is enough. You do not need long explanations every day. Even a mood score, sleep rating, and one sentence can be useful.' }
    ],
    reflectionPrompt: 'What pattern would be useful for you and your therapist to understand better?',
    patientExercise: 'Complete today\'s check-in and add one short note about what may have affected your wellbeing.',
    therapistNote: 'Encourage patients to use tracking as information, not performance. Watch for perfectionism or anxiety around recording data.',
    safetyNote: 'This lesson is for education and reflection only. It does not replace therapy, medical advice, diagnosis, emergency support, or professional judgement. If you feel at immediate risk or in crisis, contact local emergency services or a crisis support line immediately.',
    completionLabel: 'I understand how to track patterns safely'
  },

  m1l5: {
    id: 'm1l5', moduleId: 1, lessonNumber: 5,
    moduleTitle: 'Module 1 — Understanding Your Mental Health',
    title: 'When to Ask for Support',
    estimatedTime: '8–10 minutes',
    summary: 'Asking for support can be difficult, especially when you are used to coping alone. This lesson helps you recognise signs that extra support may be needed and how to communicate this clearly.',
    learningGoals: [
      'Recognise signs that support may be needed.',
      'Reduce shame around asking for help.',
      'Learn simple ways to communicate support needs.',
      'Understand crisis boundaries.'
    ],
    sections: [
      { heading: 'Support is part of recovery', body: 'Needing support does not mean you have failed. Support can help you feel less alone, organise your thoughts, make safer choices, and access the right help at the right time.' },
      { heading: 'Signs you may need support', body: 'You may need extra support if you feel overwhelmed, unsafe, unable to cope, unusually withdrawn, highly anxious, very low, unable to sleep, unable to complete basic tasks, or unsure how to manage your thoughts or feelings.' },
      { heading: 'Different levels of support', body: 'Support can include self-care, contacting a trusted person, messaging your therapist if appropriate, using a support plan, contacting a GP or healthcare professional, or contacting emergency/crisis services if there is immediate risk.' },
      { heading: 'How to ask clearly', body: 'Simple phrases can help: "I am struggling today," "I need someone to check in," "I do not feel safe," "I need help making a plan," or "Can we talk about this in my next session?"' },
      { heading: 'Immediate risk', body: 'If you feel at immediate risk or unable to stay safe, do not wait for an app response. Contact local emergency services or a crisis support line immediately.' }
    ],
    reflectionPrompt: 'What signs tell you that you may need extra support?',
    patientExercise: 'Write one sentence you could use to ask for support when things feel difficult.',
    therapistNote: 'Use this lesson to help patients build a realistic support plan and identify safe contacts and resources.',
    safetyNote: 'This lesson is for education and reflection only. It does not replace therapy, medical advice, diagnosis, emergency support, or professional judgement. If you feel at immediate risk or in crisis, contact local emergency services or a crisis support line immediately.',
    completionLabel: 'I know when to ask for support'
  },

  /* ── MODULE 2 ─────────────────────────────────────────── */

  m2l1: {
    id: 'm2l1', moduleId: 2, lessonNumber: 6,
    moduleTitle: 'Module 2 — Coping Skills and Daily Regulation',
    title: 'Breathing and Grounding Techniques',
    estimatedTime: '10–12 minutes',
    summary: 'Breathing and grounding techniques can help calm the body when stress or anxiety rises. This lesson introduces simple tools that can be practised gently and used when helpful.',
    learningGoals: [
      'Understand how breathing can affect the body.',
      'Learn simple grounding techniques.',
      'Practise using the senses to return to the present moment.',
      'Choose a technique to try this week.'
    ],
    sections: [
      { heading: 'Why regulation helps', body: 'When the body feels threatened or overwhelmed, it may move into a stress response. Breathing and grounding techniques can help signal safety and bring attention back to the present.' },
      { heading: 'Gentle breathing', body: 'Try breathing in slowly through the nose for four counts, pausing briefly, and breathing out slowly for six counts. The longer out-breath can help the body settle. Do not force the breath. If it feels uncomfortable, stop and return to normal breathing.' },
      { heading: '5-4-3-2-1 grounding', body: 'Notice five things you can see, four things you can feel, three things you can hear, two things you can smell, and one thing you can taste or appreciate. This can help reconnect with the present moment.' },
      { heading: 'Feet on the floor', body: 'Place both feet on the floor. Notice the contact between your feet and the ground. Press gently into the floor and remind yourself: "I am here. This is now."' },
      { heading: 'Practise when calm', body: 'Coping skills often work better when practised before distress is very high. Try using them during calm moments so they feel more familiar when needed.' }
    ],
    reflectionPrompt: 'Which grounding or breathing technique feels most manageable for you?',
    patientExercise: 'Try one breathing or grounding technique for two minutes and record how you feel afterwards.',
    therapistNote: 'Check whether breathing exercises feel safe for the patient. Some patients may prefer grounding over breath focus.',
    safetyNote: 'This lesson is for education and reflection only. It does not replace therapy, medical advice, diagnosis, emergency support, or professional judgement. If you feel at immediate risk or in crisis, contact local emergency services or a crisis support line immediately.',
    completionLabel: 'I have tried a grounding technique'
  },

  m2l2: {
    id: 'm2l2', moduleId: 2, lessonNumber: 7,
    moduleTitle: 'Module 2 — Coping Skills and Daily Regulation',
    title: 'Building a Daily Wellbeing Routine',
    estimatedTime: '10–12 minutes',
    summary: 'A wellbeing routine does not need to be complicated. Small, repeatable actions can support stability, recovery, and self-awareness. This lesson helps you build a simple routine that fits your real life.',
    learningGoals: [
      'Understand why routine can support wellbeing.',
      'Choose small daily actions.',
      'Avoid unrealistic pressure.',
      'Build a routine that can adapt on difficult days.'
    ],
    sections: [
      { heading: 'Why routine helps', body: 'Routine can reduce decision pressure and create small anchors in the day. Predictable actions can support sleep, mood, energy, and emotional regulation.' },
      { heading: 'Start small', body: 'A helpful routine might begin with one or two actions, such as drinking water, opening curtains, taking medication as prescribed, completing a check-in, stepping outside, eating something nourishing, or doing a grounding exercise.' },
      { heading: 'Make a difficult-day version', body: 'Recovery routines should include a low-energy version. For example, if a walk feels too much, sitting near a window may be enough. If journaling feels too much, writing one word may be enough.' },
      { heading: 'Link actions together', body: 'Routines are easier when connected to something you already do. For example: after brushing teeth, complete a check-in. After breakfast, take two slow breaths. Before bed, write one reflection.' },
      { heading: 'Review and adjust', body: 'A routine should support you, not punish you. If it does not work, adjust it with curiosity rather than self-criticism.' }
    ],
    reflectionPrompt: 'What is one small wellbeing action you could repeat most days?',
    patientExercise: 'Create a three-step routine for tomorrow, including one low-energy backup option.',
    therapistNote: 'Review whether the patient\'s routine is realistic. Encourage flexible routines rather than perfectionistic plans.',
    safetyNote: 'This lesson is for education and reflection only. It does not replace therapy, medical advice, diagnosis, emergency support, or professional judgement. If you feel at immediate risk or in crisis, contact local emergency services or a crisis support line immediately.',
    completionLabel: 'I have created a simple wellbeing routine'
  },

  m2l3: {
    id: 'm2l3', moduleId: 2, lessonNumber: 8,
    moduleTitle: 'Module 2 — Coping Skills and Daily Regulation',
    title: 'Managing Overwhelming Thoughts',
    estimatedTime: '10–12 minutes',
    summary: 'Overwhelming thoughts can feel powerful and urgent. This lesson helps you notice thoughts without immediately believing or fighting them, and introduces simple ways to create space around them.',
    learningGoals: [
      'Understand that thoughts are not always facts.',
      'Learn ways to notice overwhelming thoughts.',
      'Practise creating distance from thoughts.',
      'Identify one helpful response.'
    ],
    sections: [
      { heading: 'Thoughts can feel convincing', body: 'When you are stressed, low, or anxious, thoughts may become more intense. You might notice "what if" thoughts, self-critical thoughts, hopeless thoughts, or pressure-filled thoughts.' },
      { heading: 'Thoughts are mental events', body: 'A thought is something your mind produces. It may contain useful information, but it is not automatically true. Learning to notice thoughts can reduce their control.' },
      { heading: 'Name the thought', body: 'Try saying: "I am having the thought that…" before the thought. For example: "I am having the thought that I cannot cope." This can create a small amount of distance.' },
      { heading: 'Look for a balanced response', body: 'Instead of forcing positivity, try a balanced response: "This feels hard right now, and I can take one small step," or "I do not have to solve everything today."' },
      { heading: 'Use support', body: 'If thoughts feel intense, frightening, or difficult to manage alone, use your support plan, contact a trusted person, or seek professional help. If you feel unsafe, contact emergency or crisis support immediately.' }
    ],
    reflectionPrompt: 'What overwhelming thought shows up for you most often?',
    patientExercise: 'Write one overwhelming thought, then rewrite it as "I am having the thought that…" and add one balanced response.',
    therapistNote: 'This exercise can reveal cognitive themes. Use gently and avoid debating thoughts too aggressively.',
    safetyNote: 'This lesson is for education and reflection only. It does not replace therapy, medical advice, diagnosis, emergency support, or professional judgement. If you feel at immediate risk or in crisis, contact local emergency services or a crisis support line immediately.',
    completionLabel: 'I have practised creating space from thoughts'
  },

  m2l4: {
    id: 'm2l4', moduleId: 2, lessonNumber: 9,
    moduleTitle: 'Module 2 — Coping Skills and Daily Regulation',
    title: 'Sleep, Rest, and Recovery Basics',
    estimatedTime: '8–10 minutes',
    summary: 'Sleep and rest can strongly affect mood, stress, concentration, and coping. This lesson helps you notice the relationship between rest and wellbeing, and plan small supportive changes.',
    learningGoals: [
      'Understand the connection between sleep and wellbeing.',
      'Notice how rest affects mood and anxiety.',
      'Learn simple sleep-supportive habits.',
      'Identify one realistic rest goal.'
    ],
    sections: [
      { heading: 'Sleep affects coping', body: 'Poor sleep can make emotions feel stronger, reduce concentration, increase irritability, and make coping strategies harder to use. This does not mean you are failing; it means your system may be under strain.' },
      { heading: 'Rest is not laziness', body: 'Rest is part of recovery. Rest can include sleep, quiet time, reduced stimulation, gentle movement, breathing, time away from screens, or doing something calming.' },
      { heading: 'Create a wind-down signal', body: 'A wind-down routine tells the body that sleep is approaching. This could include dimming lights, reducing phone use, stretching, listening to calming audio, or writing down tomorrow\'s tasks.' },
      { heading: 'Track without pressure', body: 'Tracking sleep quality can help identify patterns. Avoid judging yourself for poor sleep. Use it as information to discuss with your therapist or healthcare professional if needed.' },
      { heading: 'When sleep problems persist', body: 'If sleep problems continue or severely affect daily life, consider discussing them with a healthcare professional. TherapyLink™ can support tracking, but it does not diagnose or treat sleep conditions.' }
    ],
    reflectionPrompt: 'How does your sleep usually affect your mood or stress?',
    patientExercise: 'Choose one small wind-down action to try tonight.',
    therapistNote: 'Sleep tracking may reveal important wellbeing patterns. Explore without blame.',
    safetyNote: 'This lesson is for education and reflection only. It does not replace therapy, medical advice, diagnosis, emergency support, or professional judgement. If you feel at immediate risk or in crisis, contact local emergency services or a crisis support line immediately.',
    completionLabel: 'I have chosen a rest-supportive action'
  },

  m2l5: {
    id: 'm2l5', moduleId: 2, lessonNumber: 10,
    moduleTitle: 'Module 2 — Coping Skills and Daily Regulation',
    title: 'Creating a Support Plan',
    estimatedTime: '10–12 minutes',
    summary: 'A support plan helps you know what to do when things become difficult. This lesson helps you create a simple plan that includes coping strategies, supportive people, professional support, and crisis steps.',
    learningGoals: [
      'Understand what a support plan is.',
      'Identify personal warning signs.',
      'Choose coping strategies.',
      'List safe support contacts and next steps.'
    ],
    sections: [
      { heading: 'What is a support plan?', body: 'A support plan is a clear list of actions and contacts that can help when your wellbeing drops or distress rises. It is easier to follow a plan when it is written before things feel overwhelming.' },
      { heading: 'Warning signs', body: 'Warning signs may include withdrawal, poor sleep, racing thoughts, feeling numb, irritability, avoiding responsibilities, increased anxiety, low mood, or feeling unable to cope.' },
      { heading: 'Coping actions', body: 'Helpful actions might include grounding, breathing, stepping outside, drinking water, eating something, reducing stimulation, writing thoughts down, using a routine, or contacting someone supportive.' },
      { heading: 'Support contacts', body: 'Include people or services you can contact. This may include trusted friends/family, your therapist, your GP or healthcare provider, community support, crisis lines, or emergency services where appropriate.' },
      { heading: 'Crisis step', body: 'If you feel in immediate danger or unable to stay safe, contact local emergency services or a crisis support line immediately. Do not wait for a TherapyLink™ response.' }
    ],
    reflectionPrompt: 'What are your early signs that you may need extra support?',
    patientExercise: 'Create a simple support plan with three coping actions and two support contacts.',
    therapistNote: 'Review the patient\'s support plan and help make it specific, realistic, and safe.',
    safetyNote: 'This lesson is for education and reflection only. It does not replace therapy, medical advice, diagnosis, emergency support, or professional judgement. If you feel at immediate risk or in crisis, contact local emergency services or a crisis support line immediately.',
    completionLabel: 'I have created a support plan'
  },

  /* ── MODULE 3 ─────────────────────────────────────────── */

  m3l1: {
    id: 'm3l1', moduleId: 3, lessonNumber: 11,
    moduleTitle: 'Module 3 — Progress, Reflection, and Relapse Prevention',
    title: 'Reflecting on Progress',
    estimatedTime: '8–10 minutes',
    summary: 'Progress can be easy to miss, especially when you are focused on what still feels difficult. This lesson helps you reflect on small changes, strengths, and patterns of improvement.',
    learningGoals: [
      'Recognise different types of progress.',
      'Notice small wins.',
      'Reflect without self-judgement.',
      'Prepare progress notes for therapy.'
    ],
    sections: [
      { heading: 'Progress can be subtle', body: 'Progress may look like noticing a trigger sooner, asking for support, completing a check-in, using a coping strategy, attending therapy, resting instead of pushing through, or speaking to yourself more kindly.' },
      { heading: 'Progress is not perfection', body: 'You can be making progress and still have difficult days. Recovery does not require constant improvement. It often involves learning how to respond differently when difficulties appear.' },
      { heading: 'Look at evidence', body: 'Use check-ins, lesson completion, mood trends, notes, and coping strategy use as evidence. This can help you see change more clearly over time.' },
      { heading: 'Name strengths', body: 'Strengths might include persistence, honesty, courage, awareness, patience, creativity, care for others, or willingness to try. These strengths can support recovery.' },
      { heading: 'Bring progress to therapy', body: 'Progress reflections can help your therapist understand what is changing and what still needs support.' }
    ],
    reflectionPrompt: 'What is one small sign of progress you have noticed recently?',
    patientExercise: 'Write down three small wins from the past week, even if they seem minor.',
    therapistNote: 'Use patient reflections to reinforce realistic progress and identify helpful interventions.',
    safetyNote: 'This lesson is for education and reflection only. It does not replace therapy, medical advice, diagnosis, emergency support, or professional judgement. If you feel at immediate risk or in crisis, contact local emergency services or a crisis support line immediately.',
    completionLabel: 'I have reflected on my progress'
  },

  m3l2: {
    id: 'm3l2', moduleId: 3, lessonNumber: 12,
    moduleTitle: 'Module 3 — Progress, Reflection, and Relapse Prevention',
    title: 'Identifying Early Warning Signs',
    estimatedTime: '10–12 minutes',
    summary: 'Early warning signs are signals that your wellbeing may be starting to decline. Recognising them early can help you respond before things feel unmanageable.',
    learningGoals: [
      'Understand early warning signs.',
      'Identify personal signs of decline.',
      'Connect warning signs to support actions.',
      'Build a prevention mindset.'
    ],
    sections: [
      { heading: 'What are early warning signs?', body: 'Early warning signs are changes that may appear before a bigger drop in wellbeing. They can happen in thoughts, feelings, body sensations, behaviour, sleep, relationships, or daily routines.' },
      { heading: 'Common warning signs', body: 'Examples include sleeping much more or less, withdrawing, skipping meals, feeling unusually irritable, avoiding messages, racing thoughts, feeling hopeless, losing interest, increased worry, or stopping helpful routines.' },
      { heading: 'Your signs may be unique', body: 'Everyone\'s signs are different. Some people become restless, while others shut down. Some become more emotional, while others feel numb.' },
      { heading: 'Respond early', body: 'When warning signs appear, use your support plan early. This might include reducing pressure, using grounding, contacting support, completing a check-in, or telling your therapist.' },
      { heading: 'No shame', body: 'Warning signs are information, not failure. Noticing them is a skill.' }
    ],
    reflectionPrompt: 'What are your early warning signs that things may be getting harder?',
    patientExercise: 'List three early warning signs and one action you can take for each.',
    therapistNote: 'Help the patient connect warning signs to specific support steps.',
    safetyNote: 'This lesson is for education and reflection only. It does not replace therapy, medical advice, diagnosis, emergency support, or professional judgement. If you feel at immediate risk or in crisis, contact local emergency services or a crisis support line immediately.',
    completionLabel: 'I can identify early warning signs'
  },

  m3l3: {
    id: 'm3l3', moduleId: 3, lessonNumber: 13,
    moduleTitle: 'Module 3 — Progress, Reflection, and Relapse Prevention',
    title: 'Strengthening Coping Strategies',
    estimatedTime: '8–10 minutes',
    summary: 'Coping strategies are skills or actions that help you manage difficult moments. This lesson helps you review what works, what does not, and how to build a practical coping toolkit.',
    learningGoals: [
      'Understand different types of coping strategies.',
      'Identify strategies that already help.',
      'Build a flexible coping toolkit.',
      'Match strategies to different needs.'
    ],
    sections: [
      { heading: 'Coping strategies are tools', body: 'No single coping strategy works for every situation. A toolkit gives you options depending on what you need: calming, distraction, connection, expression, rest, problem-solving, or support.' },
      { heading: 'Different types of coping', body: 'Calming strategies include breathing, grounding, music, or quiet time. Practical strategies include making a list or reducing tasks. Connection strategies include messaging someone safe. Expression strategies include journaling, art, or talking.' },
      { heading: 'Notice what works', body: 'After using a strategy, ask: Did this help a little, a lot, or not today? A strategy that does not work once may still help another time.' },
      { heading: 'Make strategies easy to access', body: 'Keep coping strategies visible and simple. Add them to your support plan or TherapyLink™ notes so you do not have to remember them during distress.' },
      { heading: 'Review with your therapist', body: 'Your therapist can help adjust coping strategies and explore why some feel easier or harder.' }
    ],
    reflectionPrompt: 'Which coping strategy has helped you even slightly?',
    patientExercise: 'Create a coping toolkit with five strategies: one calming, one practical, one connection-based, one expressive, and one rest-based.',
    therapistNote: 'Review whether coping strategies are accessible, safe, and realistic for the patient\'s context.',
    safetyNote: 'This lesson is for education and reflection only. It does not replace therapy, medical advice, diagnosis, emergency support, or professional judgement. If you feel at immediate risk or in crisis, contact local emergency services or a crisis support line immediately.',
    completionLabel: 'I have strengthened my coping toolkit'
  },

  m3l4: {
    id: 'm3l4', moduleId: 3, lessonNumber: 14,
    moduleTitle: 'Module 3 — Progress, Reflection, and Relapse Prevention',
    title: 'Preparing for Therapy Sessions',
    estimatedTime: '8–10 minutes',
    summary: 'Preparing for therapy can help you make better use of your session time. This lesson helps you collect reflections, questions, progress notes, and concerns before meeting your therapist.',
    learningGoals: [
      'Prepare useful notes for therapy.',
      'Identify topics to discuss.',
      'Review check-in patterns.',
      'Communicate support needs clearly.'
    ],
    sections: [
      { heading: 'Why preparation helps', body: 'When emotions are high or time is limited, it can be hard to remember everything you wanted to say. Preparing notes can help you feel more organised and supported.' },
      { heading: 'Review recent check-ins', body: 'Look at mood, anxiety, stress, sleep, coping strategy use, and support flags. Notice anything that changed or repeated.' },
      { heading: 'Choose key topics', body: 'You might discuss triggers, difficult moments, progress, questions, coping strategies, medication concerns if relevant to your healthcare provider, relationship issues, work stress, or support needs.' },
      { heading: 'Share what feels hard to say', body: 'If something feels difficult to say aloud, writing it down can help. You might show your therapist your notes or use them as a starting point.' },
      { heading: 'End with next steps', body: 'After therapy, it can help to record one or two next steps so you know what to focus on before the next session.' }
    ],
    reflectionPrompt: 'What is one thing you want your therapist to understand at your next session?',
    patientExercise: 'Write three notes for your next session: one progress update, one difficulty, and one question.',
    therapistNote: 'Patient preparation notes may improve session focus and reveal concerns that are hard to verbalise.',
    safetyNote: 'This lesson is for education and reflection only. It does not replace therapy, medical advice, diagnosis, emergency support, or professional judgement. If you feel at immediate risk or in crisis, contact local emergency services or a crisis support line immediately.',
    completionLabel: 'I have prepared for my next therapy session'
  },

  m3l5: {
    id: 'm3l5', moduleId: 3, lessonNumber: 15,
    moduleTitle: 'Module 3 — Progress, Reflection, and Relapse Prevention',
    title: 'Building a Personal Recovery Plan',
    estimatedTime: '12–15 minutes',
    summary: 'A personal recovery plan brings together what you have learned about your wellbeing, triggers, coping strategies, support needs, and goals. This lesson helps you create a practical plan you can review with your therapist.',
    learningGoals: [
      'Bring together learning from the pathway.',
      'Identify strengths, triggers, and coping strategies.',
      'Create realistic recovery goals.',
      'Build a plan for continued support.'
    ],
    sections: [
      { heading: 'What is a recovery plan?', body: 'A recovery plan is a personal guide for supporting your wellbeing. It can include what helps, what makes things harder, who can support you, what to do during difficult moments, and what progress means to you.' },
      { heading: 'Include your strengths', body: 'Your strengths are part of the plan. These might include persistence, creativity, honesty, care for others, problem-solving, humour, patience, or the ability to keep trying.' },
      { heading: 'Include triggers and warning signs', body: 'List the situations, feelings, thoughts, or patterns that may affect your wellbeing. Include early warning signs so you can respond sooner.' },
      { heading: 'Include coping and support', body: 'Add coping strategies, daily routine anchors, support contacts, therapy goals, and crisis steps. Make the plan realistic and easy to follow.' },
      { heading: 'Keep the plan flexible', body: 'A recovery plan can change. Review it with your therapist and update it when you learn more about yourself.' }
    ],
    reflectionPrompt: 'What are the most important things your recovery plan should include?',
    patientExercise: 'Create a personal recovery plan with five sections: strengths, triggers, warning signs, coping strategies, and support contacts.',
    therapistNote: 'Use the recovery plan as a collaborative tool. Review for realism, safety, and patient ownership.',
    safetyNote: 'This lesson is for education and reflection only. It does not replace therapy, medical advice, diagnosis, emergency support, or professional judgement. If you feel at immediate risk or in crisis, contact local emergency services or a crisis support line immediately.',
    completionLabel: 'I have built my personal recovery plan'
  }

};


const COPING = [
  { id: 'breathing', icon: '🌬️', name: '4-7-8 Breathing', desc: 'Inhale 4, hold 7, exhale 8. Activates the parasympathetic nervous system to reduce anxiety quickly.', cat: 'Anxiety Relief' },
  { id: 'grounding', icon: '🌿', name: '5-4-3-2-1 Grounding', desc: 'Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. Anchors you in the present.', cat: 'Grounding' },
  { id: 'journaling', icon: '✍️', name: 'Reflective Journaling', desc: 'Write freely for 5–10 minutes without editing. Getting thoughts onto paper reduces emotional intensity.', cat: 'Emotional Processing' },
  { id: 'box',       icon: '📦', name: 'Box Breathing', desc: 'Breathe in 4, hold 4, out 4, hold 4. Regulates the nervous system under stress.', cat: 'Anxiety Relief' },
  { id: 'movement',  icon: '🏃', name: 'Movement Break', desc: 'A 5-minute walk or light stretch can significantly shift mood by processing stress hormones.', cat: 'Mood Lifting' },
  { id: 'selfcomp',  icon: '💛', name: 'Self-Compassion Pause', desc: 'Hand on heart, acknowledge your pain, remind yourself this is a shared human experience.', cat: 'Emotional Processing' },
  { id: 'mindful',   icon: '🧘', name: 'Mindful Observation', desc: 'Choose one object and observe it for 2 minutes — colour, texture, shape. Breaks anxious thought cycles.', cat: 'Grounding' },
  { id: 'music',     icon: '🎵', name: 'Music & Movement', desc: 'Put on a song that lifts your mood. Music engages emotional processing centres of the brain rapidly.', cat: 'Mood Lifting' },
  { id: 'cold',      icon: '❄️', name: 'Cold Water Reset', desc: 'Splash cold water on your face. Activates the dive reflex and rapidly calms the nervous system.', cat: 'Crisis Tool' },
  { id: 'talk',      icon: '💬', name: 'Connect & Share', desc: 'Reach out to one supportive person. Social connection is a powerful buffer against distress.', cat: 'Connection' },
];

const INSIGHTS = [
  'Recovery is not a straight line. Every small step forward matters, even when it does not feel like it.',
  'Your nervous system needs rest to heal. Small moments of calm each day add up to lasting change.',
  'Noticing how you feel without judging it is a skill — and you can get better at it with practice.',
  'Coping strategies work best when practised before crisis. Rehearsal builds resilience.',
  'Asking for support is a sign of self-awareness, not weakness. It takes courage to reach out.',
  'Difficult feelings are not permanent. They rise, peak, and pass like waves.',
  'Small, consistent actions build the foundation for recovery. You do not need to change everything at once.',
  'Your experiences are valid. What you are feeling makes sense in the context of what you have been through.',
  'Sleep and physical rest are essential components of mental health recovery, not luxuries.',
  'Every check-in you complete is an act of self-care. Well done for showing up today.',
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
const TOTAL_STEPS = 10;

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
      <div class="ob-logo"><div style="font-size:48px">🧠</div><div class="ob-brand">TherapyLink™</div><div class="ob-brand-sub">My Recovery Support</div></div>
      <h1 class="ob-title">Welcome to your Mental Health Recovery Portal</h1>
      <p class="ob-desc">Guided daily check-ins, wellbeing lessons, coping strategies, and progress tracking — all built around your recovery.</p>
      <div class="ob-feats">
        <div class="ob-feat"><span>📋</span>Daily wellbeing check-in (10 questions)</div>
        <div class="ob-feat"><span>🎓</span>Mental Health Recovery Pathway — 3 modules</div>
        <div class="ob-feat"><span>📈</span>Mood, anxiety &amp; sleep tracking</div>
        <div class="ob-feat"><span>🧘</span>Coping strategies &amp; wellbeing exercises</div>
      </div>
      <button class="btn-primary" onclick="obGo(1,2)">Set up my recovery profile →</button>
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
      <h2 class="ob-step-title">What are your wellbeing goals?</h2>
      <p class="ob-step-sub">Select everything relevant — helps personalise your Recovery Pathway.</p>
      <div class="ob-goals-grid" id="ob-goals">
        ${['Managing anxiety','Improving mood','Better sleep','Reducing stress','Building coping skills','Processing difficult feelings','Improving relationships','Building confidence','Managing intrusive thoughts','Trauma recovery'].map(g=>`<button class="ob-goal-btn" data-g="${g}" onclick="this.classList.toggle('active')">${g}</button>`).join('')}
      </div>
      <button class="btn-primary" style="margin-top:16px" onclick="obGo(3,4)">Next →</button>
    </div>
    <div class="ob-step" id="ob4">
      <button class="ob-back" onclick="obGo(4,3)">‹ Back</button>
      <div class="ob-step-num">Step 3 of 3</div>
      <h2 class="ob-step-title">Your experience with mental health support</h2>
      <p class="ob-step-sub">Helps calibrate lesson depth and guidance.</p>
      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px" id="ob-exp">
        <button class="ob-goal-btn" style="padding:14px;text-align:left;border-radius:var(--r)" data-e="new" onclick="selOb(this,'ob-exp')"><strong>New to mental health support</strong><br/><span style="font-size:12px;color:var(--muted)">Just starting to explore therapy and wellbeing</span></button>
        <button class="ob-goal-btn" style="padding:14px;text-align:left;border-radius:var(--r)" data-e="some" onclick="selOb(this,'ob-exp')"><strong>Some experience</strong><br/><span style="font-size:12px;color:var(--muted)">Had some therapy or tried wellbeing tools before</span></button>
        <button class="ob-goal-btn" style="padding:14px;text-align:left;border-radius:var(--r)" data-e="ongoing" onclick="selOb(this,'ob-exp')"><strong>Ongoing support</strong><br/><span style="font-size:12px;color:var(--muted)">Currently working with a therapist, want extra support</span></button>
      </div>
      <button class="btn-primary" onclick="obFinish()">Set up my recovery portal →</button>
    </div>
    <div class="ob-step" id="ob5">
      <div class="ob-ready-icon">✨</div>
      <div class="ob-ready-title">You're all set!</div>
      <div class="ob-ready-sub">Your personalised recovery portal is ready.</div>
      <div class="ob-summary" id="ob-summary"></div>
      <div class="safety-notice">
        <h4>⚠️ Important</h4>
        <p>This app supports mental health education, reflection, and therapist-guided monitoring. It does not provide emergency support or replace professional care. If you feel at immediate risk or in crisis, contact local emergency services or a crisis support line immediately.</p>
      </div>
      <button class="btn-primary" onclick="launchPortal()">Open My Recovery Portal →</button>
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
  launchPortal();
}
function obFinish() {
  const name = (document.getElementById('ob-name').value.trim()) || 'Friend';
  const age  = (document.querySelector('#ob-age .ob-goal-btn.active') || {}).dataset?.age || '';
  const goals = [...document.querySelectorAll('#ob-goals .ob-goal-btn.active')].map(b => b.dataset.g);
  const exp   = (document.querySelector('#ob-exp .ob-goal-btn.active') || {}).dataset?.e || '';
  profile = { name, age, goals, exp, createdAt: Date.now() };
  sSet('ap3x_patient_profile', profile);
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
      <div class="ph-brand"><div class="brand-dot"></div><div><div class="brand-name">TherapyLink™</div><div class="brand-sub">My Recovery Support</div></div></div>
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
      <button class="nav-tab active" id="tab-btn-home" onclick="switchTab('home')"><span style="font-size:20px">🏠</span>Home</button>
      <button class="nav-tab" id="tab-btn-checkin" onclick="switchTab('checkin')"><span style="font-size:20px">📋</span>Check-In<span class="notif-dot" id="checkin-dot" style="display:none"></span></button>
      <button class="nav-tab" id="tab-btn-lessons" onclick="switchTab('lessons')"><span style="font-size:20px">🎓</span>Lessons</button>
      <button class="nav-tab" id="tab-btn-coping" onclick="switchTab('coping')"><span style="font-size:20px">🧘</span>Coping</button>
      <button class="nav-tab" id="tab-btn-progress" onclick="switchTab('progress')"><span style="font-size:20px">📈</span>Progress</button>
    </nav>
    <div id="tab-home" class="tab-page"></div>
    <div id="tab-checkin" class="tab-page hidden"></div>
    <div id="tab-lessons" class="tab-page hidden"></div>
    <div id="tab-coping" class="tab-page hidden"></div>
    <div id="tab-progress" class="tab-page hidden"></div>`;
}

function toggleTheme() { dark = !dark; sSet('ap3x_patient_theme', dark ? 'dark' : 'light'); applyTheme(); }

function switchTab(name) {
  document.querySelectorAll('.tab-page').forEach(p => p.classList.add('hidden'));
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.remove('hidden');
  document.getElementById('tab-btn-' + name).classList.add('active');
}

function renderAll() {
  renderHome();
  renderCheckin();
  renderLessons();
  renderCoping();
  renderProgress();
  updateHeader();
}

// ── Header / streak ───────────────────────────────────────────────
function updateHeader() {
  const todayStr = new Date().toDateString();
  const todayDone = lastCIDate === todayStr;
  const dot = document.getElementById('checkin-dot');
  if (dot) dot.style.display = todayDone ? 'none' : 'block';
  document.getElementById('xp-chip').textContent = '⚡ ' + xp + ' XP';
  if (streak > 0) {
    document.getElementById('streak-banner').style.display = 'flex';
    document.getElementById('streak-text').textContent = streak + '-day streak';
    document.getElementById('streak-xp-val').textContent = xp + ' XP';
  }
}

// ── HOME ──────────────────────────────────────────────────────────
function renderHome() {
  const hr = new Date().getHours();
  const greet = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
  const todayDone = lastCIDate === new Date().toDateString();
  const totalLessons = Object.values(lessonDone).filter(Boolean).length;
  const crisisName    = sGet('4p3x_crisis_name', '');
  const crisisContact = sGet('4p3x_crisis_contact', '');
  const insight = INSIGHTS[new Date().getDate() % INSIGHTS.length];

  document.getElementById('tab-home').innerHTML = `
    <div class="home-hero">
      <div class="hh-title">${greet}, ${profile ? profile.name : 'Friend'} 👋</div>
      <div class="hh-sub">Your recovery journey continues today.</div>
    </div>
    <div class="quick-grid">
      <button class="qa-btn" onclick="switchTab('checkin')"><div class="qa-icon">📋</div><div class="qa-label">Daily Check-In</div><div class="qa-desc">${todayDone ? '✅ Completed today' : 'Complete today\'s check-in'}</div></button>
      <button class="qa-btn" onclick="switchTab('lessons')"><div class="qa-icon">🎓</div><div class="qa-label">Recovery Pathway</div><div class="qa-desc">${totalLessons}/15 lessons complete</div></button>
      <button class="qa-btn" onclick="switchTab('coping')"><div class="qa-icon">🧘</div><div class="qa-label">Coping Strategies</div><div class="qa-desc">10 techniques available</div></button>
      <button class="qa-btn" onclick="switchTab('progress')"><div class="qa-icon">📈</div><div class="qa-label">My Progress</div><div class="qa-desc">${checkins.length} check-ins logged</div></button>
    </div>
    <div class="insight-card"><h4>💡 Today's Insight</h4><p>${insight}</p></div>
    <div class="safety-notice">
      <h4>⚠️ Support Notice</h4>
      <p>This app supports your wellbeing between therapy sessions. It does not replace professional care. If you are in crisis or immediate danger, contact emergency services or a crisis support line now.</p>
      ${crisisName && crisisContact ? `<p style="margin-top:6px;font-size:12px;color:var(--muted)">Crisis support: <strong>${crisisName} — ${crisisContact}</strong></p>` : ''}
    </div>`;
}

// ── CHECK-IN ──────────────────────────────────────────────────────
function renderCheckin() {
  ciData = freshCIData(); ciStep = 1; selectedMood = null;
  document.getElementById('tab-checkin').innerHTML = buildCheckinHTML();
  wireScales();
  wireCopingTags();
}

function buildCheckinHTML() {
  const todayDone = lastCIDate === new Date().toDateString();
  if (todayDone && checkins.length > 0) {
    const last = checkins[0];
    return `<div class="section-title">Daily Check-In</div><div class="section-sub">10 questions · Takes about 3 minutes</div>
    <div style="text-align:center;padding:20px 0"><div style="font-size:56px;margin-bottom:12px">✅</div><div style="font-size:20px;font-weight:700;margin-bottom:8px">Today's Check-In Complete</div><div style="font-size:14px;color:var(--muted);margin-bottom:20px">Anxiety: ${last.anxiety}/10 · Mood: ${last.mood}/10 · Sleep: ${last.sleep}/10</div><button class="btn-secondary" onclick="renderCheckin();document.getElementById('checkin-done-notice').style.display='none'">Complete another check-in</button></div>
    <div id="checkin-done-notice"></div>`;
  }
  return `<div class="section-title">Daily Check-In</div><div class="section-sub">10 questions · Takes about 3 minutes</div>
  <div id="ci-result" style="display:none"></div>
  <div id="ci-form">
    <div class="step-progress"><div class="step-progress-bar" id="ci-bar" style="width:10%"></div></div>
    <div class="step-dots" id="ci-dots">${Array.from({length:10},(_,i)=>`<div class="step-dot${i===0?' active':''}" id="ci-dot-${i+1}"></div>`).join('')}</div>
    <div class="ci-step active" id="ci-1">
      <div class="ci-q">1. How would you rate your mood today?</div><div class="ci-sub">Select the emoji that best matches how you feel right now</div>
      <div class="mood-row">
        ${[{v:1,e:'😔',l:'Very Low'},{v:3,e:'😕',l:'Low'},{v:5,e:'😐',l:'Neutral'},{v:7,e:'🙂',l:'Good'},{v:9,e:'😊',l:'Great'}].map(m=>`<button class="mood-btn" data-mood="${m.v}" onclick="pickMood(this)"><span class="mood-emoji">${m.e}</span><span class="mood-label">${m.l}</span></button>`).join('')}
      </div>
      <div class="btn-row"><button class="btn-secondary" onclick="">—</button><button class="btn-primary" onclick="ciNext(1)">Next →</button></div>
    </div>
    <div class="ci-step hidden" id="ci-2">
      <div class="ci-q">2. How would you rate your anxiety or stress today?</div><div class="ci-sub">0 = No anxiety at all · 10 = Extreme anxiety</div>
      <div class="scale-card"><div class="scale-lbl-row"><span>None</span><span>Moderate</span><span>Extreme</span></div><div class="scale-track" id="anxiety-scale"></div><div class="score-val" id="anxiety-val">—</div><div class="score-desc" id="anxiety-desc"></div></div>
      <div class="btn-row"><button class="btn-secondary" onclick="ciBack(2)">Back</button><button class="btn-primary" onclick="ciNext(2)">Next →</button></div>
    </div>
    <div class="ci-step hidden" id="ci-3">
      <div class="ci-q">3. How well did you sleep last night?</div><div class="ci-sub">0 = Did not sleep · 10 = Excellent sleep</div>
      <div class="scale-card"><div class="scale-lbl-row"><span>Very Poor</span><span>Fair</span><span>Excellent</span></div><div class="scale-track" id="sleep-scale"></div><div class="score-val" id="sleep-val">—</div></div>
      <div class="btn-row"><button class="btn-secondary" onclick="ciBack(3)">Back</button><button class="btn-primary" onclick="ciNext(3)">Next →</button></div>
    </div>
    <div class="ci-step hidden" id="ci-4">
      <div class="ci-q">4. How much energy do you feel you have today?</div><div class="ci-sub">0 = Exhausted · 10 = Full of energy</div>
      <div class="scale-card"><div class="scale-lbl-row"><span>Exhausted</span><span>Moderate</span><span>Energised</span></div><div class="scale-track" id="energy-scale"></div><div class="score-val" id="energy-val">—</div></div>
      <div class="btn-row"><button class="btn-secondary" onclick="ciBack(4)">Back</button><button class="btn-primary" onclick="ciNext(4)">Next →</button></div>
    </div>
    <div class="ci-step hidden" id="ci-5">
      <div class="ci-q">5. Have you used any coping strategies today?</div><div class="ci-sub">Breathing, journaling, exercise, talking to someone…</div>
      <div class="form-card">
        <div class="yn-row"><button class="yn-btn yes" id="yn-coping-yes" onclick="ynPick('coping','yes')">✓ Yes</button><button class="yn-btn no" id="yn-coping-no" onclick="ynPick('coping','no')">✗ No</button></div>
        <div id="coping-which" style="display:none;margin-top:12px"><label class="form-label">Which strategies?</label><div class="tag-group" id="coping-tags">
          ${['Breathing exercises','Journaling','Mindfulness','Exercise','Talking to someone','Grounding','Music','Rest / Self-care'].map(c=>`<button class="tag" data-c="${c}">${c}</button>`).join('')}
        </div></div>
      </div>
      <div class="btn-row"><button class="btn-secondary" onclick="ciBack(5)">Back</button><button class="btn-primary" onclick="ciNext(5)">Next →</button></div>
    </div>
    <div class="ci-step hidden" id="ci-6">
      <div class="ci-q">6. Have you felt overwhelmed today?</div><div class="ci-sub">Feeling like things are too much to handle</div>
      <div class="form-card"><div class="yn-row"><button class="yn-btn yes" id="yn-overwhelmed-yes" onclick="ynPick('overwhelmed','yes')">✓ Yes</button><button class="yn-btn no" id="yn-overwhelmed-no" onclick="ynPick('overwhelmed','no')">✗ No</button></div></div>
      <div class="btn-row"><button class="btn-secondary" onclick="ciBack(6)">Back</button><button class="btn-primary" onclick="ciNext(6)">Next →</button></div>
    </div>
    <div class="ci-step hidden" id="ci-7">
      <div class="ci-q">7. Have you had difficulty concentrating today?</div><div class="ci-sub">Trouble focusing on tasks or conversations</div>
      <div class="form-card"><div class="yn-row"><button class="yn-btn yes" id="yn-conc-yes" onclick="ynPick('conc','yes')">✓ Yes</button><button class="yn-btn no" id="yn-conc-no" onclick="ynPick('conc','no')">✗ No</button></div></div>
      <div class="btn-row"><button class="btn-secondary" onclick="ciBack(7)">Back</button><button class="btn-primary" onclick="ciNext(7)">Next →</button></div>
    </div>
    <div class="ci-step hidden" id="ci-8">
      <div class="ci-q">8. Have you connected with anyone supportive today?</div><div class="ci-sub">A friend, family member, therapist, or support group</div>
      <div class="form-card"><div class="yn-row"><button class="yn-btn yes" id="yn-conn-yes" onclick="ynPick('conn','yes')">✓ Yes</button><button class="yn-btn no" id="yn-conn-no" onclick="ynPick('conn','no')">✗ Not today</button></div></div>
      <div class="btn-row"><button class="btn-secondary" onclick="ciBack(8)">Back</button><button class="btn-primary" onclick="ciNext(8)">Next →</button></div>
    </div>
    <div class="ci-step hidden" id="ci-9">
      <div class="ci-q">9. Is there anything you want your therapist to know?</div><div class="ci-sub">Optional — visible in your therapist's review dashboard</div>
      <div class="form-card"><textarea id="ci-note" class="form-textarea" placeholder="e.g. I've been finding mornings really hard this week…" rows="4"></textarea></div>
      <div class="btn-row"><button class="btn-secondary" onclick="ciBack(9)">Back</button><button class="btn-primary" onclick="ciNext(9)">Next →</button></div>
    </div>
    <div class="ci-step hidden" id="ci-10">
      <div class="ci-q">10. Do you feel you need extra support before your next session?</div><div class="ci-sub">Flags to your therapist that you may need earlier contact</div>
      <div class="form-card">
        <div class="yn-row"><button class="yn-btn yes" id="yn-support-yes" onclick="ynPick('support','yes')">✓ Yes, I need support</button><button class="yn-btn no" id="yn-support-no" onclick="ynPick('support','no')">✗ I'm okay until then</button></div>
        <div style="margin-top:14px;padding:12px;background:rgba(239,68,68,.08);border-radius:var(--rs);border:1px solid rgba(239,68,68,.2);font-size:12px;color:var(--muted);line-height:1.6">⚠️ If you are in immediate danger or crisis, do not wait — contact local emergency services or a crisis support line <strong>now</strong>. This check-in is not monitored in real-time.</div>
      </div>
      <div class="btn-row"><button class="btn-secondary" onclick="ciBack(10)">Back</button><button class="btn-primary" style="flex:2" onclick="submitCheckin()">Submit Check-In ✓</button></div>
    </div>
  </div>`;
}

function wireScales() {
  [['anxiety-scale','anxiety-val','anxiety-desc',true],['sleep-scale','sleep-val',null,false],['energy-scale','energy-val',null,false]].forEach(([id,valId,descId,inv]) => {
    const wr = document.getElementById(id); if (!wr) return;
    for (let i = 0; i <= 10; i++) {
      const b = document.createElement('button'); b.className = 'scale-btn'; b.dataset.v = i; b.textContent = i;
      b.addEventListener('click', () => {
        wr.querySelectorAll('.scale-btn').forEach(x => x.classList.remove('sel')); b.classList.add('sel');
        document.getElementById(valId).textContent = i;
        if (descId) { const m = inv?{0:'None',1:'Very Mild',3:'Mild',5:'Moderate',7:'Elevated',9:'Very High',10:'Extreme'}:{0:'Very Poor',3:'Poor',5:'Fair',7:'Good',10:'Excellent'}; document.getElementById(descId).textContent = m[i] || ''; }
        if (id === 'anxiety-scale') ciData.anxiety = i;
        else if (id === 'sleep-scale') ciData.sleep = i;
        else ciData.energy = i;
      });
      wr.appendChild(b);
    }
  });
}

function wireCopingTags() {
  const tags = document.querySelectorAll('#coping-tags .tag');
  tags.forEach(t => t.addEventListener('click', () => {
    t.classList.toggle('active');
    ciData.copingList = [...document.querySelectorAll('#coping-tags .tag.active')].map(x => x.dataset.c);
  }));
}

function updateCiProgress(step) {
  document.getElementById('ci-bar').style.width = ((step / TOTAL_STEPS) * 100) + '%';
  for (let i = 1; i <= TOTAL_STEPS; i++) {
    const d = document.getElementById('ci-dot-' + i);
    if (d) d.className = 'step-dot' + (i < step ? ' done' : i === step ? ' active' : '');
  }
}

function pickMood(btn) {
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel'); ciData.mood = parseInt(btn.dataset.mood);
}

function ynPick(key, val) {
  ciData[key] = val;
  const yEl = document.getElementById('yn-'+key+'-yes'), nEl = document.getElementById('yn-'+key+'-no');
  if (yEl) yEl.classList.toggle('sel', val === 'yes');
  if (nEl) nEl.classList.toggle('sel', val === 'no');
  if (key === 'coping') document.getElementById('coping-which').style.display = val === 'yes' ? 'block' : 'none';
  if (key === 'support' && val === 'yes') showToast('⚠️ Your therapist will see this. If in crisis, contact emergency services now.');
}

function ciNext(step) {
  if (step === 1 && ciData.mood === null) return showToast('Please select your mood');
  if (step === 2 && ciData.anxiety === null) return showToast('Please select an anxiety score');
  if (step === 3 && ciData.sleep === null) return showToast('Please select a sleep score');
  if (step === 4 && ciData.energy === null) return showToast('Please select an energy score');
  document.getElementById('ci-'+step).classList.add('hidden');
  ciStep = step + 1;
  document.getElementById('ci-'+ciStep).classList.remove('hidden');
  updateCiProgress(ciStep);
}
function ciBack(step) {
  document.getElementById('ci-'+step).classList.add('hidden');
  ciStep = step - 1;
  document.getElementById('ci-'+ciStep).classList.remove('hidden');
  updateCiProgress(ciStep);
}

function submitCheckin() {
  ciData.note = (document.getElementById('ci-note') || {}).value?.trim() || '';
  const risk = calcRisk(ciData);
  const record = { id: 'ci_' + Date.now(), date: Date.now(), dateStr: new Date().toDateString(), ...ciData, risk };
  checkins.unshift(record); if (checkins.length > 365) checkins.pop();
  sSet('ap3x_patient_checkins', checkins);
  // Queue check-in for backend-ready sync
  tlEnqueueSync('checkin', { ...ciData, submitted_at: new Date().toISOString() });
  const todayStr = new Date().toDateString();
  if (lastCIDate !== todayStr) {
    const yest = new Date(Date.now() - 86400000).toDateString();
    streak = lastCIDate === yest ? streak + 1 : 1;
    lastCIDate = todayStr;
    sSet('ap3x_streak', streak); sSet('ap3x_last_checkin_date', todayStr);
  }
  xp += 20; sSet('ap3x_xp', xp);
  showCheckinResult(record, risk);
  updateHeader(); renderHome(); renderProgress();
}

function calcRisk(d) {
  if (d.anxiety >= 8 || d.mood <= 2 || d.support === 'yes') return 'CRITICAL';
  if (d.anxiety >= 6 || d.mood <= 3 || (d.overwhelmed === 'yes' && d.sleep <= 3)) return 'HIGH';
  if (d.anxiety >= 4 || d.overwhelmed === 'yes') return 'MEDIUM';
  return 'LOW';
}

function showCheckinResult(record, risk) {
  document.getElementById('ci-form').style.display = 'none';
  const tips = {
    LOW:      ['Well done on completing your check-in today.','Keep using the coping strategies that are working for you.','Consistency is key — every check-in adds to your recovery.'],
    MEDIUM:   ['You showed real self-awareness by completing your check-in.','Consider a grounding exercise if feelings intensify.','Reaching out to someone supportive today could help.'],
    HIGH:     ['Thank you for being honest in your check-in. That takes courage.','Try a breathing exercise now — even 2 minutes can help.','If feelings intensify, please contact your therapist or support line.'],
    CRITICAL: ['Your responses suggest you may be having a very hard time right now.','Please reach out to your therapist or a trusted person as soon as possible.','If you are in immediate danger, contact emergency services now.']
  };
  const labels = { LOW: '✅ Low', MEDIUM: '⚡ Medium', HIGH: '⚠️ High', CRITICAL: '🚨 Needs Review' };
  document.getElementById('ci-result').style.display = 'block';
  document.getElementById('ci-result').innerHTML = `
    <div style="text-align:center;padding:16px 0 8px"><div style="font-size:48px;margin-bottom:10px">✅</div><div style="font-size:19px;font-weight:700;margin-bottom:4px">Check-In Recorded</div><div style="font-size:13px;color:var(--muted)">Mood: ${record.mood}/10 · Anxiety: ${record.anxiety}/10 · Sleep: ${record.sleep}/10</div></div>
    <div class="feedback-card risk-${risk.toLowerCase()}">
      <div style="margin-bottom:8px"><span class="risk-badge ${risk}">${labels[risk]}</span></div>
      <div class="fc-tips">${(tips[risk]||tips.LOW).map(t=>`<div class="fc-tip">${t}</div>`).join('')}</div>
      ${risk==='CRITICAL'||risk==='HIGH'?`<button class="btn-emergency" onclick="showToast('Contact your therapist or local emergency services immediately.')">🆘 Access Crisis Support Info</button>`:''}
    </div>
    <button class="btn-secondary" style="margin-top:16px" onclick="renderCheckin()">Complete Another Check-In</button>`;
}

// ── LESSONS ───────────────────────────────────────────────────────
function renderLessons() {
  const existing = document.getElementById('lesson-detail-panel');
  if (existing) existing.remove();
  document.getElementById('tab-lessons').innerHTML = `
    <div class="section-title">Mental Health Recovery Pathway</div>
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
    + '</div>'
    + '<div id="ld-complete-bar" style="position:fixed;bottom:0;left:0;right:0;padding:14px 16px;background:var(--surface);border-top:1.5px solid var(--border);box-shadow:0 -4px 16px rgba(0,0,0,.3);z-index:20;max-width:480px;margin:0 auto">'
    + '<button id="ld-complete-btn" onclick="completeLessonFromDetail(\'' + id + '\',' + xpVal + ')" style="width:100%;padding:14px;background:' + (isDone ? 'var(--green)' : 'var(--gold)') + ';color:#000;border:none;border-radius:var(--r);font-size:15px;font-weight:700;cursor:pointer">'
    + (isDone ? '\u2713 ' + lc.completionLabel : lc.completionLabel)
    + '</button></div>';

  document.body.appendChild(panel);
  panel.scrollTop = 0;
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
  if (field && field.value.trim()) sSet('tl_lesson_note_' + id, field.value.trim());
  if (!lessonDone[id]) {
    lessonDone[id] = Date.now();
    xp += xpVal;
    sSet('ap3x_xp', xp);
    showToast('+' + xpVal + ' XP \u2014 Lesson complete! \u2713');
  }
  sSet('ap3x_lesson_progress', lessonDone);
  // Queue lesson progress for backend-ready sync
  tlEnqueueSync('lesson_progress', { lessonId: id, completedAt: new Date().toISOString(), xpAwarded: xpVal });
  renderProgress(); updateHeader();
  var btn = document.getElementById('ld-complete-btn');
  var lc = LESSON_CONTENT[id];
  if (btn && lc) { btn.textContent = '\u2713 ' + lc.completionLabel; btn.style.background = 'var(--green)'; }
  renderLessons();
}

// ── COPING ────────────────────────────────────────────────────────
function renderCoping() {
  document.getElementById('tab-coping').innerHTML = `
    <div class="section-title">Coping Strategies</div>
    <div class="section-sub">Wellbeing exercises for everyday support</div>
    ${COPING.map(s => `<div class="coping-card">
      <div class="coping-icon">${s.icon}</div>
      <div class="coping-body">
        <div class="coping-name">${s.name}</div>
        <div class="coping-desc">${s.desc}</div>
        <span class="coping-cat">${s.cat}</span>
        <div style="margin-top:10px"><button class="btn-sm ${copingUsed.includes(s.id)?'filled':''}" onclick="markCoping('${s.id}')">${copingUsed.includes(s.id)?'✓ Used today':'Mark as used today'}</button></div>
      </div>
    </div>`).join('')}`;
}

function markCoping(id) {
  if (!copingUsed.includes(id)) { copingUsed.push(id); xp += 5; sSet('ap3x_xp', xp); showToast('+5 XP — Coping strategy logged ✓'); }
  sSet('ap3x_coping_used', copingUsed);
  renderCoping(); updateHeader();
}

// ── PROGRESS ──────────────────────────────────────────────────────
function renderProgress() {
  const totalL  = Object.values(lessonDone).filter(Boolean).length;
  const recent  = checkins.slice(0, 7);
  const avgAnx  = recent.length ? (recent.reduce((a, c) => a + (c.anxiety || 0), 0) / recent.length).toFixed(1) : '—';
  const avgMood = recent.length ? (recent.reduce((a, c) => a + (c.mood || 0), 0) / recent.length).toFixed(1) : '—';

  document.getElementById('tab-progress').innerHTML = `
    <div class="section-title">My Progress</div>
    <div class="section-sub">Your personal recovery journey at a glance</div>
    <div class="prog-grid">
      <div class="prog-stat"><div class="prog-val">${checkins.length}</div><div class="prog-lbl">Check-Ins</div></div>
      <div class="prog-stat"><div class="prog-val">${streak}</div><div class="prog-lbl">Day Streak</div></div>
      <div class="prog-stat"><div class="prog-val">${totalL}/15</div><div class="prog-lbl">Lessons Done</div></div>
      <div class="prog-stat"><div class="prog-val">${xp}</div><div class="prog-lbl">Total XP</div></div>
    </div>
    <div class="prog-grid">
      <div class="prog-stat"><div class="prog-val" style="font-size:20px">${avgAnx}</div><div class="prog-lbl">Avg Anxiety (7d)</div></div>
      <div class="prog-stat"><div class="prog-val" style="font-size:20px">${avgMood}</div><div class="prog-lbl">Avg Mood (7d)</div></div>
    </div>
    <div style="font-size:14px;font-weight:700;margin:16px 0 10px">Recent Check-Ins</div>
    ${checkins.length === 0
      ? '<p style="color:var(--muted);font-size:13px;padding:20px;text-align:center">No check-ins yet. Complete your first check-in to see your progress here.</p>'
      : checkins.slice(0, 10).map(c => {
          const sc = c.anxiety <= 3 ? 'sl' : c.anxiety <= 5 ? 'sm' : c.anxiety <= 7 ? 'sh' : 'sc';
          return `<div class="history-item">
            <div class="hi-score ${sc}">${c.anxiety}</div>
            <div class="hi-info">
              <div style="font-size:13px;font-weight:600">${new Date(c.date).toLocaleDateString()} <span class="risk-badge ${c.risk}" style="font-size:10px;padding:2px 8px">${c.risk}</span></div>
              <div class="hi-date">Mood: ${c.mood}/10 · Sleep: ${c.sleep}/10 · Energy: ${c.energy}/10</div>
              ${c.note ? `<div class="hi-note" style="color:var(--muted)">📝 ${c.note}</div>` : ''}
            </div>
          </div>`;
        }).join('')}
    <div class="safety-notice" style="margin-top:20px">
      <h4>⚠️ Recovery Support Notice</h4>
      <p>This app supports mental health education, reflection, and therapist-guided monitoring. It does not provide emergency support or replace professional care. If you feel at immediate risk or in crisis, contact local emergency services or a crisis support line immediately. Created by Kyzel Kreates · Powered by 4P3X Intelligent AI.</p>
    </div>`;
}

// ── Toast ─────────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 2800);
}
