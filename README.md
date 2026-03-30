# 🔭 ACP Watchtower

**Validate ACP manifests, score agent readiness, diff releases, and automate compliance checks.**

[![Live](https://img.shields.io/badge/status-live-brightgreen)](https://acp-watchtower.vercel.app)

## What it does

ACP Watchtower helps teams building with the Agent Communication Protocol:

- **Manifest validation** — Paste or upload ACP manifests, get a deterministic readiness score across 5 categories
- **Release diffing** — Compare old vs new manifests, flag removed actions, parameter drift, and description changes
- **Hosted reports** — Generate shareable report URLs with scores, findings, and fix recommendations
- **SVG badges** — Embed readiness scores in your README
- **API-first** — All functionality available via REST endpoints for CI/CD integration
- **Webhook + cron monitoring** — Scheduled re-checks, GitHub webhook triggers, Discord alerts

## Quick start

### Web UI
Visit [acp-watchtower.vercel.app](https://acp-watchtower.vercel.app), paste a manifest, click "Run readiness analysis."

### API
```bash
# Analyze a manifest
curl -X POST https://acp-watchtower.vercel.app/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"manifest": "{\"name\": \"My Agent\", \"actions\": []}"}'

# Diff two manifests
curl -X POST https://acp-watchtower.vercel.app/api/diff \
  -H "Content-Type: application/json" \
  -d '{"oldManifest": "...", "newManifest": "..."}'

# Create a hosted report
curl -X POST https://acp-watchtower.vercel.app/api/reports \
  -H "Content-Type: application/json" \
  -d '{"manifest": "...", "sourceLabel": "ci-check"}'
```

## Scoring categories

| Category | What it checks |
|----------|---------------|
| Schema completeness | Required fields, action definitions, parameter schemas |
| Action clarity | Description quality, placeholder detection, specificity |
| Discoverability | Titles, names, examples for agent tool selection |
| Safety & guardrails | Dangerous action flagging, safety notes, constraints |
| Maintainability | Version metadata, stable IDs, naming conventions |

## Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/analyze` | POST | Analyze a manifest |
| `/api/diff` | POST | Compare two manifests |
| `/api/reports` | GET/POST | List or create reports |
| `/api/reports/[id]` | GET | Get a specific report |
| `/api/badge/[id]` | GET | SVG readiness badge |
| `/api/cron/recheck` | GET | Scheduled re-check endpoint |
| `/api/github/webhook` | POST | GitHub push event handler |
| `/api/sources` | GET/POST | Manage tracked manifest URLs |
| `/api/webhooks/ingest` | POST | External webhook intake |
| `/api/waitlist` | POST | Pro waitlist signup |

## Tech stack

- Next.js 16 + TypeScript
- Tailwind CSS
- Vercel (hosting + cron)
- File-based storage (reports, sources, waitlist)

## License

MIT

---

Built by [Pragmasix](https://pragmasix.vercel.app)
