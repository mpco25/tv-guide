# TV Guide

Static-hosted v1 teletext-style TV guide prototype built with Next.js and TypeScript.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The app reads mock data from `public/data` and renders one row per channel for a selected 2-hour slice.

## Test

```bash
npm test
```

The current tests cover overlap clipping, proportional width calculation, and one-row-per-channel guide shaping.
