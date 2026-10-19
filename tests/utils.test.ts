import { describe, expect, it } from 'vitest';
import type { Launch } from '../src/types';
import {
	escapeHtml,
	filterLaunches,
	getPage,
	getTimeLeft,
	isSafeUrl,
	pad,
	sortLaunches,
} from '../src/utils';

function makeLaunch(name: string, provider: string, status: string, net: string): Launch {
	return {
		id: name,
		name: name,
		net: net,
		status: { name: status, abbrev: status },
		image: null,
		launch_service_provider: { name: provider },
		rocket: { configuration: { full_name: 'Rocket' } },
		mission: null,
		pad: { name: 'Pad', map_url: null, location: { name: 'Earth' } },
	};
}

const launches = [
	makeLaunch('Starlink 10', 'SpaceX', 'Go', '2026-11-03T10:00:00Z'),
	makeLaunch('Artemis III', 'NASA', 'TBD', '2026-12-01T10:00:00Z'),
	makeLaunch('Electron Flight', 'Rocket Lab', 'TBC', '2026-11-01T10:00:00Z'),
];

describe('getTimeLeft', () => {
	it('splits milliseconds into days, hours, minutes and seconds', () => {
		const ms = ((2 * 24 + 3) * 3600 + 4 * 60 + 5) * 1000;
		expect(getTimeLeft(ms, 0)).toEqual({ days: 2, hours: 3, minutes: 4, seconds: 5 });
	});

	it('returns zeros when the date has passed', () => {
		expect(getTimeLeft(0, 5000)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
	});
});

describe('pad', () => {
	it('adds a leading zero', () => {
		expect(pad(7)).toBe('07');
		expect(pad(42)).toBe('42');
	});
});

describe('escapeHtml', () => {
	it('escapes html characters', () => {
		expect(escapeHtml('<img src="x">')).toBe('&lt;img src=&quot;x&quot;&gt;');
	});
});

describe('isSafeUrl', () => {
	it('allows only http and https links', () => {
		expect(isSafeUrl('https://youtube.com/watch')).toBe(true);
		expect(isSafeUrl('javascript:alert(1)')).toBe(false);
	});
});

describe('filterLaunches', () => {
	it('finds launches by name', () => {
		const result = filterLaunches(launches, 'artemis', 'all');
		expect(result.map((l) => l.name)).toEqual(['Artemis III']);
	});

	it('finds launches by provider', () => {
		const result = filterLaunches(launches, 'spacex', 'all');
		expect(result.map((l) => l.name)).toEqual(['Starlink 10']);
	});

	it('filters by status', () => {
		const result = filterLaunches(launches, '', 'TBC');
		expect(result.map((l) => l.name)).toEqual(['Electron Flight']);
	});
});

describe('sortLaunches', () => {
	it('sorts by date, soonest first', () => {
		const result = sortLaunches(launches, 'soonest');
		expect(result.map((l) => l.name)).toEqual([
			'Electron Flight',
			'Starlink 10',
			'Artemis III',
		]);
	});

	it('sorts by name', () => {
		const result = sortLaunches(launches, 'name');
		expect(result.map((l) => l.name)).toEqual([
			'Artemis III',
			'Electron Flight',
			'Starlink 10',
		]);
	});

	it('does not change the original array', () => {
		sortLaunches(launches, 'name');
		expect(launches[0].name).toBe('Starlink 10');
	});
});

describe('getPage', () => {
	it('returns items for the requested page', () => {
		const items = [1, 2, 3, 4, 5];
		expect(getPage(items, 1, 2)).toEqual([1, 2]);
		expect(getPage(items, 3, 2)).toEqual([5]);
	});
});
