# CLAUDE.md

## Project Overview

htmldiff-javascript is a zero-dependency TypeScript library that diffs two HTML strings and returns merged HTML with `<ins>` and `<del>` elements highlighting additions, deletions, and modifications. It is a TypeScript port of HtmlDiff.Net.

## Commands

- `pnpm dev` — Start Vite dev server for the demo page (`src/demo/index.html`)
- `pnpm build` — TypeScript compilation + Vite library build (outputs to `dist/`)
- `pnpm test` — Run tests once (Vitest)
- `pnpm test:watch` — Run tests in watch mode
- `pnpm publish` — Publish to npm

## Architecture

Entry point: `src/lib/Diff.ts` exports the `HtmlDiff` class.

Algorithm pipeline:
1. **WordSplitter.ts** — Tokenizes HTML into words, tags, whitespace, and entities using a state machine (modes: character, tag, whitespace, entity)
2. **MatchFinder.ts** — Finds longest matching subsequences between old/new word lists using block-based indexing
3. **Diff.ts** — Orchestrates the diff: tokenize → find matches → generate operations → wrap changes in `<ins>`/`<del>` tags

Supporting files:
- `Match.ts`, `Operation.ts` — Data classes
- `Action.ts`, `Mode.ts` — Enums
- `MatchOptions.ts` — Configuration defaults (blockSize, repeatingWordsAccuracy, ignoreWhitespaceDifferences)
- `Utils.ts` — HTML analysis helpers (isTag, wrapText, stripTagAttributes)
- `types.ts` — Exported `HTMLDiffOptions` type

## Code Style

- **Formatter:** Prettier — tabs, no semicolons, single quotes, trailing commas, 120 char width
- **TypeScript:** Strict mode enabled. Use `private`/`public` access modifiers on class members.
- **Module system:** ES modules (`"type": "module"`)
- **Naming:** PascalCase for classes, camelCase for functions/properties

## Build

Vite library mode outputs:
- `dist/htmldiff.js` (ESM)
- `dist/htmldiff.umd.cjs` (UMD)
- `dist/Diff.d.ts` (type declarations via vite-plugin-dts)

Minification is disabled.
