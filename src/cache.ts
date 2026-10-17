const CACHE_TIME = 60 * 60 * 1000;

export function getCache(key: string) {
	const saved = localStorage.getItem(key);
	if (!saved) return null;

	const item = JSON.parse(saved);
	if (Date.now() - item.time > CACHE_TIME) {
		localStorage.removeItem(key);
		return null;
	}
	return item.data;
}

export function setCache(key: string, data: unknown) {
	const item = { time: Date.now(), data: data };
	localStorage.setItem(key, JSON.stringify(item));
}
