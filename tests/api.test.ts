import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LaunchApi } from '../src/api';

function mockFetch(status: number, body: unknown) {
	const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }));
	vi.stubGlobal('fetch', fetchMock);
	return fetchMock;
}

describe('LaunchApi', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('returns launches from the response', async () => {
		mockFetch(200, { results: [{ id: '1', name: 'Test launch' }] });

		const launches = await new LaunchApi().getLaunches();

		expect(launches).toHaveLength(1);
		expect(launches[0].name).toBe('Test launch');
	});

	it('uses the cache for repeated requests', async () => {
		const fetchMock = mockFetch(200, { results: [] });
		const api = new LaunchApi();

		await api.getLaunches();
		await api.getLaunches();

		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('throws a readable error when the rate limit is reached', async () => {
		mockFetch(429, {});

		await expect(new LaunchApi().getLaunches()).rejects.toThrow('Too many requests');
	});

	it('throws an error for failed requests', async () => {
		mockFetch(500, {});

		await expect(new LaunchApi().getEvents()).rejects.toThrow('status 500');
	});
});
