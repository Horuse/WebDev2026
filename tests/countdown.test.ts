import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Countdown } from '../src/countdown';

describe('Countdown', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-10-20T12:00:00Z'));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('shows the time left and updates every second', () => {
		const element = document.createElement('div');
		const countdown = new Countdown(element, '2026-10-21T13:01:05Z');

		countdown.start();
		expect(element.textContent).toMatch(/01\s+days.*01\s+hrs.*01\s+min.*05\s+sec/s);

		vi.advanceTimersByTime(1000);
		expect(element.textContent).toMatch(/04\s+sec/);

		countdown.stop();
	});
});
