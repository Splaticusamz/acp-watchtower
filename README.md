# ACP Watchtower

ACP Watchtower is a Vercel-ready Next.js product shell for a new devtool focused on **ACP manifest validation, release diffing, and shareable agent-readiness reports**.

## Status

**Infrastructure only.**

This repo currently includes:
- Next.js 16 app scaffold with TypeScript and Tailwind CSS
- Professional project documentation
- Vercel deployment wiring
- Git repository setup for iterative nightly build work
- Initial landing page shell aligned to the product wedge

Feature implementation is intentionally deferred to the next build blocks.

## Product overview

ACP Watchtower targets teams building ACP-compatible apps and tooling who need confidence before manifests reach production.

### Core promise

> Paste your ACP manifest, run deterministic checks, compare versions, and get a shareable readiness report.

### V1 scope

- Manifest paste/upload flow
- Schema and structural validation
- Lint checks for weak metadata and unsafe naming
- Manifest diff viewer
- Readiness scoring and issue categorization
- Shareable hosted report pages

### Explicit non-goals for the infra phase

- No production validator logic yet
- No auth wall
- No billing workflow
- No multi-tenant team infrastructure
- No synthetic browser/action runner yet

## Architecture

### Current stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Deployment:** Vercel
- **Version control:** Git + GitHub

### Planned application layers

1. **UI shell**
   - Landing page
   - Validator input flow
   - Report dashboard
   - Diff review flow

2. **Validation engine**
   - Manifest parsing
   - Structural checks
   - Scoring logic
   - Severity-based issue reporting

3. **Persistence/reporting layer**
   - Saved report snapshots
   - Shareable report routes
   - Exportable JSON summaries

4. **Monetization layer**
   - Free/manual checks
   - Pro history + monitoring
   - Design partner onboarding path

## Revenue model

### Free
- Manual validation
- One-off readiness score
- Basic diff output

### Pro
- Saved report history
- Scheduled re-checks
- Release diff alerts
- Score trends and monitoring
- Team collaboration/report sharing improvements

### Services / design partner
- Manual onboarding
- ACP manifest review
- Reliability consulting and setup

## Repository layout

```text
.
├── docs/
│   ├── architecture.md
│   ├── deployment.md
│   ├── product-spec.md
│   ├── revenue-model.md
│   └── roadmap.md
├── src/app/
├── CHANGELOG.md
├── README.md
└── vercel.json
```

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deployment

Vercel is the intended default target.

```bash
vercel
vercel --prod
```

See `docs/deployment.md` for the deployment checklist.

## Next build steps

1. Implement deterministic ACP manifest validation engine
2. Build readiness scoring rubric and issue taxonomy
3. Add diff comparison workflow
4. Add shareable report pages and sample report data
5. Add CTA and monetization plumbing
