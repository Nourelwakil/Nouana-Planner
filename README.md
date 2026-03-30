# Nouana Planner

A digital study planning and productivity web application built for students and self-learners. Nouana Planner helps users organize their courses, manage assignments with priority classification, and maintain focus using an integrated Pomodoro timer.

Developed as part of the DLMCSPSE01 (Project: Software Engineering) course at IU International University of Applied Sciences.

## Live Demo

**Deployed Application:** [https://nouana-planner.vercel.app](https://nouana-planner.vercel.app)

**Demo Account (pre-populated with sample data):**
- Email: demo@nouana.app
- Password: Demo2024!

## Features

- **Authentication:** Email/password registration and login, Google OAuth sign-in, password reset via email
- **Course Management:** Create, delete and mark courses as complete with color coding, course codes and credit tracking
- **Task Management:** Full task creation with title, description, deadline, scheduled date, priority level, urgency/importance flags and estimated study hours
- **7-Day Priority Matrix:** Visual grid organizing tasks by the Eisenhower Matrix model (Critical, High Priority, Urgent, Normal) sorted by deadline
- **Pomodoro Timer:** Configurable focus timer with work, short break and long break modes, animated progress arc and persistent settings
- **Dashboard Statistics:** Academic progress tracking with credit completion percentage and motivational feedback
- **Dark Mode:** Toggle between light and dark themes, preference saved to Firestore and restored on login
- **Real-Time Sync:** All data synchronized across devices and browser tabs via Firestore onSnapshot listeners
- **Responsive Design:** Fully functional from 320px (mobile) to 1920px (desktop)
- **Error Handling:** Application-wide ErrorBoundary component preventing blank screens on runtime errors
- **PWA Support:** Installable as a Progressive Web App with service worker caching for static assets

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| UI Framework | React | 19.0.0 |
| Language | TypeScript (strict mode) | 5.8.2 |
| Build Tool | Vite | 6.2.0 |
| Styling | Tailwind CSS | 4.1.14 |
| Database | Cloud Firestore | Firebase SDK 12.10.0 |
| Authentication | Firebase Authentication | Firebase SDK 12.10.0 |
| Icons | lucide-react | 0.546.0 |
| Animation | motion | 12.23.24 |
| PWA | vite-plugin-pwa | 1.2.0 |
| Hosting | Vercel | - |
| Containerization | Docker + nginx | - |

## Architecture

Nouana Planner follows a four-layer architecture with a strict top-down dependency flow:

```
Presentation Layer
  App.tsx, AuthForm, CourseManager, TaskManager,
  PriorityMatrix, PomodoroTimer, ProfileSettings

Application Logic Layer
  useFirebase.ts (custom hook, central state)
  types.ts (shared TypeScript interfaces)

Data Access Layer
  firebase.ts (SDK init, auth helpers)
  firestore.rules (security rule definitions)

External Services
  Firebase Auth, Cloud Firestore, Vercel CDN
```

All Firebase interactions are centralized in the useFirebase hook. UI components receive state and callback functions via props and never call Firestore directly. Firestore security rules enforce per-user data isolation at the database level, independent of application code.

## Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Docker and Docker Compose (for containerized deployment)

## Installation

```bash
git clone https://github.com/Nourelwakil/Nouana-Planner.git
cd Nouana-Planner
npm install
```

## Firebase Configuration

The app reads its Firebase configuration from firebase-applet-config.json in the project root. This file contains the public Firebase SDK config (API key, project ID, etc.) and is safe to commit. It is not a secret credential.

To connect your own Firebase project:

1. Create a project at Firebase Console (https://console.firebase.google.com)
2. Enable Email/Password and Google sign-in providers under Authentication
3. Create a Firestore database in production mode
4. Copy your web app config into firebase-applet-config.json
5. Deploy the security rules using the Firebase CLI

## Local Development

```bash
npm run dev
```

Opens the app at http://localhost:3000

## Running Tests

```bash
npm run test
```

Runs the Vitest test suite including unit tests for utility functions and component render tests.

## Building for Production

```bash
npm run build
npm run preview
```

The build command produces an optimized bundle in the dist/ directory. The preview command serves it locally for verification.

## Type Checking

```bash
npm run lint
```

Runs the TypeScript compiler in check-only mode (tsc --noEmit). The project maintains zero type errors in strict mode.

## Docker

```bash
docker compose up --build
```

Builds the app in a multi-stage Docker image (Node.js build + nginx serve) and exposes it at http://localhost:8080

To stop: docker compose down

## Project Structure

```
nouana-planner/
  src/
    components/
      AuthForm.tsx            Login, registration, password reset
      CourseManager.tsx       Course CRUD with color picker
      TaskManager.tsx         Task creation and listing
      PriorityMatrix.tsx      7-day Eisenhower matrix view
      PomodoroTimer.tsx       Focus timer with settings panel
      ProfileSettings.tsx     Password update screen
      ErrorBoundary.tsx       Catches runtime errors
    App.tsx                   Root component, navigation, dashboard
    firebase.ts               Firebase SDK init and auth helpers
    useFirebase.ts            Central state hook (all Firestore logic)
    types.ts                  TypeScript interfaces (Course, Task, etc.)
    main.tsx                  React entry point
    index.css                 Tailwind directives and CSS theme tokens
  firestore.rules             Firestore security rules
  firebase-applet-config.json Firebase public SDK config
  Dockerfile                  Multi-stage build (node + nginx)
  docker-compose.yml          Container orchestration
  nginx.conf                  SPA routing for nginx
  package.json
  tsconfig.json
  vite.config.ts
```

## Firestore Data Model

Three top-level collections, all scoped by a uid field matching the authenticated user:

- **courses:** name, code, credits, color, completed status
- **tasks:** title, description, courseId, deadline, scheduledDate, priority, status, estimatedHours, urgent, important, completed
- **settings:** workDuration, shortBreakDuration, longBreakDuration, color, theme (document ID = user UID)

Security rules enforce that users can only read and write their own documents. Cross-user access is blocked at the database level.

## Known Limitations

- **Prop drilling:** State and callbacks are passed from App.tsx down through several component layers. At the current project size (7 components) this is manageable, but for a larger app a state management solution like React Context or Zustand would be needed.
- **No pagination:** All user data is loaded into memory on login. For a user with hundreds of tasks, this could degrade performance. Cursor-based pagination with Firestore startAfter() would be the fix.
- **Partial accessibility audit:** Core elements are keyboard-navigable and labeled, but a full WCAG 2.1 AA audit has not been completed.
- **Flat Firestore collections:** Using top-level collections with a uid field rather than sub-collections under users/{uid}/. Functionally equivalent with security rules, but sub-collections would be cleaner at scale.

## Future Improvements

- Rich-text notes editor per course (deferred from Phase 1 scope)
- PDF export for weekly study plans
- Firestore cursor-based pagination for task lists
- State management refactor using React Context or Zustand
- Full WCAG 2.1 AA compliance based on automated audit results
- GitHub Actions CI/CD pipeline with lint, test and build gates

## Repository

**GitHub:** [https://github.com/Nourelwakil/Nouana-Planner](https://github.com/Nourelwakil/Nouana-Planner)

## License

This project was developed for academic purposes as part of the DLMCSPSE01 course at IU International University of Applied Sciences. Not intended for commercial use.
