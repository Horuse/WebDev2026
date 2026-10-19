import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getCache, setCache } from '../src/cache';

describe('cache', () => {
	beforeEach(() => {
		localStorage.clear();
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('returns saved data', () => {
		setCache('key', { value: 1 });
		expect(getCache('key')).toEqual({ value: 1 });
	});

	it('returns null for unknown keys', () => {
		expect(getCache('missing')).toBeNull();
	});

	it('removes data older than one hour', () => {
		setCache('key', 'data');
		vi.advanceTimersByTime(61 * 60 * 1000);

		expect(getCache('key')).toBeNull();
		expect(localStorage.getItem('key')).toBeNull();
	});
});
