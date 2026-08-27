# Tech Foxies — Citizen Portal (Frontend)

Frontend-only implementation of the Citizen Portal for the Tech Foxies SIH 2026 platform. No backend/API — all data is mocked in `src/data/mockData.ts`.

## Stack
React 19 + TypeScript + Vite, Tailwind CSS v4, React Router, Lucide icons.

## Getting started
```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
```

## Structure
- `src/types` — domain types (Complaint, Timeline, Notification, Feedback, Profile...)
- `src/data/mockData.ts` — all mock data, separated from UI
- `src/components/layout` — Sidebar, Topbar, mobile nav, DashboardLayout
- `src/components/shared` — StatCard, ComplaintCard, StatusBadge, PriorityBadge, EmptyState, Modal, Toast
- `src/components/report` — UploadZone, MediaPreview, VoiceRecorder, LocationPicker, MapPanel, AIAnalysisCard, SimilarProblemCard
- `src/components/tracking` — StatusTimeline (Problem-to-Impact)
- `src/components/notifications` — NotificationPanel, SMSNotificationCard
- `src/components/feedback` — FeedbackForm
- `src/pages` — one file per route
- `src/App.tsx` — routing under `/citizen/*`

## Notes for backend integration
- Replace `src/data/mockData.ts` reads with API calls / React Query, keeping the same TypeScript shapes in `src/types`.
- `UploadZone` simulates upload progress client-side; swap in real multipart upload calls.
- `VoiceRecorder`'s "Convert to text" mocks speech-to-text; wire to a real STT endpoint.
- `LocationPicker` / `MapPanel` use a dependency-free stylized map; swap in Google Maps / Mapbox when ready, keeping the same `GeoLocation` shape.
- SMS is mocked as data (`smsMessage` field) — no real sending occurs.
