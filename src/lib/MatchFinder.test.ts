import { describe, it, expect } from 'bun:test'
import MatchFinder from './MatchFinder'
import type MatchOptionsType from './MatchOptions'

function createOptions(overrides: Partial<MatchOptionsType> = {}): MatchOptionsType {
	return {
		blockSize: 1,
		repeatingWordsAccuracy: 1.0,
		ignoreWhitespaceDifferences: false,
		...overrides,
	}
}

function findMatch(oldWords: string[], newWords: string[], options?: Partial<MatchOptionsType>) {
	const opts = createOptions(options)
	const finder = new MatchFinder(oldWords, newWords, 0, oldWords.length, 0, newWords.length, opts)
	return finder.findMatch()
}

describe('MatchFinder', () => {
	it('finds a full match for identical word lists', () => {
		const words = ['hello', ' ', 'world']
		const match = findMatch(words, words)
		expect(match).not.toBeNull()
		expect(match!.startInOld).toBe(0)
		expect(match!.startInNew).toBe(0)
		expect(match!.size).toBe(3)
	})

	it('returns null for completely different word lists', () => {
		const match = findMatch(['foo'], ['bar'])
		expect(match).toBeNull()
	})

	it('finds a partial match at the beginning', () => {
		const match = findMatch(['hello', ' ', 'world'], ['hello', ' ', 'earth'])
		expect(match).not.toBeNull()
		expect(match!.startInOld).toBe(0)
		expect(match!.startInNew).toBe(0)
		expect(match!.size).toBe(2) // 'hello' and ' '
	})

	it('returns null for empty word lists', () => {
		const match = findMatch([], [])
		expect(match).toBeNull()
	})

	it('finds a single-word match', () => {
		const match = findMatch(['hello'], ['hello'])
		expect(match).not.toBeNull()
		expect(match!.size).toBe(1)
	})

	it('matches with ignoreWhitespaceDifferences', () => {
		const match = findMatch(['hello', ' ', 'world'], ['hello', '  ', 'world'], {
			ignoreWhitespaceDifferences: true,
		})
		expect(match).not.toBeNull()
		expect(match!.size).toBe(3)
	})

	it('finds match in a sub-range', () => {
		const oldWords = ['a', 'b', 'c', 'd']
		const newWords = ['x', 'b', 'c', 'y']
		const opts = createOptions()
		const finder = new MatchFinder(oldWords, newWords, 1, 3, 1, 3, opts)
		const match = finder.findMatch()
		expect(match).not.toBeNull()
		expect(match!.size).toBe(2) // 'b' and 'c'
	})

	it('works with larger block sizes', () => {
		const words = ['a', 'b', 'c', 'd', 'e']
		const match = findMatch(words, words, { blockSize: 3 })
		expect(match).not.toBeNull()
		expect(match!.size).toBe(5)
	})
})
