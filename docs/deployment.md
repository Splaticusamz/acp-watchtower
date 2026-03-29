# Deployment

## Default target
Vercel

## Deployment checklist
1. Install dependencies with `npm install`
2. Verify local build with `npm run build`
3. Link or create Vercel project
4. Deploy preview or production build
5. Confirm root page renders cleanly
6. Store generated URLs in project updates and Discord status posts

## Environment variables
No required runtime environment variables for the infrastructure-only phase.

## Git workflow
- Initialize repo
- Commit infra baseline
- Push to GitHub
- Connect deployment to Vercel
- Use small, clear follow-up commits during feature implementation
