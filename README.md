# Orbit

A small web app for browsing upcoming rocket launches and space events.

## Features

- Landing page with a live countdown to the next launch and a list of upcoming space events
- Launches catalog with search, status filter, sorting and pagination (state is kept in the URL)
- Launch details page with mission, rocket, launch pad and webcast information
- Loading and error states with a retry button
- API responses cached in `localStorage` for one hour to stay within the API rate limit
- Responsive layout and basic accessibility: semantic landmarks, skip link, labels, visible focus, `aria-live` regions, reduced motion support

## Tech

- HTML5, CSS (custom properties, grid, flexbox), TypeScript
- Vite, Vitest, ESLint, Prettier
- [Launch Library 2 API](https://thespacedevs.com/llapi) by The Space Devs
- GitHub Pages via GitHub Actions

## Getting started

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build
npm test
npm run lint
npm run format
```

## Project structure

```
index.html          landing page
launches.html       launches catalog
launch.html         launch details
src/api.ts          LaunchApi class, fetch with cache
src/cache.ts        localStorage cache with expiry
src/countdown.ts    Countdown class
src/render.ts       card markup, loading and error states
src/utils.ts        formatting, filtering, sorting, pagination
src/types.ts        API types
src/pages/          one class per page
src/styles/         styles
tests/              unit tests
```

## Technical notes

- Each page is a separate HTML file with its own entry script, built by Vite as a multi-page app.
- The catalog loads up to 100 upcoming launches in a single request. Search, filtering, sorting and pagination run on the client, so the free API limit of about 15 requests per hour is enough.
- All data from the API is escaped before it is inserted into the page, and external links are only rendered for `http` and `https` URLs.
- Tests cover the helper functions, the cache, the API class with a mocked `fetch`, and the countdown with fake timers.
