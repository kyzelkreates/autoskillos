# AutoSkill OS™

**Training Control Dashboard + Employee Learning PWA**

> Powered by 4P3X Intelligent AI™ · Created by Kyzel Kreates™

---

## Overview

AutoSkill OS™ is a local-first, offline-capable manufacturing workforce training platform consisting of:

- **Training Control Dashboard** — supervisor monitoring, employee competency flags, trainer notes, analytics
- **Employee Learning PWA** — daily training check-ins, Manufacturing Training Pathway (3 modules / 15 process modules), skill practices, competency tracking

**Demo Mode shows the product. Live Mode runs the product.**

---

## Project Structure

```
AutoSkill OS/
├── index.html                              # Hub landing page (redirects to demo)
├── ap3x/
│   ├── demo/
│   │   ├── index.html                      # Demo hub landing page
│   │   ├── clinician-demo.html             # Training Control Dashboard (full)
│   │   ├── patient-demo.html               # Employee Learning PWA (demo)
│   │   ├── manifest.json                   # PWA manifest
│   │   └── sw.js                           # Service worker
│   ├── patient-pwa/
│   │   ├── index.html                      # Installable Employee Learning PWA shell
│   │   ├── patient-app.js                  # Full PWA app logic
│   │   ├── patient.css                     # Styles (black/gold/purple theme)
│   │   ├── manifest.json                   # PWA manifest
│   │   ├── ap3x-sw.js                      # Service worker (offline-first)
│   │   └── chart.js                        # Charting utility
│   ├── clinician-dashboard/
│   │   └── index.html                      # Redirect to Control Dashboard
│   ├── shared/
│   │   ├── constants.js                    # SSOT: keys, thresholds, brand identity
│   │   ├── auth.js                         # Local-first auth (SHA-256, localStorage)
│   │   └── sync-service.js                 # Sync queue utility (ready for Live Mode)
│   └── anxietycore/
│       ├── engine/rules-engine.js          # Competency scoring rules engine
│       └── module/streak-tracker.js        # Check-in streak tracker
├── bco/
│   └── core/                               # BCO storage engine (SSOT)
├── icons/                                  # PWA icons (192px, 512px, etc.)
├── docs/                                   # Setup docs (Live Mode backend SQL)
└── README.md
```

---

## Features

### Training Control Dashboard
- Employee overview grid with competency status levels (Low / Medium / High / Critical / Missing)
- Training score, readiness, and trend charts
- Supervisor flags & alert system
- Supervisor notes (per employee, saved to localStorage)
- Demo Mode ON/OFF toggle (isolated from real training data)
- Dark / Light theme
- Responsive — sidebar on desktop, hamburger on mobile

### Employee Learning PWA
- Onboarding flow (3 steps: profile, goals, experience level)
- 10-question daily training check-in
- Manufacturing Training Pathway — 3 modules, 15 process modules:
  - Module 1: Manufacturing Site Orientation
  - Module 2: Quality Control and Process Standards
  - Module 3: Competency Assessment and Development
- 10 skill practice cards (process checks, safety drills, etc.)
- Progress tracking — streak, XP, check-in history, score/readiness averages
- Installable PWA (offline-first via service worker)
- Dark / Light theme

---

## Demo / Live Mode

- **Demo Mode** shows the product with sample manufacturing training data. No backend required.
- **Live Mode** will connect to a backend in a future run to sync real employee data.
- Employee PWA check-ins and module progress are saved locally first, then synced when backend is configured.

---

## Platform Notice

AutoSkill OS™ supports manufacturing workforce training, competency tracking, and supervisor-guided progress monitoring.
It does not provide emergency safety response or a replacement for site-specific safety protocols.
All competency indicators are informational only and must be reviewed by a qualified supervisor or training manager.
For on-site emergencies, follow your site emergency procedure immediately.

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
