# TV Guide

Teletext-style TV guide prototype built with Next.js and TypeScript.

The app is designed as a frontend-first schedule viewer:

- one row per channel
- a 2-hour time slice as the primary view
- multiple listings rendered inline in a single channel row
- title width proportional to listing duration within the slice
- per-user personalization layered on top of shared channel data

## Current Scope

This repository is the initial scaffold for a static-hosted v1:

- Next.js App Router with static export
- mock data loaded from `public/data`
- teletext-inspired guide layout
- keyboard navigation for slice switching
- mock user switching and personalization
- unit tests for schedule overlap and proportional width calculations

## Tech Stack

- Next.js
- React
- TypeScript
- CSS Modules
- Vitest
- GitHub Actions

## Project Structure

```text
app/                 App shell and global styling
components/guide/    Guide UI components
lib/api/             Data access boundary
lib/guide/           Guide shaping and time-slice logic
lib/types/           Shared TypeScript models
public/data/         Mock channels, users, and schedule slices
tests/               Unit tests
```

## Local Development

Install dependencies:

```bash
npm install
```

Run the app locally:

```bash
npm run dev
```

Run unit tests:

```bash
npm test
```

Create a production build:

```bash
npm run build
```

## Data Model

The app currently uses static JSON files as the v1 data source:

- `public/data/channels.json`
- `public/data/users/index.json`
- `public/data/users/*.json`
- `public/data/schedule/*.json`

The UI talks to the data through the adapter in `lib/api`, so the mock JSON source can be replaced later with a real API.

## Interaction Model

- `Left` / `Right`: move between 2-hour slices
- `1` / `2`: switch mock viewers

## Deployment

This app is configured for static export with Next.js:

- `next.config.mjs` uses `output: "export"`
- production output is generated in `out/`

Recommended first deployment target:

- Azure Static Web Apps for the frontend

See:

- [azure-tv-guide-architecture.md](./azure-tv-guide-architecture.md)
- [docs/deployment-azure-static-web-apps.md](./docs/deployment-azure-static-web-apps.md)
- [ROADMAP.md](./ROADMAP.md)
