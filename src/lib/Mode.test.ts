import { describe, it, expect } from 'bun:test'
import Mode from './Mode'

describe('Mode', () => {
	it('has all expected members', () => {
		expect(Mode.character).toBeDefined()
		expect(Mode.tag).toBeDefined()
		expect(Mode.whitespace).toBeDefined()
		expect(Mode.entity).toBeDefined()
	})

	it('members have distinct values', () => {
		const values = [Mode.character, Mode.tag, Mode.whitespace, Mode.entity]
		expect(new Set(values).size).toBe(4)
	})
})
