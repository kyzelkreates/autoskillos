/* AutoSkill OS™ — Training Module Content
   Manufacturing Training Pathway — 3 Modules / 15 Process Modules
   Powered by 4P3X Intelligent AI™ · Created by Kyzel Kreates™
   ─────────────────────────────────────────────────────────
   This file is the Single Source of Truth for all lesson body content.
   Imported/inlined by patient-demo.html and patient-app.js.
   IDs match CURRICULUM ids: m1l1–m3l5.
*/

const LESSON_CONTENT = {

  /* ── MODULE 1 ─────────────────────────────────────────── */

  m1l1: {
    id: 'm1l1', moduleId: 1, lessonNumber: 1,
    moduleTitle: 'Module 1 — Manufacturing Site Orientation',
    title: 'Understanding Your Workstation',
    estimatedTime: '8–10 minutes',
    summary: 'Recovery is not always a straight line. Some days may feel easier, while others may feel more difficult. This lesson helps you understand recovery as a process of learning, noticing patterns, building support, and taking small steps that help you feel safer and more able to cope.',
    learningGoals: [
      'Understand that recovery can look different for every person.',
      'Recognise that progress can happen gradually.',
      'Learn why small steps matter.',
      'Understand how AutoSkill OS™ can support reflection between sessions.'
    ],
    sections: [
      { heading: 'Recovery is personal', body: 'Workplace competency development does not mean feeling perfect all the time. It can mean understanding yourself better, recognising what affects your performance, learning coping strategies, and feeling more able to ask for help when needed. Everyone\'s recovery looks different.' },
      { heading: 'Progress is not always linear', body: 'It is normal to have good days, difficult days, and days that feel somewhere in between. A difficult day does not mean you have failed. It may simply show that your mind and body need care, rest, support, or a different strategy.' },
      { heading: 'Small steps count', body: 'Small actions can support recovery. This might include completing a check-in, noticing a trigger, using a breathing exercise, writing down a thought, contacting someone supportive, or attending a training session. These steps can build confidence over time.' },
      { heading: 'Why tracking helps', body: 'Tracking process accuracy, check-in frequency, and training progress can help you and your supervisor notice patterns. These patterns may help guide future support and make supervisor check-ins more focused.' },
      { heading: 'Using AutoSkill OS™', body: 'AutoSkill OS™ is designed to support training, learning, and supervisor-guided competency tracking. It is not an emergency service and does not replace professional care. Use it as a support tool between sessions.' }
    ],
    reflectionPrompt: 'What would progress look like for you this week, even if it is only a small step?',
    learnerTask: 'Write down one small action you can take today to support your performance.',
    supervisorNote: 'Review the patient\'s definition of progress. It may reveal expectations, pressure points, or opportunities for realistic goal-setting.',
    platformNote: 'This training module is for learning and reflection only. It does not replace site-specific safety protocols, supervisor guidance, or emergency procedures. For on-site emergencies, follow your site emergency procedure immediately.',
    completionLabel: 'I understand my workstation layout and responsibilities'
  },

  m1l2: {
    id: 'm1l2', moduleId: 1, lessonNumber: 2,
    moduleTitle: 'Module 1 — Manufacturing Site Orientation',
    title: 'Health, Safety and PPE Basics',
    estimatedTime: '8–10 minutes',
    summary: 'Mood, anxiety, and stress can affect thoughts, feelings, body sensations, and behaviour. This lesson helps you understand how these experiences can show up and why tracking them may help you and your supervisor recognise useful patterns.',
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
    learnerTask: 'Choose one word that describes how you feel today. Then rate your mood and stress from 1–10.',
    supervisorNote: 'Look for differences between patient ratings and written descriptions. These may help guide conversation.',
    platformNote: 'This training module is for learning and reflection only. It does not replace site-specific safety protocols, supervisor guidance, or emergency procedures. For on-site emergencies, follow your site emergency procedure immediately.',
    completionLabel: 'I understand the key health, safety and PPE requirements'
  },

  m1l3: {
    id: 'm1l3', moduleId: 1, lessonNumber: 3,
    moduleTitle: 'Module 1 — Manufacturing Site Orientation',
    title: 'Assembly Line Process Overview',
    estimatedTime: '10–12 minutes',
    summary: 'Triggers are situations, thoughts, memories, sensations, or events that can affect process performance. This lesson helps you identify possible triggers gently and safely without judging yourself.',
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
      { heading: 'Building awareness', body: 'Over time, trigger tracking can help you and your supervisor identify patterns. This can support planning, coping strategies, boundaries, and safer responses.' }
    ],
    reflectionPrompt: 'What is one situation that often affects your performance?',
    learnerTask: 'Write down one possible trigger and one supportive response you could try next time.',
    supervisorNote: 'Review trigger notes carefully and avoid pushing for detail too quickly. Focus on safety, pacing, and stabilisation.',
    platformNote: 'This training module is for learning and reflection only. It does not replace site-specific safety protocols, supervisor guidance, or emergency procedures. For on-site emergencies, follow your site emergency procedure immediately.',
    completionLabel: 'I can recognise some of my triggers'
  },

  m1l4: {
    id: 'm1l4', moduleId: 1, lessonNumber: 4,
    moduleTitle: 'Module 1 — Manufacturing Site Orientation',
    title: 'Workstation Readiness',
    estimatedTime: '8–10 minutes',
    summary: 'Tracking can help you notice patterns in mood, stress, sleep, energy, coping strategies, and support needs. This lesson explains how to track safely without becoming overwhelmed or overly self-critical.',
    learningGoals: [
      'Understand the value of pattern tracking.',
      'Learn what to track.',
      'Avoid turning tracking into pressure.',
      'Use check-ins as supportive information.'
    ],
    sections: [
      { heading: 'Why patterns matter', body: 'Training progress can feel uneven, but patterns often appear over time. You may notice that stress rises after poor sleep, mood drops after isolation, or coping improves after routine, movement, connection, or rest.' },
      { heading: 'What can be tracked', body: 'Useful areas include mood, anxiety, stress, sleep, energy, appetite, concentration, coping strategies, social connection, symptoms, triggers, and notes for your supervisor.' },
      { heading: 'Tracking should not become punishment', body: 'Tracking is not about judging yourself or getting a perfect score. It is about gathering information. Missing a check-in does not mean failure. It may itself be useful information.' },
      { heading: 'Look for trends, not single days', body: 'One difficult day does not define your recovery. Patterns become clearer when you look across several days or weeks. Your supervisor can help interpret what the data might mean.' },
      { heading: 'Keep it simple', body: 'A short check-in is enough. You do not need long explanations every day. Even a mood score, sleep rating, and one sentence can be useful.' }
    ],
    reflectionPrompt: 'What pattern would be useful for you and your supervisor to understand better?',
    learnerTask: 'Complete today\'s check-in and add one short note about what may have affected your performance.',
    supervisorNote: 'Encourage patients to use tracking as information, not performance. Watch for perfectionism or anxiety around recording data.',
    platformNote: 'This training module is for learning and reflection only. It does not replace site-specific safety protocols, supervisor guidance, or emergency procedures. For on-site emergencies, follow your site emergency procedure immediately.',
    completionLabel: 'I understand how to track patterns safely'
  },

  m1l5: {
    id: 'm1l5', moduleId: 1, lessonNumber: 5,
    moduleTitle: 'Module 1 — Manufacturing Site Orientation',
    title: 'Tool Handling and Equipment Safety',
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
      { heading: 'Different levels of support', body: 'Support can include self-care, contacting a trusted person, messaging your supervisor if appropriate, using a support plan, contacting a GP or healthcare professional, or contacting emergency/crisis services if there is immediate risk.' },
      { heading: 'How to ask clearly', body: 'Simple phrases can help: "I am struggling today," "I need someone to check in," "I do not feel safe," "I need help making a plan," or "Can we talk about this in my next session?"' },
      { heading: 'Immediate risk', body: 'If you feel at immediate risk or unable to stay safe, do not wait for an app response. Contact local emergency services or a crisis support line immediately.' }
    ],
    reflectionPrompt: 'What signs tell you that you may need extra support?',
    learnerTask: 'Write one sentence you could use to ask for support when things feel difficult.',
    supervisorNote: 'Use this lesson to help patients build a realistic support plan and identify safe contacts and resources.',
    platformNote: 'This training module is for learning and reflection only. It does not replace site-specific safety protocols, supervisor guidance, or emergency procedures. For on-site emergencies, follow your site emergency procedure immediately.',
    completionLabel: 'I know when to ask for support'
  },

  /* ── MODULE 2 ─────────────────────────────────────────── */

  m2l1: {
    id: 'm2l1', moduleId: 2, lessonNumber: 6,
    moduleTitle: 'Module 2 — Quality Control and Process Standards',
    title: 'Quality Control and Defect Reporting',
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
    learnerTask: 'Try one breathing or grounding technique for two minutes and record how you feel afterwards.',
    supervisorNote: 'Check whether breathing exercises feel safe for the employee. Some patients may prefer grounding over breath focus.',
    platformNote: 'This training module is for learning and reflection only. It does not replace site-specific safety protocols, supervisor guidance, or emergency procedures. For on-site emergencies, follow your site emergency procedure immediately.',
    completionLabel: 'I have tried a grounding technique'
  },

  m2l2: {
    id: 'm2l2', moduleId: 2, lessonNumber: 7,
    moduleTitle: 'Module 2 — Quality Control and Process Standards',
    title: 'Production Workflow and Handover',
    estimatedTime: '10–12 minutes',
    summary: 'A training routine does not need to be complicated. Small, repeatable actions can support stability, recovery, and self-awareness. This lesson helps you build a simple routine that fits your real life.',
    learningGoals: [
      'Understand why a consistent routine supports training performance.',
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
    reflectionPrompt: 'What is one training action or process check you could complete consistently each shift?',
    learnerTask: 'Create a three-step routine for tomorrow, including one low-energy backup option.',
    supervisorNote: 'Review whether the patient\'s routine is realistic. Encourage flexible routines rather than perfectionistic plans.',
    platformNote: 'This training module is for learning and reflection only. It does not replace site-specific safety protocols, supervisor guidance, or emergency procedures. For on-site emergencies, follow your site emergency procedure immediately.',
    completionLabel: 'I have created a simple training routine'
  },

  m2l3: {
    id: 'm2l3', moduleId: 2, lessonNumber: 8,
    moduleTitle: 'Module 2 — Quality Control and Process Standards',
    title: 'Process Checkpoint Procedures',
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
    learnerTask: 'Write one overwhelming thought, then rewrite it as "I am having the thought that…" and add one balanced response.',
    supervisorNote: 'This exercise can reveal cognitive themes. Use gently and avoid debating thoughts too aggressively.',
    platformNote: 'This training module is for learning and reflection only. It does not replace site-specific safety protocols, supervisor guidance, or emergency procedures. For on-site emergencies, follow your site emergency procedure immediately.',
    completionLabel: 'I have practised creating space from thoughts'
  },

  m2l4: {
    id: 'm2l4', moduleId: 2, lessonNumber: 9,
    moduleTitle: 'Module 2 — Quality Control and Process Standards',
    title: 'Workstation Safety Checks',
    estimatedTime: '8–10 minutes',
    summary: 'Daily workstation safety checks are a critical part of manufacturing operations. This module helps you understand which checks to perform, when to perform them, and why they matter.',
    learningGoals: [
      'Understand the key safety checks required at your workstation each shift.',
      'Notice how rest affects mood and anxiety.',
      'Learn simple sleep-supportive habits.',
      'Identify one realistic rest goal.'
    ],
    sections: [
      { heading: 'Sleep affects coping', body: 'Poor sleep can make emotions feel stronger, reduce concentration, increase irritability, and make coping strategies harder to use. This does not mean you are failing; it means your system may be under strain.' },
      { heading: 'Readiness is not optional', body: 'Workstation readiness is part of every shift. Checks can include PPE inspection, tool condition, equipment calibration, surface cleanliness, and hazard identification.' },
      { heading: 'Create a pre-shift checklist', body: 'A pre-shift checklist tells you exactly what to verify before starting work. This could include PPE status, tool condition, workstation cleanliness, materials availability, and supervisor sign-on. tomorrow\'s tasks.' },
      { heading: 'Track without pressure', body: 'Tracking sleep quality can help identify patterns. Avoid judging yourself for poor sleep. Use it as information to discuss with your supervisor or healthcare professional if needed.' },
      { heading: 'When sleep problems persist', body: 'If sleep problems continue or severely affect daily life, consider discussing them with a healthcare professional. AutoSkill OS™ can support tracking, but it does not diagnose or treat sleep conditions.' }
    ],
    reflectionPrompt: 'How does your sleep usually affect your mood or stress?',
    learnerTask: 'Choose one small wind-down action to try tonight.',
    supervisorNote: 'Sleep tracking may reveal important training patterns. Explore without blame.',
    platformNote: 'This training module is for learning and reflection only. It does not replace site-specific safety protocols, supervisor guidance, or emergency procedures. For on-site emergencies, follow your site emergency procedure immediately.',
    completionLabel: 'I have chosen a rest-supportive action'
  },

  m2l5: {
    id: 'm2l5', moduleId: 2, lessonNumber: 10,
    moduleTitle: 'Module 2 — Quality Control and Process Standards',
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
      { heading: 'What is a support plan?', body: 'A support plan is a clear list of actions and contacts that can help when your performance drops or distress rises. It is easier to follow a plan when it is written before things feel overwhelming.' },
      { heading: 'Warning signs', body: 'Warning signs may include withdrawal, poor sleep, racing thoughts, feeling numb, irritability, avoiding responsibilities, increased anxiety, low mood, or feeling unable to cope.' },
      { heading: 'Coping actions', body: 'Helpful actions might include grounding, breathing, stepping outside, drinking water, eating something, reducing stimulation, writing thoughts down, using a routine, or contacting someone supportive.' },
      { heading: 'Support contacts', body: 'Include people or services you can contact. This may include trusted friends/family, your supervisor, your GP or healthcare provider, community support, crisis lines, or emergency services where appropriate.' },
      { heading: 'Crisis step', body: 'If you feel in immediate danger or unable to stay safe, contact local emergency services or a crisis support line immediately. Do not wait for a AutoSkill OS™ response.' }
    ],
    reflectionPrompt: 'What are your early signs that you may need extra support?',
    learnerTask: 'Create a simple support plan with three coping actions and two support contacts.',
    supervisorNote: 'Review the patient\'s support plan and help make it specific, realistic, and safe.',
    platformNote: 'This training module is for learning and reflection only. It does not replace site-specific safety protocols, supervisor guidance, or emergency procedures. For on-site emergencies, follow your site emergency procedure immediately.',
    completionLabel: 'I have created a support plan'
  },

  /* ── MODULE 3 ─────────────────────────────────────────── */

  m3l1: {
    id: 'm3l1', moduleId: 3, lessonNumber: 11,
    moduleTitle: 'Module 3 — Competency Assessment and Development',
    title: 'Reviewing Your Training Progress',
    estimatedTime: '8–10 minutes',
    summary: 'Progress can be easy to miss, especially when you are focused on what still feels difficult. This lesson helps you reflect on small changes, strengths, and patterns of improvement.',
    learningGoals: [
      'Recognise different types of progress.',
      'Notice small wins.',
      'Reflect without self-judgement.',
      'Prepare progress notes for your supervisor check-in.'
    ],
    sections: [
      { heading: 'Progress can be subtle', body: 'Progress may look like noticing a trigger sooner, asking for support, completing a check-in, using a coping strategy, attending a training session, resting instead of pushing through, or speaking to yourself more kindly.' },
      { heading: 'Progress is not perfection', body: 'You can be making progress and still have difficult days. Recovery does not require constant improvement. It often involves learning how to respond differently when difficulties appear.' },
      { heading: 'Look at evidence', body: 'Use check-ins, lesson completion, mood trends, notes, and coping strategy use as evidence. This can help you see change more clearly over time.' },
      { heading: 'Name strengths', body: 'Strengths might include persistence, honesty, courage, awareness, patience, creativity, care for others, or willingness to try. These strengths can support recovery.' },
      { heading: 'Bring progress to your check-in', body: 'Progress reflections can help your supervisor understand what is improving and where additional support is needs support.' }
    ],
    reflectionPrompt: 'What is one small sign of progress you have noticed recently?',
    learnerTask: 'Write down three small wins from the past week, even if they seem minor.',
    supervisorNote: 'Use employee reflections to reinforce realistic progress and identify helpful interventions.',
    platformNote: 'This training module is for learning and reflection only. It does not replace site-specific safety protocols, supervisor guidance, or emergency procedures. For on-site emergencies, follow your site emergency procedure immediately.',
    completionLabel: 'I have reflected on my progress'
  },

  m3l2: {
    id: 'm3l2', moduleId: 3, lessonNumber: 12,
    moduleTitle: 'Module 3 — Competency Assessment and Development',
    title: 'Recognising Process Errors Early',
    estimatedTime: '10–12 minutes',
    summary: 'Early warning signs are signals that your performance may be starting to decline. Recognising them early can help you respond before things feel unmanageable.',
    learningGoals: [
      'Understand early warning signs.',
      'Identify personal signs of decline.',
      'Connect warning signs to support actions.',
      'Build a prevention mindset.'
    ],
    sections: [
      { heading: 'What are early warning signs?', body: 'Early warning signs are changes that may appear before a bigger process error or performance drop. They can happen in thoughts, feelings, body sensations, behaviour, sleep, relationships, or daily routines.' },
      { heading: 'Common warning signs', body: 'Examples include sleeping much more or less, withdrawing, skipping meals, feeling unusually irritable, avoiding messages, racing thoughts, feeling hopeless, losing interest, increased worry, or stopping helpful routines.' },
      { heading: 'Your signs may be unique', body: 'Everyone\'s signs are different. Some people become restless, while others shut down. Some become more emotional, while others feel numb.' },
      { heading: 'Respond early', body: 'When warning signs appear, use your support plan early. This might include reducing pressure, using grounding, contacting support, completing a check-in, or telling your supervisor.' },
      { heading: 'No shame', body: 'Warning signs are information, not failure. Noticing them is a skill.' }
    ],
    reflectionPrompt: 'What are your early warning signs that things may be getting harder?',
    learnerTask: 'List three early warning signs and one action you can take for each.',
    supervisorNote: 'Help the patient connect warning signs to specific support steps.',
    platformNote: 'This training module is for learning and reflection only. It does not replace site-specific safety protocols, supervisor guidance, or emergency procedures. For on-site emergencies, follow your site emergency procedure immediately.',
    completionLabel: 'I can identify early warning signs'
  },

  m3l3: {
    id: 'm3l3', moduleId: 3, lessonNumber: 13,
    moduleTitle: 'Module 3 — Competency Assessment and Development',
    title: 'Strengthening Core Process Skills',
    estimatedTime: '8–10 minutes',
    summary: 'Coping strategies are skills or actions that help you manage difficult moments. This lesson helps you review what works, what does not, and how to build a practical coping toolkit.',
    learningGoals: [
      'Understand different types of coping strategies.',
      'Identify strategies that already help.',
      'Build a flexible coping toolkit.',
      'Match strategies to different needs.'
    ],
    sections: [
      { heading: 'Process skills are tools', body: 'No single process skill covers every situation. A skills toolkit gives you options depending on what you need: quality checking, process review, supervisor escalation, documentation, or hands-on practice.' },
      { heading: 'Different types of coping', body: 'Process-focused strategies include workstation checks, process review, or a supervised step-through. Practical strategies include making a list or reducing tasks. Connection strategies include messaging someone safe. Expression strategies include journaling, art, or talking.' },
      { heading: 'Notice what works', body: 'After using a strategy, ask: Did this help a little, a lot, or not today? A strategy that does not work once may still help another time.' },
      { heading: 'Make strategies easy to access', body: 'Keep coping strategies visible and simple. Add them to your support plan or AutoSkill OS™ notes so you do not have to remember them during distress.' },
      { heading: 'Review with your supervisor', body: 'Your supervisor can help adjust coping strategies and explore why some feel easier or harder.' }
    ],
    reflectionPrompt: 'Which coping strategy has helped you even slightly?',
    learnerTask: 'Create a skills toolkit with five process skills: one quality-focused, one safety-focused, one communication-based, one documentation-based, and one hands-on practice.',
    supervisorNote: 'Review whether coping strategies are accessible, safe, and realistic for the employee\'s context.',
    platformNote: 'This training module is for learning and reflection only. It does not replace site-specific safety protocols, supervisor guidance, or emergency procedures. For on-site emergencies, follow your site emergency procedure immediately.',
    completionLabel: 'I have strengthened my coping toolkit'
  },

  m3l4: {
    id: 'm3l4', moduleId: 3, lessonNumber: 14,
    moduleTitle: 'Module 3 — Competency Assessment and Development',
    title: 'Preparing for Supervisor Check-In',
    estimatedTime: '8–10 minutes',
    summary: 'Preparing for your supervisor check-in can help you make better use of the session. This module helps you collect training reflections, questions, progress evidence, and concerns before your review. Start hegress notes, and concerns before meeting your supervisor.',
    learningGoals: [
      'Prepare useful notes for your supervisor check-in.',
      'Identify topics to discuss.',
      'Review check-in patterns.',
      'Communicate support needs clearly.'
    ],
    sections: [
      { heading: 'Why preparation helps', body: 'When emotions are high or time is limited, it can be hard to remember everything you wanted to say. Preparing notes can help you feel more organised and supported.' },
      { heading: 'Review recent check-ins', body: 'Look at mood, anxiety, stress, sleep, coping strategy use, and support flags. Notice anything that changed or repeated.' },
      { heading: 'Choose key topics', body: 'You might discuss triggers, difficult moments, progress, questions, coping strategies, medication concerns if relevant to your healthcare provider, relationship issues, work stress, or support needs.' },
      { heading: 'Share what feels hard to say', body: 'If something feels difficult to say aloud, writing it down can help. You might show your supervisor your notes or use them as a starting point.' },
      { heading: 'End with next steps', body: 'After your supervisor check-in, record one or two next steps so you know what to focus on before your next shift or review. Start next session.' }
    ],
    reflectionPrompt: 'What is one thing you want your supervisor to understand at your next session?',
    learnerTask: 'Write three notes for your next session: one progress update, one difficulty, and one question.',
    supervisorNote: 'Employee preparation notes may improve session focus and reveal concerns that are hard to verbalise.',
    platformNote: 'This training module is for learning and reflection only. It does not replace site-specific safety protocols, supervisor guidance, or emergency procedures. For on-site emergencies, follow your site emergency procedure immediately.',
    completionLabel: 'I have prepared for my next supervisor check-in'
  },

  m3l5: {
    id: 'm3l5', moduleId: 3, lessonNumber: 15,
    moduleTitle: 'Module 3 — Competency Assessment and Development',
    title: 'Final Competency Check',
    estimatedTime: '12–15 minutes',
    summary: 'A personal competency plan brings together what you have learned about your performance, triggers, coping strategies, support needs, and goals. This lesson helps you create a practical plan you can review with your supervisor.',
    learningGoals: [
      'Bring together learning from the pathway.',
      'Identify strengths, triggers, and coping strategies.',
      'Create realistic recovery goals.',
      'Build a plan for continued support.'
    ],
    sections: [
      { heading: 'What is a competency plan?', body: 'A competency plan is a personal guide for supporting your performance. It can include what helps, what makes things harder, who can support you, what to do during difficult moments, and what progress means to you.' },
      { heading: 'Include your strengths', body: 'Your strengths are part of the plan. These might include persistence, creativity, honesty, care for others, problem-solving, humour, patience, or the ability to keep trying.' },
      { heading: 'Include triggers and warning signs', body: 'List the situations, feelings, thoughts, or patterns that may affect your performance. Include early warning signs so you can respond sooner.' },
      { heading: 'Include process skills and support', body: 'Add key process skills, daily workstation anchors, supervisor contacts, training goals, and escalation steps. Make the plan realistic and easy to follow. Starteps. Make the plan realistic and easy to follow.' },
      { heading: 'Keep the plan flexible', body: 'A competency plan can change. Review it with your supervisor and update it when you learn more about yourself.' }
    ],
    reflectionPrompt: 'What are the most important things your competency plan should include?',
    learnerTask: 'Create a personal competency plan with five sections: strengths, triggers, warning signs, coping strategies, and support contacts.',
    supervisorNote: 'Use the competency plan as a collaborative tool. Review for realism, safety, and patient ownership.',
    platformNote: 'This training module is for learning and reflection only. It does not replace site-specific safety protocols, supervisor guidance, or emergency procedures. For on-site emergencies, follow your site emergency procedure immediately.',
    completionLabel: 'I have built my personal competency plan'
  }

};
