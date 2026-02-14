import { describe, it, expect } from 'bun:test'
import Operation from './Operation'
import Action from './Action'

describe('Operation', () => {
	it('stores all constructor arguments', () => {
		const op = new Operation(Action.equal, 0, 5, 0, 5)
		expect(op.action).toBe(Action.equal)
		expect(op.startInOld).toBe(0)
		expect(op.endInOld).toBe(5)
		expect(op.startInNew).toBe(0)
		expect(op.endInNew).toBe(5)
	})

	it('works with replace action', () => {
		const op = new Operation(Action.replace, 2, 4, 3, 6)
		expect(op.action).toBe(Action.replace)
		expect(op.startInOld).toBe(2)
		expect(op.endInOld).toBe(4)
		expect(op.startInNew).toBe(3)
		expect(op.endInNew).toBe(6)
	})

	it('works with all action types', () => {
		for (const action of [Action.equal, Action.delete, Action.insert, Action.none, Action.replace]) {
			const op = new Operation(action, 0, 1, 0, 1)
			expect(op.action).toBe(action)
		}
	})
})
