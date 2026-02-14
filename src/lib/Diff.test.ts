import { describe, it, expect, spyOn, beforeEach } from 'bun:test'
import HtmlDiff from './Diff'

// Suppress console.log from WordSplitter entity handling
beforeEach(() => {
	spyOn(console, 'log').mockImplementation(() => {})
})

function countOccurrences(str: string, substr: string): number {
	let count = 0
	let pos = 0
	while ((pos = str.indexOf(substr, pos)) !== -1) {
		count++
		pos += substr.length
	}
	return count
}

function expectBalancedDiffTags(html: string) {
	expect(countOccurrences(html, '<ins')).toBe(countOccurrences(html, '</ins>'))
	expect(countOccurrences(html, '<del')).toBe(countOccurrences(html, '</del>'))
}

describe('HtmlDiff.execute', () => {
	describe('identical inputs', () => {
		it('returns text unchanged when old and new are the same', () => {
			expect(HtmlDiff.execute('hello', 'hello')).toBe('hello')
		})

		it('returns HTML unchanged when old and new are the same', () => {
			expect(HtmlDiff.execute('<p>same</p>', '<p>same</p>')).toBe('<p>same</p>')
		})

		it('returns empty string for two empty strings', () => {
			expect(HtmlDiff.execute('', '')).toBe('')
		})
	})

	describe('insertions', () => {
		it('detects appended text', () => {
			const result = HtmlDiff.execute('hello', 'hello world')
			expect(result).toContain('<ins class="diffins">')
			expect(result).toContain('world')
			expectBalancedDiffTags(result)
		})

		it('detects multiple inserted words', () => {
			const result = HtmlDiff.execute('a', 'a b c')
			expect(result).toContain('<ins class="diffins">')
			expectBalancedDiffTags(result)
		})
	})

	describe('deletions', () => {
		it('detects removed text', () => {
			const result = HtmlDiff.execute('hello world', 'hello')
			expect(result).toContain('<del class="diffdel">')
			expect(result).toContain('world')
			expectBalancedDiffTags(result)
		})

		it('detects multiple deleted words', () => {
			const result = HtmlDiff.execute('a b c', 'a')
			expect(result).toContain('<del class="diffdel">')
			expectBalancedDiffTags(result)
		})
	})

	describe('replacements', () => {
		it('detects replaced text with diffmod class', () => {
			const result = HtmlDiff.execute('hello world', 'hello earth')
			expect(result).toContain('<del class="diffmod">')
			expect(result).toContain('<ins class="diffmod">')
			expect(result).toContain('world')
			expect(result).toContain('earth')
			expectBalancedDiffTags(result)
		})
	})

	describe('HTML content', () => {
		it('handles insertion within a paragraph', () => {
			const result = HtmlDiff.execute('<p>hello</p>', '<p>hello world</p>')
			expect(result).toContain('<ins class="diffins">')
			expectBalancedDiffTags(result)
		})

		it('handles changes in nested HTML', () => {
			const result = HtmlDiff.execute('<div><p>old text</p></div>', '<div><p>new text</p></div>')
			expect(result).toContain('old')
			expect(result).toContain('new')
			expectBalancedDiffTags(result)
		})

		it('handles multiple paragraphs with changes', () => {
			const result = HtmlDiff.execute('<p>first</p><p>second</p>', '<p>first</p><p>modified</p>')
			expect(result).toContain('first')
			expect(result).toContain('modified')
			expectBalancedDiffTags(result)
		})
	})

	describe('empty old or new text', () => {
		it('treats all content as insertion when old is empty', () => {
			const result = HtmlDiff.execute('', 'hello world')
			expect(result).toContain('<ins class="diffins">')
			expect(result).toContain('hello')
			expectBalancedDiffTags(result)
		})

		it('treats all content as deletion when new is empty', () => {
			const result = HtmlDiff.execute('hello world', '')
			expect(result).toContain('<del class="diffdel">')
			expect(result).toContain('hello')
			expectBalancedDiffTags(result)
		})
	})

	describe('special inline tags', () => {
		it('handles strong tag changes', () => {
			const result = HtmlDiff.execute('text', '<strong>text</strong>')
			expect(result).toBeDefined()
			expectBalancedDiffTags(result)
		})

		it('handles em tag changes', () => {
			const result = HtmlDiff.execute('<em>old</em>', '<em>new</em>')
			expect(result).toBeDefined()
			expectBalancedDiffTags(result)
		})

		it('handles formatting tag swap', () => {
			const result = HtmlDiff.execute('<b>text</b>', '<i>text</i>')
			expect(result).toBeDefined()
			expect(result.length).toBeGreaterThan(0)
		})

		it('skips consecutive opening special tags on delete (variable shadowing fix)', () => {
			// When tag param is 'del', opening special-case tags should be skipped.
			// Before the fix, a local variable shadowed the parameter, making this branch dead code.
			const oldText = '<strong><em>styled text</em></strong>'
			const newText = 'plain text'
			const result = HtmlDiff.execute(oldText, newText)
			expect(result).toBeDefined()
			expect(result.length).toBeGreaterThan(0)
			// Verify the diff contains delete markers for the removed formatted content
			expect(result).toContain('<del')
		})
	})

	describe('options', () => {
		it('accepts ignoreWhiteSpaceDifferences option', () => {
			const result = HtmlDiff.execute('hello world', 'hello  world', {
				ignoreWhiteSpaceDifferences: true,
			})
			expect(result).toBeDefined()
		})

		it('accepts orphanMatchThreshold option', () => {
			const result = HtmlDiff.execute('the quick brown fox jumps', 'a slow red dog sleeps', {
				orphanMatchThreshold: 0.0,
			})
			expect(result).toBeDefined()
			expectBalancedDiffTags(result)
		})

		it('filters orphan matches with high threshold', () => {
			const oldText = 'alpha beta gamma delta epsilon'
			const newText = 'one two gamma three four'
			const lowThreshold = HtmlDiff.execute(oldText, newText, { orphanMatchThreshold: 0.0 })
			const highThreshold = HtmlDiff.execute(oldText, newText, { orphanMatchThreshold: 0.5 })
			// Both should produce valid output; high threshold may produce simpler diff
			expectBalancedDiffTags(lowThreshold)
			expectBalancedDiffTags(highThreshold)
		})
	})

	describe('HTML entities', () => {
		it('handles entities in diff', () => {
			const result = HtmlDiff.execute('&amp; test', '&amp; changed')
			expect(result).toBeDefined()
			expectBalancedDiffTags(result)
		})
	})

	describe('class-based usage', () => {
		it('build() produces same result as static execute()', () => {
			const oldText = '<p>hello world</p>'
			const newText = '<p>hello earth</p>'
			const staticResult = HtmlDiff.execute(oldText, newText)
			const instanceResult = new HtmlDiff(oldText, newText).build()
			expect(staticResult).toBe(instanceResult)
		})

		it('supports addBlockExpression()', () => {
			const diff = new HtmlDiff('hello world', 'hello earth')
			diff.addBlockExpression(/world/g)
			const result = diff.build()
			expect(result).toBeDefined()
		})
	})

	describe('stress test', () => {
		it('handles moderately large input without errors', () => {
			const paragraphs = Array.from({ length: 50 }, (_, i) => `<p>Paragraph ${i} with some content.</p>`)
			const oldHtml = paragraphs.join('')
			const newParagraphs = [...paragraphs]
			newParagraphs[10] = '<p>Paragraph 10 with modified content.</p>'
			newParagraphs[25] = '<p>Paragraph 25 has been changed.</p>'
			newParagraphs[40] = '<p>New paragraph 40 text here.</p>'
			const newHtml = newParagraphs.join('')

			const result = HtmlDiff.execute(oldHtml, newHtml)
			expect(result).toBeDefined()
			expect(result.length).toBeGreaterThan(0)
			expectBalancedDiffTags(result)
		})
	})
})
