# Architecture

## Current architecture

### Frontend
- Next.js App Router
- TypeScript
- Tailwind CSS v4

### Deployment
- Vercel-hosted web app
- GitHub-backed repository

## Planned modules

### 1. Manifest ingestion
- Textarea paste flow
- JSON file upload
- Sample manifest loader

### 2. Validation engine
- Parse + normalization
- Structural rules
- Naming/metadata lint rules
- Severity assignment
- Score calculation

### 3. Diff engine
- Action add/remove/change detection
- Parameter change detection
- Description drift heuristics
- Release-risk summary generation

### 4. Reporting
- Readiness report view model
- Shareable report routes
- JSON export payload

## Proposed directory evolution

```text
src/
  app/
  components/
  lib/
    acp/
      validate.ts
      score.ts
      diff.ts
      types.ts
  content/
    samples/
```
