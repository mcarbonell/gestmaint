# Implementation Plan: Shopping Center Maintenance PWA

## Tech Stack
- **Frontend Framework:** React (via Vite)
- **Language:** JavaScript/JSX
- **Styling:** Vanilla CSS (CSS Modules & Variables for theming)
    - *Why?* To maintain full control over the "premium" aesthetic and animations as requested, avoiding framework bloat while keeping modularity.
- **State Management:** React Context API + Hooks
- **Backend/Data:** Firebase (Firestore, Auth, Storage)
    - *Why?* Provides real-time DB, ease of use for PWA features, Authentication out of the box, and file storage for incident photos/PDFs.
    - *Note:* If a backend is not strictly required for the demo, we can start with `localStorage` mockup, but Firebase is recommended for a real multi-user experience. **We will assume a Mock Data / LocalStorage approach first for rapid prototyping unless otherwise specified.**

## Architecture & Code Structure

```
src/
  ├── assets/          # Images, icons, global styles
  ├── components/      # Reusable UI components
  │   ├── common/      # Button, Card, Input, Modal (styled with Vanilla CSS)
  │   ├── layout/      # Navbar, Sidebar, PageContainer
  │   └── incidents/   # IncidentCard, IncidentForm, Timeline
  ├── context/         # AuthContext, DataContext (Mock/Firebase)
  ├── hooks/           # Custom hooks (useIncidents, useAuth)
  ├── pages/           # Views
  │   ├── Dashboard/   # Role-based dashboard
  │   ├── Incidents/   # List and Detail views
  │   ├── Contacts/    # Directory for technicians
  │   └── Settings/    # User management (Admin)
  ├── services/        # API/Storage service layer
  ├── utils/           # Helpers (date formatting, constants)
  └── App.jsx          # Routing and main layout
```

## User Review Required
> [!IMPORTANT]
> **Data Persistence:** Initially, I will build using **In-Memory/LocalStorage** data mocks to demonstrate the functionality immediately without needing you to set up API keys. Is this acceptable for the first delivery?

> [!NOTE]
> **Design:** I will implement a "Dark/Light" mode compatible premium design using custom CSS variables to ensure the aesthetic requirements are met.

## Implementation Phases

### Phase 1: Foundation & UI System
- Setup Vite + React project.
- Create `design-system.css`: Color palette (premium gradients), Typography, Spacing.
- Implement Authentication Wrapper (Simulated login for Admin, Controller, Local).
- Build Layout shell (Responsive sidebar/bottom nav).

### Phase 2: Core Features
#### [MODIFY] src/pages/Dashboard
- Create distinct dashboard widgets for each role.
#### [NEW] src/pages/Incidents
- Implement Incident Reporting Form (with file input simulation).
- Implement Incident Kanban/List view for Controller.
- Implement Detail view with "Activity Log" (Timeline).

### Phase 3: Logic & Polish
- Wiring up the "State Machine" for incident status transitions.
- Implement Contact List with "Call" actions (href="tel:").
- Add "Share" buttons for WhatsApp/Email reporting.
- PWA Manifest generation (icons, name, theme_color).

## Verification Plan
### Manual Verification
- **Role Testing:** Log in as "Local", create incident. Log in as "Controller", see incident, change state.
- **Responsive Check:** Verify layout on mobile view (Chrome DevTools).
- **Aesthetic Check:** Ensure animations (hover, transitions) feel "premium".
