import type { Launch } from './types';

export function formatDate(iso: string): string {
	const date = new Date(iso);
	return date.toLocaleString('en-GB', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
}

export function escapeHtml(text: string): string {
	return text
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

export function getTimeLeft(target: number, now: number) {
	let seconds = Math.max(0, Math.floor((target - now) / 1000));

	const days = Math.floor(seconds / 86400);
	seconds = seconds % 86400;
	const hours = Math.floor(seconds / 3600);
	seconds = seconds % 3600;
	const minutes = Math.floor(seconds / 60);
	seconds = seconds % 60;

	return { days, hours, minutes, seconds };
}

export function pad(value: number): string {
	return String(value).padStart(2, '0');
}

export function filterLaunches(launches: Launch[], search: string, status: string): Launch[] {
	const text = search.trim().toLowerCase();

	return launches.filter((launch) => {
		const matchesText =
			launch.name.toLowerCase().includes(text) ||
			launch.launch_service_provider.name.toLowerCase().includes(text);
		const matchesStatus = status === 'all' || launch.status.abbrev === status;
		return matchesText && matchesStatus;
	});
}

export function sortLaunches(launches: Launch[], sort: string): Launch[] {
	const copy = [...launches];

	if (sort === 'name') {
		copy.sort((a, b) => a.name.localeCompare(b.name));
	} else if (sort === 'latest') {
		copy.sort((a, b) => Date.parse(b.net) - Date.parse(a.net));
	} else {
		copy.sort((a, b) => Date.parse(a.net) - Date.parse(b.net));
	}

	return copy;
}

export function getPage<T>(items: T[], page: number, perPage: number): T[] {
	const start = (page - 1) * perPage;
	return items.slice(start, start + perPage);
}

export function isSafeUrl(url: string): boolean {
	return url.startsWith('https://') || url.startsWith('http://');
}
