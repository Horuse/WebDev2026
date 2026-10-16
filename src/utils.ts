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
