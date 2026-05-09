# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static HTML slide deck for a 30-minute university class on Node.js, TypeScript, and Vite. No build step, no bundler, no dependencies — open `index.html` directly in a browser.

## Running locally

```bash
# Any static file server works:
npx serve .
# or
python3 -m http.server 8080
```

Then open `http://localhost:8080` (or `http://localhost:3000` for `serve`).

## Architecture

The deck is built around one custom element: `<deck-stage>` (defined in `deck-stage.js`). The HTML is the data; the JS is purely presentational infrastructure.

**`index.html`** — the entire deck. Each `<section data-screen-label="NN Label">` is a slide. Slides are light-DOM children of `<deck-stage width="1920" height="1080">`.

**`deck-stage.js`** — self-contained web component (no external deps). Handles:
- Keyboard navigation (←/→, Space, PgUp/PgDn, Home/End, 0–9 to jump, R to reset)
- Auto-scaling: the 1920×1080 canvas scales with `transform: scale()` to fit any viewport (letterboxed)
- Thumbnail rail on the left (lazy-cloned, drag to reorder, right-click context menu)
- Print/PDF: `@media print` lays each slide as a full page at design size
- Speaker notes via `<script type="application/json" id="speaker-notes">` in the document
- `slidechange` CustomEvent on navigation; `deckchange` CustomEvent for rail mutations (delete/move/skip)

**`tokens.css`** — design tokens only (colors, type scale, spacing, radii, shadows, motion). Node.js green brand palette. Import this before `styles.css`.

**`styles.css`** — all slide component styles: cover, section headers, content slides (`.slide.paper`, `.slide.tint`), grid layouts, code blocks, terminal chrome, comparison columns, closing slide.

## Adding or editing slides

Each slide is a `<section>` child of `<deck-stage>`. The `data-screen-label` attribute is auto-managed by the component (numbered + labeled from the first heading). The component reads direct element children as slides — `<template>`, `<script>`, and `<style>` tags are ignored.

To skip a slide from navigation without deleting it: add `data-deck-skip` to the `<section>`.

## Key design token names

- `--accent-primary` / `--node-green-700` — Node.js green
- `--bg-base` — warm paper background
- `--bg-elevated` — card background
- `--font-sans` — Inter; `--font-mono` — JetBrains Mono
- Syntax colors: `--syn-keyword`, `--syn-type`, `--syn-string`, `--syn-fn`, `--syn-comment`

## PDF export

File → Print → Save as PDF in any browser. The `@page` rule is injected into `<head>` at 1920×1080px with zero margins, producing one slide per page.
