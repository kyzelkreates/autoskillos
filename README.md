# TherapyLink™

**Therapist Dashboard + Patient Mental Health PWA**

> Powered by 4P3X Intelligent AI™ · Created by Kyzel Kreates™

---

## Overview

TherapyLink™ is a local-first, offline-capable mental health support platform consisting of:

- **Therapist Dashboard** — clinician monitoring, patient risk flags, therapist notes, analytics
- **Patient Recovery PWA** — daily wellbeing check-ins, mental health recovery pathway (3 modules / 15 lessons), coping strategies, progress tracking

---

## Project Structure

```
TherapyLink/
├── index.html                          # Hub landing page
├── ap3x/
│   ├── demo/
│   │   ├── index.html                  # Demo hub
│   │   ├── clinician-demo.html         # Therapist Dashboard (full)
│   │   ├── patient-demo.html           # Patient Recovery PWA (demo)
│   │   ├── manifest.json               # PWA manifest
│   │   └── sw.js                       # Service worker
│   ├── patient-pwa/
│   │   ├── index.html                  # Installable Patient PWA shell
│   │   ├── patient-app.js              # Full PWA app logic
│   │   ├── patient.css                 # Styles (black/gold/purple theme)
│   │   ├── manifest.json               # PWA manifest
│   │   ├── ap3x-sw.js                  # Service worker (offline-first)
│   │   └── chart.js                    # Charting utility
│   ├── clinician-dashboard/
│   │   └── index.html                  # Redirect to clinician-demo
│   ├── shared/
│   │   ├── constants.js                # SSOT: keys, thresholds, disclaimers
│   │   ├── auth.js                     # Local-first auth (SHA-256, localStorage)
│   │   └── sync-service.js             # Sync queue utility
│   └── anxietycore/
│       ├── engine/rules-engine.js      # Risk scoring rules engine
│       └── module/streak-tracker.js   # Check-in streak tracker
├── bco/
│   └── core/                           # BCO storage engine (SSOT)
├── icons/                              # PWA icons (192px, 512px, etc.)
└── README.md
```

---

## Features

### Therapist Dashboard
- Patient overview grid with risk levels (Low / Medium / High / Critical / Missing)
- Anxiety, mood, sleep trend charts
- Support flags & alert system
- Therapist notes (per patient, saved to localStorage)
- Demo Mode ON/OFF toggle (isolated from real patient data)
- Dark / Light theme
- Responsive — sidebar on desktop, hamburger on mobile

### Patient Recovery PWA
- Onboarding flow (3 steps: profile, goals, experience level)
- 10-question daily wellbeing check-in
- Mental Health Recovery Pathway — 3 modules, 15 guided support lessons
- 10 coping strategy cards (breathing, grounding, journaling, etc.)
- Progress tracking — streak, XP, check-in history, mood/anxiety averages
- Installable PWA (offline-first via service worker)
- Dark / Light theme

---

## Safety Disclaimer

TherapyLink™ supports mental health education, reflection, and therapist-guided monitoring.  
It does **not** provide emergency support, medical diagnosis, or a replacement for professional care.  
All risk indicators are informational only.  
**If you or a patient feels at immediate risk or in crisis, contact local emergency services or a crisis support line immediately.**

---

## Tech Stack

- Vanilla HTML / CSS / JavaScript (no framework, no build step)
- localStorage SSOT (Single Source of Truth)
- PWA: Web App Manifest + Service Worker
- Offline-first cache strategy

---

## License

© Kyzel Kreates™. All rights reserved.  
Powered by 4P3X Intelligent AI™.
