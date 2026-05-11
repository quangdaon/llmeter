# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Dev server (http://localhost:5173)
npm run build      # Production build
npm run preview    # Preview production build locally
npm run check      # svelte-check type-check — run this before committing
```

No test suite. `npm run check` is the primary correctness gate.

## Deployment

The app is deployed as a rewritten sub-path (e.g. `lab.quangdao.com/llmeter`). The base path is set via:

```
APPLICATION_BASE_PATH=/llmeter
```

**Every internal `href` must use `resolve('/path')` from `$app/paths`.** Static asset URLs (images, etc.) must use `` `${base}/images/...` `` — `resolve()` is typed to known routes only and will error on arbitrary strings.

## Architecture

### Data pipeline

The interrogator (sibling repo `llmeter-interrogator`) writes `questions.json` directly into `src/lib/server/`. Vite **bundles this file at build time** — it is not fetched at runtime. After running the interrogator, **the webapp must be rebuilt** to pick up new responses.

`src/lib/server/data.ts` is the single import point for all question/model data. It is server-only (SvelteKit enforces the `src/lib/server/` boundary).

### AI response privacy

AI responses are **never exposed to the client during the quiz**. The quiz `+page.server.ts` strips responses before sending question data to the browser. Responses only reach the client after the user submits via `POST /api/evaluate`, which runs scoring server-side and returns the full `EvaluateResponse`.

Quiz answers travel: browser sessionStorage → `POST /api/evaluate` → score computed server-side → result written to sessionStorage → results page reads from sessionStorage.

### Svelte 5 runes

Runes mode is **forced globally** in `svelte.config.js` (excludes `node_modules`). Use `$state`, `$derived`, `$props` everywhere. The `$store` subscription syntax still works for `$app/stores` if needed, but prefer `$app/state` for new code.

### Scoring algorithm (`src/lib/server/scoring.ts`)

For each answered question with **N** options and **M** AI responses:
- **K** = number of AIs that chose the same option as the user
- `ai_alignment = K / M`
- `weight = log₂(max(N, 2))` — more options = higher signal value
- `final_score = Σ(ai_alignment × weight) / Σ(weight) × 100`
- Dispute easter egg: −5 points if `disputeUsed` (clamped to 0)

### Model icons (`src/lib/components/ModelIcon.svelte`)

Renders Simple Icons SVGs for Anthropic, Google, Meta, and Ollama. Falls back to `<img>` for OpenAI (not in simple-icons). The `logo` prop is the raw path from `questions.json` (e.g. `/images/models/anthropic.svg`); the component extracts the slug to look up the icon. Pass `color` prop to control fill; bubbles override to `white` on hover via CSS `currentColor`.

### Dev-only routes

`/dev/questions` lists all questions and AI answers without user context. The server load throws `error(404)` when `dev === false` and sets `export const prerender = false` so it is excluded from static builds.

### Key shared components

- `QuestionBreakdown.svelte` — question list with AI bubbles and reasoning panels; used in both results page (with `userAnswer`) and the dev page (with empty `userAnswer`, hiding "You" UI)
- `ModelIcon.svelte` — Simple Icons SVG with `<img>` fallback
