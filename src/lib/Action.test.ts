import { describe, it, expect } from 'vitest'
import Action from './Action'

describe('Action', () => {
	it('has all expected members', () => {
		expect(Action.equal).toBeDefined()
		expect(Action.delete).toBeDefined()
		expect(Action.insert).toBeDefined()
		expect(Action.none).toBeDefined()
		expect(Action.replace).toBeDefined()
	})

	it('members have distinct values', () => {
		const values = [Action.equal, Action.delete, Action.insert, Action.none, Action.replace]
		expect(new Set(values).size).toBe(5)
	})
})
