import { LaunchApi } from '../api';
import { launchCard, showContent, showError, showLoading } from '../render';
import type { Launch } from '../types';
import { escapeHtml, formatDate } from '../utils';

class HomePage {
	api = new LaunchApi();
	nextLaunch = document.querySelector<HTMLElement>('#next-launch')!;
	upcoming = document.querySelector<HTMLElement>('#upcoming')!;

	init() {
		this.loadLaunches();
	}

	async loadLaunches() {
		showLoading(this.nextLaunch, 'Loading next launch...');
		showLoading(this.upcoming, 'Loading launches...');

		try {
			const launches = await this.api.getLaunches();
			const future = launches.filter((launch) => Date.parse(launch.net) > Date.now());

			if (future.length === 0) {
				showContent(this.nextLaunch, '<p class="message">No upcoming launches found.</p>');
				showContent(this.upcoming, '');
				return;
			}

			this.renderNextLaunch(future[0]);
			const cards = future.slice(1, 7).map(launchCard).join('');
			showContent(this.upcoming, `<ul class="grid">${cards}</ul>`);
		} catch (error) {
			showError(this.nextLaunch, error, () => this.loadLaunches());
			showContent(this.upcoming, '');
		}
	}

	renderNextLaunch(launch: Launch) {
		showContent(
			this.nextLaunch,
			`
			<h2 class="next-name">${escapeHtml(launch.name)}</h2>
			<p class="next-meta">
				${escapeHtml(launch.launch_service_provider.name)} ·
				<time datetime="${launch.net}">${formatDate(launch.net)}</time>
			</p>
			<p class="next-meta">${escapeHtml(launch.pad.location.name)}</p>
		`,
		);
	}
}

new HomePage().init();
