import type { Launch } from './types';
import { escapeHtml, formatDate } from './utils';

export function launchCard(launch: Launch): string {
	const image = launch.image
		? `<img src="${escapeHtml(launch.image.thumbnail_url)}" alt="" loading="lazy" width="400" height="225">`
		: '<div class="card-image-empty"></div>';

	return `
		<li>
			<article class="card">
				${image}
				<div class="card-body">
					<p class="status">${escapeHtml(launch.status.name)}</p>
					<h3><a href="launch.html?id=${encodeURIComponent(launch.id)}">${escapeHtml(launch.name)}</a></h3>
					<p>${escapeHtml(launch.launch_service_provider.name)}</p>
					<p class="mono"><time datetime="${escapeHtml(launch.net)}">${formatDate(launch.net)}</time></p>
				</div>
			</article>
		</li>
	`;
}

export function showLoading(element: HTMLElement, text: string) {
	element.setAttribute('aria-busy', 'true');
	element.innerHTML = `<p class="message loading">${text}</p>`;
}

export function showError(element: HTMLElement, error: unknown, onRetry: () => void) {
	const text = error instanceof Error ? error.message : 'Something went wrong.';

	element.setAttribute('aria-busy', 'false');
	element.innerHTML = `
		<div class="message error" role="alert">
			<p>${escapeHtml(text)}</p>
			<button type="button" class="button">Try again</button>
		</div>
	`;
	element.querySelector('button')!.addEventListener('click', onRetry);
}

export function showContent(element: HTMLElement, html: string) {
	element.setAttribute('aria-busy', 'false');
	element.innerHTML = html;
}
