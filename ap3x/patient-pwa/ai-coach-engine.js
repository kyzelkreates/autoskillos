// ════════════════════════════════════════════════════════════════════════════
// AutoSkill OS™ — AI Learning Coach Demo Engine
// ap3x/patient-pwa/ai-coach-engine.js
//
// Run 14: Optional Learning & Motivation Coach AI Agent
// Powered by 4P3X Intelligent AI™ — Created by Kyzel Kreates™
//
// ARCHITECTURE:
//   - Deterministic template-based responses in demo/local mode
//   - Context-aware: reads current lesson, module, progress from global state
//   - API-ready: provider config slots for OpenAI / Groq / custom endpoint
//   - No external calls unless provider is explicitly configured
//   - Never modifies lesson state, progress, or completion data
//   - Fully removable: zero impact on existing training system
//
// SAFETY: This engine is a support tool only. It does not replace official
// training material, workplace safety procedures, or supervisor guidance.
// ════════════════════════════════════════════════════════════════════════════

(function(window) {
  'use strict';

  // ── 1. STORAGE KEYS (ap3x_dm_ namespace — no collision with ap3x_ keys) ───
  var AI_COACH_GLOBAL_KEY  = 'ap3x_dm_ai_coach_config';   // global/admin config
  var AI_COACH_PREF_KEY    = 'ap3x_ai_coach_pref';        // employee preference
  var AI_COACH_HISTORY_KEY = 'ap3x_ai_coach_history';     // session chat history

  // ── 2. SAFE STORAGE HELPERS ───────────────────────────────────────────────
  function _get(k, d) {
    try { var v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : d; } catch(e) { return d; }
  }
  function _set(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) {}
  }

  // ── 3. DEFAULT CONFIG ─────────────────────────────────────────────────────
  var COACH_CONFIG_DEFAULTS = {
    globalEnabled:           true,
    mode:                    'demo',        // 'demo' | 'live'
    provider:                'local-demo',  // 'local-demo' | 'openai' | 'groq' | 'custom'
    endpoint:                '',            // custom API endpoint (never used if provider='local-demo')
    model:                   '',            // e.g. 'gpt-4o-mini'
    allowMotivationMessages: true,
    allowLessonExplanations: true,
    allowRevisionQuiz:       true
  };

  var EMPLOYEE_PREF_DEFAULTS = {
    aiLearningCoachEnabled: true
  };

  // ── 4. CONFIG GETTERS / SETTERS ───────────────────────────────────────────

  function getGlobalConfig() {
    var stored = _get(AI_COACH_GLOBAL_KEY, {});
    // Merge with defaults so missing fields always have a value
    var cfg = {};
    Object.keys(COACH_CONFIG_DEFAULTS).forEach(function(k) {
      cfg[k] = (stored[k] !== undefined) ? stored[k] : COACH_CONFIG_DEFAULTS[k];
    });
    return cfg;
  }

  function setGlobalConfig(patch) {
    var current = getGlobalConfig();
    Object.keys(patch).forEach(function(k) { current[k] = patch[k]; });
    _set(AI_COACH_GLOBAL_KEY, current);
    return current;
  }

  function getEmployeePref() {
    var stored = _get(AI_COACH_PREF_KEY, {});
    return {
      aiLearningCoachEnabled: stored.aiLearningCoachEnabled !== undefined
        ? stored.aiLearningCoachEnabled
        : EMPLOYEE_PREF_DEFAULTS.aiLearningCoachEnabled
    };
  }

  function setEmployeePref(enabled) {
    _set(AI_COACH_PREF_KEY, { aiLearningCoachEnabled: !!enabled });
  }

  // ── 5. VISIBILITY GATE ────────────────────────────────────────────────────
  // Returns true only when BOTH global admin AND employee preference allow coach

  function isCoachVisible() {
    var cfg  = getGlobalConfig();
    var pref = getEmployeePref();
    return cfg.globalEnabled === true && pref.aiLearningCoachEnabled === true;
  }

  // ── 6. CONTEXT READER ─────────────────────────────────────────────────────
  // Reads live context from existing global state — never writes to it

  function readContext() {
    var ctx = {
      employeeName:       'Trainee',
      currentLessonId:    null,
      currentLessonTitle: null,
      currentModuleTitle: null,
      completedCount:     0,
      totalLessons:       15,
      progressPercent:    0,
      lastCompletedTitle: null,
      nextLessonTitle:    null,
      lessonSections:     [],
      lessonSummary:      null
    };

    try {
      // Employee name
      var profile = null;
      try { profile = JSON.parse(localStorage.getItem('ap3x_patient_profile') || 'null'); } catch(e){}
      if (profile && profile.name) ctx.employeeName = profile.name;

      // Progress data
      var lessonDone = {};
      try { lessonDone = JSON.parse(localStorage.getItem('ap3x_lesson_progress') || '{}'); } catch(e){}
      ctx.completedCount = Object.values(lessonDone).filter(Boolean).length;
      ctx.progressPercent = Math.round((ctx.completedCount / ctx.totalLessons) * 100);

      // Lesson content from global LESSON_CONTENT (already in window scope)
      if (window.LESSON_CONTENT) {
        var allIds = Object.keys(window.LESSON_CONTENT);
        ctx.totalLessons = allIds.length || 15;

        // Last completed lesson
        var doneIds = allIds.filter(function(id) { return lessonDone[id]; });
        if (doneIds.length > 0) {
          var lastId = doneIds[doneIds.length - 1];
          ctx.lastCompletedTitle = window.LESSON_CONTENT[lastId].title;
        }

        // Next incomplete lesson
        var notDone = allIds.filter(function(id) { return !lessonDone[id]; });
        if (notDone.length > 0) {
          ctx.nextLessonTitle = window.LESSON_CONTENT[notDone[0]].title;
        }
      }

      // Current lesson from pwaNav (already global)
      if (window.pwaNav && window.pwaNav.lessonId && window.LESSON_CONTENT) {
        var lid = window.pwaNav.lessonId;
        var lc  = window.LESSON_CONTENT[lid];
        if (lc) {
          ctx.currentLessonId    = lid;
          ctx.currentLessonTitle = lc.title;
          ctx.currentModuleTitle = lc.moduleTitle;
          ctx.lessonSummary      = lc.summary || null;
          ctx.lessonSections     = lc.sections || [];
        }
      }
    } catch(e) {}

    return ctx;
  }

  // ── 7. DEMO RESPONSE ENGINE ───────────────────────────────────────────────
  // Deterministic, context-aware, template-based responses
  // No external API calls — fully offline

  var MOTIVATIONAL_MESSAGES = [
    'Every lesson you complete builds real skill. Keep going!',
    'You\'re doing great — consistency is the key to competency.',
    'Manufacturing mastery takes time. Each step forward counts.',
    'Your progress is being saved. Nothing is wasted.',
    'Even experienced workers started exactly where you are now.',
    'One lesson at a time — that\'s how skills are built.',
    'You\'re investing in yourself. That matters.',
    'Stay curious. Every question you ask is a sign of growth.'
  ];

  var STUCK_MESSAGES = [
    'It\'s completely normal to feel stuck. Try re-reading the lesson summary first — often the answer is there.',
    'When stuck, take a short break, then come back fresh. Your brain keeps working even when you step away.',
    'Try the "Explain this lesson simply" prompt — sometimes a different way of hearing it helps.',
    'If you\'re stuck on a practical step, ask your supervisor for a quick demonstration.',
    'Break it down: what specifically is unclear? The more specific the question, the easier it is to get unstuck.'
  ];

  var NEW_STARTER_MESSAGES = [
    'Welcome! Starting a new role in manufacturing is a big step. Take your time with each lesson.',
    'As a new starter, focus on understanding, not speed. It\'s fine to re-read lessons.',
    'Your first few weeks are about observation and learning. Every lesson here supports that.',
    'Don\'t worry about perfection at this stage — competency builds gradually.'
  ];

  function _pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function _buildSimpleExplanation(ctx) {
    if (ctx.currentLessonTitle) {
      var summary = ctx.lessonSummary
        ? 'Here\'s the key idea: ' + ctx.lessonSummary
        : 'This lesson focuses on: ' + ctx.currentLessonTitle + '.';
      var sectText = '';
      if (ctx.lessonSections && ctx.lessonSections.length > 0) {
        var headings = ctx.lessonSections.slice(0, 3).map(function(s) { return s.heading; });
        sectText = ' The main topics covered are: ' + headings.join(', ') + '.';
      }
      return '📖 Simple explanation of "' + ctx.currentLessonTitle + '":\n\n' +
             summary + sectText + '\n\n' +
             'Take it one section at a time. If something is unclear, re-read that section before moving on.';
    }
    return '📖 Open a lesson first and I\'ll give you a simple explanation of it. Navigate to the Lessons tab and tap on any lesson.';
  }

  function _buildRecap(ctx) {
    if (ctx.currentLessonTitle) {
      var lines = ['📋 Quick recap of "' + ctx.currentLessonTitle + '":'];
      if (ctx.lessonSections && ctx.lessonSections.length > 0) {
        ctx.lessonSections.slice(0, 4).forEach(function(s, i) {
          lines.push((i + 1) + '. ' + s.heading);
        });
      } else if (ctx.lessonSummary) {
        lines.push(ctx.lessonSummary);
      } else {
        lines.push('This lesson is part of ' + (ctx.currentModuleTitle || 'your training pathway') + '.');
      }
      lines.push('\nCompleted so far: ' + ctx.completedCount + ' of ' + ctx.totalLessons + ' lessons (' + ctx.progressPercent + '%).');
      return lines.join('\n');
    }
    return '📋 Open a lesson first for a personalised recap. Go to the Lessons tab and select any lesson.';
  }

  function _buildMotivation(ctx) {
    var lines = ['💪 ' + _pick(MOTIVATIONAL_MESSAGES)];
    if (ctx.progressPercent > 0) {
      lines.push('\n📊 You\'re ' + ctx.progressPercent + '% through your training pathway (' + ctx.completedCount + ' of ' + ctx.totalLessons + ' lessons complete).');
    }
    if (ctx.nextLessonTitle) {
      lines.push('➡️ Your next step: "' + ctx.nextLessonTitle + '"');
    }
    if (ctx.progressPercent >= 80) {
      lines.push('\n🏆 You\'re nearly there! Strong finish — keep the momentum going.');
    } else if (ctx.progressPercent >= 50) {
      lines.push('\n🎯 Past the halfway point — great progress.');
    }
    return lines.join('\n');
  }

  function _buildRevisit(ctx) {
    var lines = ['🔄 Revision suggestion:'];
    if (ctx.lastCompletedTitle) {
      lines.push('You last completed: "' + ctx.lastCompletedTitle + '"');
      lines.push('Consider revisiting it to reinforce the key points before moving on.');
    }
    if (ctx.nextLessonTitle) {
      lines.push('\n📌 Your next recommended lesson: "' + ctx.nextLessonTitle + '"');
    }
    if (ctx.progressPercent === 0) {
      lines.push('\nStart with your first lesson — it introduces the full pathway structure.');
    }
    return lines.join('\n');
  }

  function _buildStuck(ctx) {
    var lines = [_pick(STUCK_MESSAGES)];
    if (ctx.currentLessonTitle) {
      lines.push('\nYou\'re currently on: "' + ctx.currentLessonTitle + '"');
      lines.push('Try: use the "Explain this lesson simply" button above, or re-read the lesson summary in the Lessons tab.');
    }
    return lines.join('\n');
  }

  function _buildQuiz(ctx) {
    if (!ctx.currentLessonTitle) {
      return '📝 Open a lesson first, then I\'ll generate a short quiz question based on its content.';
    }
    // Generate a question from the first section heading if available
    var sections = ctx.lessonSections || [];
    if (sections.length > 0) {
      var s = sections[Math.floor(Math.random() * Math.min(sections.length, 3))];
      return '📝 Quick quiz question:\n\n' +
             'In your own words: What does "' + s.heading + '" mean in the context of ' +
             (ctx.currentModuleTitle || 'your training') + '?\n\n' +
             'Take 30 seconds to think about it before reading the section again. Self-testing like this strengthens recall.' +
             '\n\n(Note: This quiz is for self-revision only. It does not affect your official progress or completion status.)';
    }
    return '📝 Quiz question:\n\nWhat is the main purpose of the lesson "' + ctx.currentLessonTitle + '"?\n\n' +
           'Think about it for a moment, then re-read the lesson summary to check yourself.\n\n' +
           '(Note: This quiz is for self-revision only and does not affect your official progress.)';
  }

  function _buildFreeResponse(userText, ctx) {
    var t = userText.toLowerCase();
    // Route to appropriate handler
    if (t.match(/explain|simple|what does|what is|mean|understand/)) return _buildSimpleExplanation(ctx);
    if (t.match(/recap|summary|summar|review|remind/))               return _buildRecap(ctx);
    if (t.match(/motivat|inspir|encourag|keep going|why bother/))    return _buildMotivation(ctx);
    if (t.match(/revisit|what.*(next|revisit|redo)|suggest/))        return _buildRevisit(ctx);
    if (t.match(/stuck|confused|don.t get|don.t understand|hard|difficult/)) return _buildStuck(ctx);
    if (t.match(/quiz|test|question|practice/))                      return _buildQuiz(ctx);
    if (t.match(/hello|hi |hey |start/))
      return '👋 Hello, ' + ctx.employeeName + '! I\'m your AI Learning Coach.\n\n' +
             'I can help you understand lessons, stay motivated, or suggest what to focus on next.\n\n' +
             (ctx.currentLessonTitle ? 'You\'re currently on: "' + ctx.currentLessonTitle + '"\n\n' : '') +
             'Use the quick buttons above, or just type a question.';
    if (t.match(/progres|percent|how.*far|how.*much/)) return _buildMotivation(ctx);
    if (t.match(/new|start|begin|first/)) return _pick(NEW_STARTER_MESSAGES) + '\n\n' + _buildRevisit(ctx);
    // Default fallback
    return '🤖 I\'m your AutoSkill OS™ Learning Coach (Demo Mode).\n\n' +
           'I can help with:\n• Explaining lessons simply\n• Keeping you motivated\n• Suggesting what to revisit\n• Short self-revision quizzes\n\n' +
           (ctx.progressPercent > 0
             ? 'You\'re ' + ctx.progressPercent + '% through your pathway. ' : '') +
           'Try one of the quick buttons above, or ask me anything about your training.';
  }

  // ── 8. MAIN RESPONSE FUNCTION ─────────────────────────────────────────────
  // Central function — routes between demo and live API mode

  function getCoachResponse(promptType, userText, callback) {
    var cfg = getGlobalConfig();
    var ctx = readContext();

    // If live mode but no provider configured → fall back to demo
    var effectiveMode = cfg.mode;
    if (effectiveMode === 'live' && (!cfg.provider || cfg.provider === 'local-demo' || !cfg.endpoint)) {
      effectiveMode = 'demo-fallback';
    }

    if (effectiveMode === 'demo' || effectiveMode === 'demo-fallback') {
      var prefix = effectiveMode === 'demo-fallback'
        ? '⚠️ Live AI is not configured yet. Demo Learning Coach mode is currently active.\n\n'
        : '';
      var response = '';

      if (promptType === 'explain')   response = _buildSimpleExplanation(ctx);
      else if (promptType === 'recap')     response = _buildRecap(ctx);
      else if (promptType === 'motivate')  response = _buildMotivation(ctx);
      else if (promptType === 'revisit')   response = _buildRevisit(ctx);
      else if (promptType === 'stuck')     response = _buildStuck(ctx);
      else if (promptType === 'quiz')      response = _buildQuiz(ctx);
      else if (promptType === 'free' && userText) response = _buildFreeResponse(userText, ctx);
      else response = _buildMotivation(ctx);

      // Simulate a brief async delay for natural feel
      setTimeout(function() { callback(null, prefix + response, 'demo'); }, 400);
      return;
    }

    // ── LIVE API PATH (future) ────────────────────────────────────────────
    // Placeholder — never executes without explicit configuration
    if (effectiveMode === 'live') {
      // Build a context-aware system prompt
      var sysPrompt = [
        'You are an AI Learning Coach for AutoSkill OS™, a manufacturing workforce training platform.',
        'You help employees understand lessons, stay motivated, and know what to study next.',
        'Current employee: ' + ctx.employeeName + '.',
        ctx.currentLessonTitle ? 'Current lesson: "' + ctx.currentLessonTitle + '" (' + (ctx.currentModuleTitle||'') + ').' : '',
        'Progress: ' + ctx.completedCount + ' of ' + ctx.totalLessons + ' lessons complete (' + ctx.progressPercent + '%).',
        ctx.nextLessonTitle ? 'Next lesson: "' + ctx.nextLessonTitle + '".' : '',
        'IMPORTANT: Do not mark lessons as complete, override supervisor instructions, or make safety/compliance claims.',
        'Keep responses concise, encouraging, and practical.',
        'End responses with: "This is a learning support tool. Always follow official training and supervisor guidance."'
      ].filter(Boolean).join(' ');

      var userMsg = userText || ('prompt:' + promptType);

      // API call — cfg.endpoint and cfg.model are set by admin; NO hardcoded keys
      fetch(cfg.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model:    cfg.model || 'gpt-4o-mini',
          messages: [
            { role: 'system',  content: sysPrompt },
            { role: 'user',    content: userMsg }
          ],
          max_tokens: 300,
          temperature: 0.7
        })
      })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var text = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content)
          ? data.choices[0].message.content
          : 'I could not generate a response. Please try again.';
        callback(null, text, 'live');
      })
      .catch(function(err) {
        // Live API failed — fall back to demo silently
        var fallback = '⚠️ Live AI connection failed. Switching to Demo Coach mode.\n\n' + _buildMotivation(ctx);
        callback(null, fallback, 'demo-fallback');
      });
    }
  }

  // ── 9. CHAT HISTORY (session-local — cleared on page reload) ─────────────
  var _sessionHistory = [];

  function addToHistory(role, text) {
    _sessionHistory.push({ role: role, text: text, ts: Date.now() });
    if (_sessionHistory.length > 50) _sessionHistory = _sessionHistory.slice(-50);
  }

  function getSessionHistory() { return _sessionHistory.slice(); }
  function clearSessionHistory() { _sessionHistory = []; }

  // ── 10. PUBLIC API ────────────────────────────────────────────────────────
  window.AICoachEngine = {
    // Config
    getGlobalConfig:   getGlobalConfig,
    setGlobalConfig:   setGlobalConfig,
    getEmployeePref:   getEmployeePref,
    setEmployeePref:   setEmployeePref,
    isCoachVisible:    isCoachVisible,
    // Response
    getCoachResponse:  getCoachResponse,
    readContext:       readContext,
    // History
    addToHistory:      addToHistory,
    getSessionHistory: getSessionHistory,
    clearSessionHistory: clearSessionHistory,
    // Keys (for dashboard access)
    KEYS: {
      GLOBAL_CONFIG:    AI_COACH_GLOBAL_KEY,
      EMPLOYEE_PREF:    AI_COACH_PREF_KEY,
      SESSION_HISTORY:  AI_COACH_HISTORY_KEY
    }
  };

  console.info('[AutoSkill OS™] AI Coach Engine loaded. Mode:', getGlobalConfig().mode, '| Visible:', isCoachVisible());

})(window);
