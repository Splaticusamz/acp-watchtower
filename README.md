# ACP Watchtower

ACP Watchtower is a Vercel-ready Next.js app for **ACP manifest validation, release diffing, hosted readiness reports, and automation-ready monitoring hooks**.

## What's live tonight

- Manifest paste workflow with deterministic readiness analysis
- Severity-based issue reporting (`critical`, `warning`, `info`)
- Category scoring across schema completeness, action clarity, discoverability, safety, and maintainability
- Diff mode for added/removed/changed actions and release-risk summaries
- Hosted report creation with lightweight file-based persistence
- Webhook-ready event payload preview
- Scheduled re-check endpoint ready for Vercel Cron
- Internal operator dashboard updated with actual build status

## Product wedge

> Make your ACP app actually agent-ready.

ACP Watchtower helps ACP builders catch weak metadata, missing schema detail, risky action drift, and poor release hygiene before those mistakes break agent workflows in production.

## Stack

- **Framework:** Next.js 16 App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Persistence (tonight):** File-based JSON snapshots in `data/reports/`
- **Deployment:** Vercel
- **Automation:** Route handlers + Vercel Cron config + webhook stub

## Routes

### Product pages
- `/` — landing page + validator workbench
- `/dashboard` — internal operator dashboard
- `/report/[id]` — hosted readiness report page

### API routes
- `POST /api/analyze` — analyze a manifest string
- `POST /api/diff` — compare old vs new manifest strings
- `POST /api/reports` — create and persist a hosted report
- `GET /api/reports/:id` — fetch a stored report
- `POST /api/webhooks/ingest` — webhook receiver stub for downstream delivery
- `GET /api/cron/recheck` — scheduled monitoring hook for Vercel Cron

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` if you want to protect the cron endpoint with a bearer token.

```bash
cp .env.example .env.local
```

## Demo flow

1. Open `/`
2. Use the sample manifest buttons or paste your own ACP JSON
3. Run readiness analysis
4. Compare releases with diff mode
5. Create a hosted report and open the generated `/report/[id]` URL

## Automation-first roadmap

### Free
- Manual validation
- One-off readiness score
- Basic manifest diffing

### Pro
- Saved project history
- Scheduled re-checks
- Webhook alerts
- Score trends and release monitoring

### Design partner
- Manifest review and rollout audits
- Team-specific report templates
- Monitoring setup help and workflow design

## Repository layout

```text
.
├── data/reports/            # Lightweight hosted report snapshots
├── docs/
├── samples/
├── src/app/
├── src/components/
├── src/lib/
├── CHANGELOG.md
├── README.md
└── vercel.json
```
