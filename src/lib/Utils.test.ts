import { describe, it, expect } from 'bun:test'
import {
	isTag,
	stripTagAttributes,
	wrapText,
	isStartOfTag,
	isEndOfTag,
	isStartOfEntity,
	isEndOfEntity,
	isWhiteSpace,
	stripAnyAttributes,
	isWord,
} from './Utils'

describe('isTag', () => {
	it('returns true for simple opening tags', () => {
		expect(isTag('<p>')).toBe(true)
		expect(isTag('<div>')).toBe(true)
	})

	it('returns true for closing tags', () => {
		expect(isTag('</p>')).toBe(true)
		expect(isTag('</div>')).toBe(true)
	})

	it('returns true for self-closing tags', () => {
		expect(isTag('<br/>')).toBe(true)
		expect(isTag('<br />')).toBe(true)
	})

	it('returns true for tags with attributes', () => {
		expect(isTag('<div class="foo">')).toBe(true)
		expect(isTag('<a href="url" target="_blank">')).toBe(true)
	})

	it('returns true for tags with surrounding whitespace', () => {
		expect(isTag('  <p>  ')).toBe(true)
	})

	it('returns false for plain text', () => {
		expect(isTag('hello')).toBe(false)
		expect(isTag('')).toBe(false)
		expect(isTag(' ')).toBe(false)
	})

	it('returns false for img tags (special case)', () => {
		expect(isTag('<img src="x.png">')).toBe(false)
		expect(isTag('<img>')).toBe(false)
	})
})

describe('stripTagAttributes', () => {
	it('strips attributes from tags', () => {
		expect(stripTagAttributes('<p class="foo">')).toBe('<p>')
		expect(stripTagAttributes('<div id="bar" class="baz">')).toBe('<div>')
	})

	it('preserves self-closing slash', () => {
		expect(stripTagAttributes('<br />')).toBe('<br/>')
	})

	it('returns simple tags unchanged', () => {
		expect(stripTagAttributes('<p>')).toBe('<p>')
		expect(stripTagAttributes('</p>')).toBe('</p>')
	})
})

describe('wrapText', () => {
	it('wraps text with tag and css class', () => {
		expect(wrapText('hello', 'ins', 'diffins')).toBe('<ins class="diffins">hello</ins>')
	})

	it('wraps empty text', () => {
		expect(wrapText('', 'del', 'diffdel')).toBe('<del class="diffdel"></del>')
	})

	it('wraps text containing spaces', () => {
		expect(wrapText('foo bar', 'ins', 'diffmod')).toBe('<ins class="diffmod">foo bar</ins>')
	})
})

describe('isStartOfTag', () => {
	it('returns true for <', () => {
		expect(isStartOfTag('<')).toBe(true)
	})

	it('returns false for other characters', () => {
		expect(isStartOfTag('>')).toBe(false)
		expect(isStartOfTag('a')).toBe(false)
	})
})

describe('isEndOfTag', () => {
	it('returns true for >', () => {
		expect(isEndOfTag('>')).toBe(true)
	})

	it('returns false for other characters', () => {
		expect(isEndOfTag('<')).toBe(false)
		expect(isEndOfTag('a')).toBe(false)
	})
})

describe('isStartOfEntity', () => {
	it('returns true for &', () => {
		expect(isStartOfEntity('&')).toBe(true)
	})

	it('returns false for other characters', () => {
		expect(isStartOfEntity('a')).toBe(false)
		expect(isStartOfEntity(';')).toBe(false)
	})
})

describe('isEndOfEntity', () => {
	it('returns true for ;', () => {
		expect(isEndOfEntity(';')).toBe(true)
	})

	it('returns false for other characters', () => {
		expect(isEndOfEntity('&')).toBe(false)
		expect(isEndOfEntity('a')).toBe(false)
	})
})

describe('isWhiteSpace', () => {
	it('returns true for whitespace characters', () => {
		expect(isWhiteSpace(' ')).toBe(true)
		expect(isWhiteSpace('\t')).toBe(true)
		expect(isWhiteSpace('\n')).toBe(true)
	})

	it('returns true for &nbsp;', () => {
		expect(isWhiteSpace('&nbsp;')).toBe(true)
	})

	it('returns true for multiple spaces', () => {
		expect(isWhiteSpace('   ')).toBe(true)
	})

	it('returns false for non-whitespace', () => {
		expect(isWhiteSpace('a')).toBe(false)
		expect(isWhiteSpace('')).toBe(false)
	})
})

describe('isWord', () => {
	it('returns true for word characters', () => {
		expect(isWord('hello')).toBe(true)
		expect(isWord('abc123')).toBe(true)
	})

	it('returns true for # and @', () => {
		expect(isWord('#hashtag')).toBe(true)
		expect(isWord('@mention')).toBe(true)
	})

	it('returns false for non-word characters', () => {
		expect(isWord(' ')).toBe(false)
		expect(isWord('<')).toBe(false)
	})
})

describe('stripAnyAttributes', () => {
	it('strips attributes from tags', () => {
		expect(stripAnyAttributes('<p class="foo">')).toBe('<p>')
	})

	it('returns non-tags unchanged', () => {
		expect(stripAnyAttributes('hello')).toBe('hello')
	})

	it('returns img tags unchanged (not treated as tags)', () => {
		expect(stripAnyAttributes('<img src="x">')).toBe('<img src="x">')
	})
})
