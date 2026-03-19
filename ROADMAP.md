# Roadmap

## Now

- [x] Create static Next.js scaffold
- [x] Add teletext-style guide layout
- [x] Add mock channels, users, and schedule slices
- [x] Render one row per channel
- [x] Render multiple listings inline within a 2-hour slice
- [x] Size listing widths proportionally to visible duration
- [x] Add user switching
- [x] Add keyboard navigation
- [x] Add unit tests for overlap and guide shaping
- [x] Add GitHub Actions CI
- [x] Add Azure deployment guidance

## Next

- [ ] Add visible favorite highlighting in the guide
- [ ] Add a current-slice "Now" shortcut
- [ ] Add responsive truncation rules for narrow screens
- [ ] Add empty-state behavior for channels with no listings
- [ ] Add a stronger teletext visual system and page chrome
- [ ] Add browser-based user persistence beyond local mock selection

## Soon After

- [ ] Replace static JSON fetches with a real API implementation behind `lib/api`
- [ ] Add channel details view
- [ ] Add program details view
- [ ] Add search
- [ ] Add favorites-only mode
- [ ] Add richer keyboard navigation and selection states
- [ ] Add Playwright end-to-end tests

## Production-Oriented Work

- [ ] Add Azure Static Web Apps deployment workflow
- [ ] Add environment-specific config
- [ ] Add error telemetry
- [ ] Add performance budgets and bundle checks
- [ ] Add accessibility review and keyboard audit
- [ ] Upgrade mock personalization to authenticated user preferences

## Longer-Term Product Ideas

- [ ] Support multiple countries or channel packs
- [ ] Add schedule import pipeline
- [ ] Add reminders or watchlist features
- [ ] Add recommendations
- [ ] Add service-backed personalization
