import { getCache, setCache } from './cache';
import type { Launch, SpaceEvent } from './types';

export class LaunchApi {
	baseUrl = 'https://ll.thespacedevs.com/2.3.0';

	async getLaunches(): Promise<Launch[]> {
		const data = await this.load('/launches/upcoming/?limit=100');
		return data.results;
	}

	async getEvents(): Promise<SpaceEvent[]> {
		const data = await this.load('/events/upcoming/?limit=4');
		return data.results;
	}

	async load(path: string) {
		const cached = getCache(path);
		if (cached) return cached;

		const response = await fetch(this.baseUrl + path);
		if (response.status === 429) {
			throw new Error('Too many requests to the API. Please try again later.');
		}
		if (!response.ok) {
			throw new Error('Request failed with status ' + response.status);
		}

		const data = await response.json();
		setCache(path, data);
		return data;
	}
}
