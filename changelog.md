# Changelog — Evaluatorr

All notable changes to this project will be documented in this file.

## [2.3] - 2026-02-08
### Added
- **Segmentation units (`segUnits`)**: new metric to avoid under-scoring literary texts with long sentences and fewer periods.
  - `segUnits` combines end-of-sentence marks (`.!?…`) + `;` + `:` + paragraph breaks.
  - `segPerWords` added for density diagnostics.
- **3rd-person internal focalization signals** (thought/perception verbs) added to the POV metric to better score narratives not written in “je”.
- **Pass 3: Excellence bonus** (up to +3) to better differentiate strong papers:
  - ending control, recurring motifs across the text, “scene” intensity (actions + non-visual senses + internal POV proxies).

### Changed
- **Gates & Pass 1 segmentation** now rely on `segUnits` (fallback to `endPunctAny`/`endPunct`) instead of only `endPunct`, while preserving strict minimum requirements.
- **Hard gate “no end punctuation”** aligned to count `…` via `endPunctAny` (when used as an end mark).
- UI punctuation KPI aligned with scoring definitions:
  - dashboard display uses `endPunctAny` (includes `…`) rather than `endPunct` (only `. ! ?`).

### Fixed
- Resolved regressions caused by patching metrics with an undefined `m` reference (detached code blocks); metrics are now computed via local constants and returned as a single object.
- Reduced false negatives on editorial-quality excerpts (few periods, strong structure) previously capped by segmentation heuristics.

---

## [2.2] - 2026-02-07
### Added
- **Export JSON report**: structured evaluation output for archiving and analysis.
- **Export CSV summary**: lightweight tabular export for spreadsheets.
- **Local history (localStorage)**: save evaluation entries with timestamp, student name, level, score, word count, and triggered gates.

### Changed
- Report payload formatting: normalized fields for scores, gates and key metrics (for consistent tracking).

---

## [2.1] - 2026-02-06
### Added
- **Home/App navigation** within the same HTML file (no reload):
  - `homeView` and `appView` + `showView()` routing.
- **Quick Paste / Example insertion** buttons for rapid testing and demoing.
- Status messaging for evaluation lifecycle (“Analyse…”, “Terminé.”).

### Fixed
- Improved resilience when switching views (focus management, scroll reset).

---

## [2.0] - 2026-02-05
### Added
- **Two-pass scoring architecture** with explicit weighting:
  - **Pass 1 (Form /10)**: punctuation & segmentation, syntax/pace, heuristic spelling/grammar proxies, lexical variety.
  - **Pass 2 (Content /10)**: theme consistency, narrative coherence, internal POV, light/shadow, 5 senses coverage, idea interest.
- **Score /20** produced from weighted passes.
- **Teacher-style feedback generation** plus a transparent **audit trail** (what was rewarded/penalized).
- **Gates (minimum requirements)** and alerts:
  - e.g., missing end-of-sentence punctuation triggers a strict cap (≤ 9.5/20), too short text, paragraph requirements, etc.

### Changed
- Stricter default thresholds (“v2 sévère” baseline) for minimum word count, segmentation expectations, and sentence-length discipline.

