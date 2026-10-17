import { LaunchApi } from '../api';
import { launchCard, showContent, showError, showLoading } from '../render';
import type { Launch } from '../types';
import { filterLaunches, getPage, sortLaunches } from '../utils';

class LaunchesPage {
	api = new LaunchApi();
	launches: Launch[] = [];
	page = 1;
	perPage = 12;

	form = document.querySelector<HTMLFormElement>('#filters')!;
	search = document.querySelector<HTMLInputElement>('#search')!;
	status = document.querySelector<HTMLSelectElement>('#status')!;
	sort = document.querySelector<HTMLSelectElement>('#sort')!;
	count = document.querySelector<HTMLElement>('#count')!;
	list = document.querySelector<HTMLElement>('#list')!;
	pagination = document.querySelector<HTMLElement>('#pagination')!;

	init() {
		this.readUrl();

		this.form.addEventListener('submit', (event) => event.preventDefault());
		this.search.addEventListener('input', () => this.onFilterChange());
		this.status.addEventListener('change', () => this.onFilterChange());
		this.sort.addEventListener('change', () => this.onFilterChange());

		this.pagination.addEventListener('click', (event) => {
			const button = (event.target as HTMLElement).closest('button');
			if (!button) return;

			this.page = Number(button.dataset.page);
			this.render();
			this.list.scrollIntoView({ block: 'start' });
		});

		this.load();
	}

	onFilterChange() {
		this.page = 1;
		this.render();
	}

	readUrl() {
		const params = new URLSearchParams(location.search);
		this.search.value = params.get('search') ?? '';
		this.status.value = params.get('status') ?? 'all';
		this.sort.value = params.get('sort') ?? 'soonest';
		this.page = Number(params.get('page')) || 1;

		if (!this.status.value) this.status.value = 'all';
		if (!this.sort.value) this.sort.value = 'soonest';
	}

	saveUrl() {
		const params = new URLSearchParams();
		if (this.search.value) params.set('search', this.search.value);
		if (this.status.value !== 'all') params.set('status', this.status.value);
		if (this.sort.value !== 'soonest') params.set('sort', this.sort.value);
		if (this.page > 1) params.set('page', String(this.page));

		const query = params.toString();
		history.replaceState(null, '', query ? '?' + query : location.pathname);
	}

	async load() {
		this.count.textContent = '';
		showLoading(this.list, 'Loading launches...');

		try {
			this.launches = await this.api.getLaunches();
			this.render();
		} catch (error) {
			showError(this.list, error, () => this.load());
		}
	}

	render() {
		const filtered = filterLaunches(this.launches, this.search.value, this.status.value);
		const sorted = sortLaunches(filtered, this.sort.value);
		const pages = Math.max(1, Math.ceil(sorted.length / this.perPage));
		this.page = Math.min(this.page, pages);

		this.count.textContent = `${sorted.length} launches found`;

		if (sorted.length === 0) {
			showContent(this.list, '<p class="message">No launches match your search.</p>');
		} else {
			const cards = getPage(sorted, this.page, this.perPage).map(launchCard).join('');
			showContent(this.list, `<ul class="grid">${cards}</ul>`);
		}

		this.renderPagination(pages);
		this.saveUrl();
	}

	renderPagination(pages: number) {
		if (pages <= 1) {
			this.pagination.innerHTML = '';
			return;
		}

		let buttons = '';
		for (let i = 1; i <= pages; i++) {
			const current = i === this.page ? 'aria-current="page"' : '';
			buttons += `<button type="button" class="button" data-page="${i}" aria-label="Page ${i}" ${current}>${i}</button>`;
		}
		this.pagination.innerHTML = buttons;
	}
}

new LaunchesPage().init();
