# Product Spec

## Product
ACP Watchtower

## Problem
Teams shipping ACP-compatible apps need a fast way to validate manifest quality, compare releases, and communicate reliability risk before production agents hit brittle or ambiguous actions.

## Core promise
Paste or upload an ACP manifest, run deterministic checks, and receive a readiness score with actionable fixes.

## V1 capabilities
1. Manifest input via textarea or file upload
2. Structural validation summary
3. Issue list grouped by severity
4. Readiness score and subscores
5. Manifest diff review
6. Shareable hosted report page

## Target users
- ACP experimenters
- AI infra teams
- Devtool founders
- Agent-platform builders

## Non-goals for this phase
- Auth and multi-tenant workspaces
- Billing implementation
- Real browser/action runner
- Continuous monitoring backend

## Success criteria
- Clear landing page and value framing
- Credible validator/report flow
- Working diff scenario demo
- Shareable report artifact
