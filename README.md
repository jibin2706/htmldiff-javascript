# htmldiff-javascript

Diffs two HTML blocks, and returns a meshing of the two that includes `<ins>` and `<del>` elements. The classes of these elements are `ins.diffins` for new code, `del.diffdel` for removed code, and `del.diffmod` and `ins.diffmod` for sections of code that have been changed.

For "special tags" (primarily style tags such as `<em>` and `<strong>`), `ins.mod` elements are inserted with the new styles.

Zero-dependency TypeScript port of [htmldiff.net](https://github.com/Rohland/htmldiff.net).

Fork of [htmldiff-js](https://github.com/dfoverdx/htmldiff-js). With the following changes:

1. TypeScript
2. Expose [options](src/lib/types.ts) from the HtmlDiff class

## Installation

```bash
npm install htmldiff-javascript
```

## Usage

```typescript
import HtmlDiff from 'htmldiff-javascript'

const result = HtmlDiff.execute('<p>old html</p>', '<p>new html</p>')
```

With options:

```typescript
import HtmlDiff from 'htmldiff-javascript'

const result = HtmlDiff.execute(oldHtml, newHtml, {
	repeatingWordsAccuracy: 1.0,
	ignoreWhiteSpaceDifferences: false,
	orphanMatchThreshold: 0.0,
})
```

## Development

Requires [Bun](https://bun.sh/).

```bash
bun install        # install dependencies
bun run build      # compile TypeScript (outputs to dist/)
bun test           # run tests
bun test --watch   # run tests in watch mode
bun dev            # start local HTTP server for the demo page
```
