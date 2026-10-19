import { LaunchApi } from '../api';
import { Countdown } from '../countdown';
import { showContent, showError, showLoading } from '../render';
import type { Launch } from '../types';
import { escapeHtml, formatDate, isSafeUrl } from '../utils';

class LaunchPage {
	api = new LaunchApi();
	details = document.querySelector<HTMLElement>('#details')!;
	countdown: Countdown | null = null;

	init() {
		const id = new URLSearchParams(location.search).get('id');

		if (!id) {
			showContent(
				this.details,
				'<p class="message">No launch selected. <a href="launches.html">Browse launches</a>.</p>',
			);
			return;
		}

		this.load(id);
	}

	async load(id: string) {
		showLoading(this.details, 'Loading launch details...');

		try {
			const launch = await this.api.getLaunch(id);
			this.render(launch);
		} catch (error) {
			showError(this.details, error, () => this.load(id));
		}
	}

	render(launch: Launch) {
		document.title = launch.name + ' — Orbit';

		const isFuture = Date.parse(launch.net) > Date.now();
		const image = launch.image
			? `<img class="details-image" src="${escapeHtml(launch.image.image_url)}" alt="${escapeHtml(launch.name)}">`
			: '';

		showContent(
			this.details,
			`
			<header class="details-head">
				<p class="status">${escapeHtml(launch.status.name)}</p>
				<h1>${escapeHtml(launch.name)}</h1>
				<p class="next-meta">
					${escapeHtml(launch.launch_service_provider.name)} ·
					<time datetime="${escapeHtml(launch.net)}">${formatDate(launch.net)}</time>
				</p>
				${isFuture ? '<div class="countdown" role="timer" aria-label="Time until launch"></div>' : ''}
			</header>
			${image}
			<div class="details-grid">
				${this.missionSection(launch)}
				${this.rocketSection(launch)}
				${this.padSection(launch)}
				${this.videoSection(launch)}
			</div>
		`,
		);

		const timer = this.details.querySelector<HTMLElement>('.countdown');
		if (timer) {
			this.countdown = new Countdown(timer, launch.net);
			this.countdown.start();
		}
	}

	missionSection(launch: Launch): string {
		if (!launch.mission) {
			return '<section><h2>Mission</h2><p>No mission details yet.</p></section>';
		}

		const mission = launch.mission;
		return `
			<section>
				<h2>Mission</h2>
				<dl>
					${this.fact('Name', mission.name)}
					${this.fact('Type', mission.type)}
					${this.fact('Orbit', mission.orbit?.name)}
				</dl>
				<p>${escapeHtml(mission.description)}</p>
			</section>
		`;
	}

	rocketSection(launch: Launch): string {
		const rocket = launch.rocket.configuration;
		const length = rocket.length ? rocket.length + ' m' : null;
		const diameter = rocket.diameter ? rocket.diameter + ' m' : null;

		return `
			<section>
				<h2>Rocket</h2>
				<dl>
					${this.fact('Name', rocket.full_name)}
					${this.fact('Length', length)}
					${this.fact('Diameter', diameter)}
					${this.fact('Successful launches', rocket.successful_launches)}
					${this.fact('Failed launches', rocket.failed_launches)}
				</dl>
				<p>${escapeHtml(rocket.description ?? '')}</p>
			</section>
		`;
	}

	padSection(launch: Launch): string {
		const map =
			launch.pad.map_url && isSafeUrl(launch.pad.map_url)
				? `<a href="${escapeHtml(launch.pad.map_url)}" target="_blank" rel="noopener">Open on map</a>`
				: '';

		return `
			<section>
				<h2>Launch pad</h2>
				<dl>
					${this.fact('Pad', launch.pad.name)}
					${this.fact('Location', launch.pad.location.name)}
				</dl>
				${map}
			</section>
		`;
	}

	videoSection(launch: Launch): string {
		const videos = (launch.vid_urls ?? []).filter((video) => isSafeUrl(video.url));

		if (videos.length === 0) {
			return '<section><h2>Webcasts</h2><p>No webcasts announced yet.</p></section>';
		}

		const links = videos
			.map(
				(video) =>
					`<li><a href="${escapeHtml(video.url)}" target="_blank" rel="noopener">${escapeHtml(video.title)}</a></li>`,
			)
			.join('');

		return `<section><h2>Webcasts</h2><ul class="links">${links}</ul></section>`;
	}

	fact(label: string, value: string | number | null | undefined): string {
		if (value === null || value === undefined || value === '') return '';
		return `<div><dt>${label}</dt><dd>${escapeHtml(String(value))}</dd></div>`;
	}
}

new LaunchPage().init();
