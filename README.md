# Virtuo Mobile

Expo + React Native + TypeScript app for public speaking practice.

## Quick Start

1. Install dependencies.
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in Supabase plus API Gateway values.
3. Start Expo.
   ```bash
   npm start
   ```

If Supabase env vars are empty, the auth screen can still enter the local demo flow and the app uses seeded in-memory data.

## App Shape

- `app/(auth)` is the sign in / sign up entry.
- `app/(tabs)` contains Pathway, Home, Profile in that tab order, with Home as the initial route.
- `app/island/[id].tsx` shows vertical node maps.
- `app/exercise/preview/[id].tsx` shows instructions and favorite controls.
- `app/exercise/[id].tsx` runs the fullscreen prompt, recording, grading, and results flow.

## Backend Artifacts

- Supabase schema and seed data live in `supabase/schema.sql` and `supabase/seed.sql`.
- Supabase recording cleanup Edge Function lives in `supabase/functions/recordings-cleanup`.
- AWS Bedrock Lambda proxy lives in `aws/lambda`.

## Store Builds

Set final identifiers in `app.json`, configure EAS credentials, then run:

```bash
eas build --platform all
```
