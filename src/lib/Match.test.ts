import { describe, it, expect } from 'bun:test'
import Match from './Match'

describe('Match', () => {
	it('stores constructor arguments', () => {
		const match = new Match(3, 5, 2)
		expect(match.startInOld).toBe(3)
		expect(match.startInNew).toBe(5)
		expect(match.size).toBe(2)
	})

	it('computes endInOld as startInOld + size', () => {
		expect(new Match(3, 5, 2).endInOld).toBe(5)
		expect(new Match(0, 0, 10).endInOld).toBe(10)
	})

	it('computes endInNew as startInNew + size', () => {
		expect(new Match(3, 5, 2).endInNew).toBe(7)
		expect(new Match(0, 0, 10).endInNew).toBe(10)
	})

	it('handles zero-size match', () => {
		const match = new Match(0, 0, 0)
		expect(match.endInOld).toBe(0)
		expect(match.endInNew).toBe(0)
	})
})
