import { LaunchApi } from '../api';
import { Countdown } from '../countdown';
import { launchCard, showContent, showError, showLoading } from '../render';
import type { Launch, SpaceEvent } from '../types';
import { escapeHtml, formatDate } from '../utils';

class HomePage {
	api = new LaunchApi();
	nextLaunch = document.querySelector<HTMLElement>('#next-launch')!;
	upcoming = document.querySelector<HTMLElement>('#upcoming')!;
	events = document.querySelector<HTMLElement>('#events')!;
	countdown: Countdown | null = null;

	init() {
		this.loadLaunches();
		this.loadEvents();
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

	async loadEvents() {
		showLoading(this.events, 'Loading events...');

		try {
			const events = await this.api.getEvents();

			if (events.length === 0) {
				showContent(this.events, '<p class="message">No upcoming events.</p>');
				return;
			}

			const items = events.map((event) => this.eventItem(event)).join('');
			showContent(this.events, `<ul class="events">${items}</ul>`);
		} catch (error) {
			showError(this.events, error, () => this.loadEvents());
		}
	}

	renderNextLaunch(launch: Launch) {
		showContent(
			this.nextLaunch,
			`
			<h2 class="next-name"><a href="launch.html?id=${encodeURIComponent(launch.id)}">${escapeHtml(launch.name)}</a></h2>
			<p class="next-meta">
				${escapeHtml(launch.launch_service_provider.name)} ·
				<time datetime="${escapeHtml(launch.net)}">${formatDate(launch.net)}</time>
			</p>
			<p class="next-meta">${escapeHtml(launch.pad.location.name)}</p>
			<div class="countdown" role="timer" aria-label="Time until launch"></div>
		`,
		);

		this.countdown?.stop();
		this.countdown = new Countdown(this.nextLaunch.querySelector('.countdown')!, launch.net);
		this.countdown.start();
	}

	eventItem(event: SpaceEvent): string {
		const place = event.location ? ' · ' + escapeHtml(event.location) : '';

		return `
			<li class="event">
				<time class="mono" datetime="${escapeHtml(event.date)}">${formatDate(event.date)}</time>
				<div>
					<h3>${escapeHtml(event.name)}</h3>
					<p class="event-type">${escapeHtml(event.type.name)}${place}</p>
					<p>${escapeHtml(event.description)}</p>
				</div>
			</li>
		`;
	}
}

new HomePage().init();
