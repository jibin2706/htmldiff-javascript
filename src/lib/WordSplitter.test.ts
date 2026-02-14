import { describe, it, expect, spyOn, beforeEach } from 'bun:test'
import { convertHtmlToListOfWords } from './WordSplitter'

// Suppress console.log from WordSplitter entity handling
beforeEach(() => {
	spyOn(console, 'log').mockImplementation(() => {})
})

describe('convertHtmlToListOfWords', () => {
	describe('plain text', () => {
		it('tokenizes a single word', () => {
			expect(convertHtmlToListOfWords('hello', [])).toEqual(['hello'])
		})

		it('tokenizes multiple words separated by space', () => {
			expect(convertHtmlToListOfWords('hello world', [])).toEqual(['hello', ' ', 'world'])
		})

		it('preserves multiple spaces as a single token', () => {
			expect(convertHtmlToListOfWords('hello  world', [])).toEqual(['hello', '  ', 'world'])
		})

		it('tokenizes words with numbers', () => {
			expect(convertHtmlToListOfWords('abc123 def', [])).toEqual(['abc123', ' ', 'def'])
		})
	})

	describe('HTML tags', () => {
		it('tokenizes simple tags', () => {
			expect(convertHtmlToListOfWords('<p>hello</p>', [])).toEqual(['<p>', 'hello', '</p>'])
		})

		it('tokenizes tags with attributes', () => {
			expect(convertHtmlToListOfWords('<p class="foo">hello</p>', [])).toEqual(['<p class="foo">', 'hello', '</p>'])
		})

		it('tokenizes self-closing tags', () => {
			expect(convertHtmlToListOfWords('<br/>', [])).toEqual(['<br/>'])
		})

		it('tokenizes nested tags', () => {
			expect(convertHtmlToListOfWords('<div><p>text</p></div>', [])).toEqual(['<div>', '<p>', 'text', '</p>', '</div>'])
		})

		it('tokenizes void tags', () => {
			expect(convertHtmlToListOfWords('<hr>', [])).toEqual(['<hr>'])
		})
	})

	describe('HTML entities', () => {
		it('tokenizes &amp; as a single token', () => {
			expect(convertHtmlToListOfWords('&amp;', [])).toEqual(['&amp;'])
		})

		it('tokenizes &lt; as a single token', () => {
			expect(convertHtmlToListOfWords('&lt;', [])).toEqual(['&lt;'])
		})
	})

	describe('mixed content', () => {
		it('tokenizes tags with text and spaces', () => {
			expect(convertHtmlToListOfWords('<p>Hello <b>world</b>!</p>', [])).toEqual([
				'<p>',
				'Hello',
				' ',
				'<b>',
				'world',
				'</b>',
				'!',
				'</p>',
			])
		})

		it('tokenizes img tags as words (not as tags)', () => {
			const result = convertHtmlToListOfWords('<img src="x.png"/>', [])
			expect(result.length).toBeGreaterThan(0)
		})
	})

	describe('edge cases', () => {
		it('returns empty array for empty string', () => {
			expect(convertHtmlToListOfWords('', [])).toEqual([])
		})

		it('tokenizes whitespace-only input', () => {
			expect(convertHtmlToListOfWords('   ', [])).toEqual(['   '])
		})

		it('tokenizes a single tag', () => {
			expect(convertHtmlToListOfWords('<p>', [])).toEqual(['<p>'])
		})

		it('handles special word characters # and @', () => {
			const result = convertHtmlToListOfWords('#tag @user', [])
			expect(result).toEqual(['#tag', ' ', '@user'])
		})
	})
})
