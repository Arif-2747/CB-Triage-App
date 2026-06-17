# CB Triage: healthcare web and mobile app

A patient health management system built in two phases. Phase 1 delivered a web app (React + TypeScript + Vite) with a patient dashboard, vitals tracking, appointments, and medical history. Phase 2 converted that into a cross-platform mobile app (Flutter + Dart). Both share the same product scope and visual identity: "Your health, managed."

---

## Table of contents

- [Web app](#web-app)
  - [Screenshots](#web-app-screenshots)
  - [What it does](#what-the-web-app-does)
  - [File structure](#web-app-file-structure)
  - [Setup](#web-app-setup)
  - [Dependencies](#web-app-dependencies)
- [Mobile app](#mobile-app)
  - [Screenshots](#mobile-app-screenshots)
  - [What it does](#what-the-mobile-app-does)
  - [File structure](#mobile-app-file-structure)
  - [Setup](#mobile-app-setup)
  - [Dependencies](#mobile-app-dependencies)
- [Project context](#project-context)

---

## Web app

### Web app screenshots

**Login**

<img src="screenshots/web-screenshot-1-login.png" alt="CB Triage web login screen" width="900"/>

**Registration: credentials and medical details**

<img src="screenshots/web-screenshot-2-register.png" alt="Create account step 1/2: email and password" width="600"/>

<img src="screenshots/web-screenshot-3-medical-details.png" alt="Medical details step 2/2: name, age, sex, blood type, insurance, allergies, medications" width="600"/>

**Patient dashboard**

<img src="screenshots/web-screenshot-4-dashboard.png" alt="Patient profile card, appointments section, last checkup date" width="900"/>

<img src="screenshots/web-screenshot-5-allergies-notes.png" alt="Allergies, medications, and doctor's notes cards" width="900"/>

---

### What the web app does

The web app opens on a login screen and routes to a patient dashboard after authentication. Registration is split across two steps: credentials (email, password) then medical details (name, age, sex, blood type, insurance provider, allergies, medications).

The dashboard shows a patient profile card with an avatar generated from initials, last checkup date, and an Edit Profile button. Below that, four cards display appointments, allergies, medications, and doctor's notes. All data is held in memory during the session. There is no backend or database wired in. The footer notes it is a demo and that passwords are not securely stored.

**Patient data model** (from `types.ts`):

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | Matches `User.id` |
| `name` | string | Editable via profile form |
| `age` | number | Optional |
| `sex` | Male / Female / Other | Optional |
| `bloodType` | BloodType enum | 8 blood types |
| `allergies` | string[] | Comma or newline input |
| `medications` | string[] | Comma or newline input |
| `vitalSigns` | VitalSign[] | Trend direction per metric |
| `healthMetrics` | HealthMetric[] | Chart data via Recharts |
| `appointments` | Appointment[] | Date + time + doctor |
| `insuranceProvider` | string | Optional |
| `notes` | string | Doctor's notes field |

Vital signs include a `TrendDirection` (`up` / `down` / `stable`) per metric. Health metrics render as charts using Recharts. `AuthViewType` toggles between `login`, `registerCredentials`, and `registerMedicalDetails`.

---

### Web app file structure

```
cb-triage-web/
├── index.html
├── index.tsx                        # App entry point
├── App.tsx                          # Root component, auth state, routing
├── types.ts                         # All interfaces and enums
├── vite.config.ts
├── package.json
├── services/
│   ├── authService.ts               # Login / register logic (in-memory)
│   └── patientService.ts            # Patient data reads and writes
└── components/
    ├── AuthLayout.tsx               # Shared auth page wrapper
    ├── LoginPage.tsx                # Login form
    ├── RegisterPage.tsx             # Credentials form (step 1/2)
    ├── MedicalDetailsPage.tsx       # Medical details form (step 2/2)
    ├── MedicalDetailsForm.tsx       # Reusable form component
    ├── PatientDetail.tsx            # Full patient dashboard
    ├── PatientList.tsx              # Patient list view
    ├── AppointmentsSection.tsx      # Appointments card
    ├── AppointmentForm.tsx          # Add appointment form
    ├── AppointmentItem.tsx          # Single appointment row
    ├── VitalSignCard.tsx            # Vitals display card
    ├── HealthMetricChart.tsx        # Recharts-based metric chart
    └── icons.tsx                    # All SVG icon components
```

---

### Web app setup

Node.js 18+ required.

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. Register a new account to get to the dashboard. The login form will reject unregistered emails since there is no seed data.

To build for production:

```bash
npm run build
npm run preview
```

---

### Web app dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.2.0 | UI framework |
| `react-dom` | ^18.2.0 | DOM rendering |
| `recharts` | 2.12.7 | Health metric charts |
| `typescript` | ~5.8.2 | Type safety |
| `vite` | ^6.2.0 | Build tool and dev server |
| `@vitejs/plugin-react` | ^5.0.0 | React fast refresh |

---

## Mobile app

### Mobile app screenshots

**Onboarding and registration**

<img src="screenshots/screenshot-1-onboarding.png" alt="Login screen, account creation step 1/3, and personal details step 2/3" width="800"/>

**Dashboard and symptom history**

<img src="screenshots/screenshot-2-dashboard.png" alt="Medical history step 3/3, home dashboard with medications, and symptom history log" width="800"/>

**Symptom logging and appointments**

<img src="screenshots/screenshot-3-appointments.png" alt="Log today's symptoms dialog, appointments list, and add new appointment form" width="800"/>

**Tests, surgeries, and profile**

<img src="screenshots/screenshot-4-tests-profile.png" alt="Tests and surgeries page, add entry dialog, profile view, and edit profile form" width="800"/>

---

### What the mobile app does

The app opens on a login screen (`TriageScreen`), routes to a home dashboard after authentication, and gives users four areas through a bottom navigation bar: home, appointments, tests, and profile.

From the dashboard (`HealthDashboard`), users see a health summary card (blood group, allergies, age), today's medication schedule, and a "View Full Symptom History" button. Three floating action buttons handle the most common write actions: logging symptoms, adding appointments, and adding test or surgery entries.

**Symptom logging** opens a dialog where users describe how they're feeling and set severity with a slider (Mild / Moderate / Severe). Entries are timestamped and listed in `SymptomHistoryPage` with colour-coded severity badges.

**Appointments** lists upcoming visits with doctor name, specialty, day, and time. The "Add New Appointment" FAB opens a form collecting doctor name, specialist, hospital, location, reason, and date/time pickers.

**Tests and surgeries** splits into three sections: upcoming tests/surgeries, lab test results (with a "View Results" action per entry), and past surgeries history. The "Add New Entry" FAB opens a dialog to choose between adding an upcoming test/surgery, uploading a lab result, or logging a past surgery.

**Profile** shows full name, email, age, blood group, allergies, and insurance provider. "Edit Profile" opens a form with a blood group dropdown and a "Save Changes" button.

Registration is a 3-step flow: `RegistrationPage` (credentials), `PersonalDetailsPage` (demographics), `MedicalHistoryPage` (allergies, medications, past conditions).

Firebase Authentication and Cloud Firestore are scoped in the codebase but not yet wired to live credentials. The initialization call in `main.dart` is commented out and save/auth handlers are marked TODO throughout. The login button navigates directly to the dashboard for demo purposes.

---

### Mobile app file structure

```
cb-triage-mobile/
├── lib/
│   ├── main.dart                    # App entry, login screen, theme config
│   ├── home_page.dart               # Dashboard, bottom nav, FAB dialogs, ProfilePage
│   ├── registration_page.dart       # Account creation (step 1 of 3)
│   ├── personal_details_page.dart   # User demographics (step 2 of 3)
│   ├── medical_history_page.dart    # Medical background (step 3 of 3)
│   ├── appointment_page.dart        # Appointments list
│   ├── tests_page.dart              # Lab results and test tracking
│   ├── symptom_history_page.dart    # Full symptom log
│   ├── edit_profile_page.dart       # Profile editing
│   └── app_header.dart              # Shared header widget
└── pubspec.yaml

screenshots/
├── screenshot-1-onboarding.png
├── screenshot-2-dashboard.png
├── screenshot-3-appointments.png
├── screenshot-4-tests-profile.png
├── web-screenshot-1-login.png
├── web-screenshot-2-register.png
├── web-screenshot-3-medical-details.png
├── web-screenshot-4-dashboard.png
└── web-screenshot-5-allergies-notes.png
```

---

### Mobile app setup

Flutter SDK 3.x and Dart SDK ^3.8.0 required.

```bash
flutter pub get
flutter run
```

Runs on Android, iOS, Web, Linux, and Windows. Firebase is not yet active, so no credentials are needed to run.

To enable Firebase later, uncomment the initialization block in `main.dart` and add `google-services.json` (Android) or `GoogleService-Info.plist` (iOS):

```dart
// In main():
await Firebase.initializeApp();
```

---

### Mobile app dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `firebase_core` | ^3.2.0 | Firebase initialization (scoped, not active) |
| `firebase_messaging` | ^15.0.1 | Push notifications (scoped, not active) |
| `flutter_launcher_icons` | ^0.13.1 | Custom app icon generation |
| `intl` | ^0.19.0 | Date/time formatting |
| `cupertino_icons` | ^1.0.8 | iOS-style icons |

---

## Project context

Built in three phases between March and August 2025 at Manipal Academy Dubai.

- **Phase 1 (Mar–Jun 2025):** Web app built with Google AI Studio and HTML/CSS, covering lab results viewer, symptom tracker, and appointment manager. Later rebuilt in React + TypeScript + Vite with Recharts for metric visualisation.
- **Phase 2 (Jun–Aug 2025):** Converted to a cross-platform mobile app using Flutter and Dart, expanding the feature set with symptom severity tracking, tests/surgeries history, and a 3-step registration flow.
- **Phase 3 (scoped):** Firebase Authentication and Cloud Firestore backend integration for both platforms.

All client-side UI was built independently, with cross-team validation on feature scope.

**Built with:** React · TypeScript · Vite · Recharts · Flutter · Dart · Google AI Studio · Firebase (scoped)
