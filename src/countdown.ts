import { getTimeLeft, pad } from './utils';

export class Countdown {
	element: HTMLElement;
	target: number;
	timer = 0;

	constructor(element: HTMLElement, date: string) {
		this.element = element;
		this.target = Date.parse(date);
	}

	start() {
		this.update();
		this.timer = window.setInterval(() => this.update(), 1000);
	}

	stop() {
		clearInterval(this.timer);
	}

	update() {
		const time = getTimeLeft(this.target, Date.now());

		this.element.innerHTML = `
			<span><b>${pad(time.days)}</b> days</span>
			<span><b>${pad(time.hours)}</b> hrs</span>
			<span><b>${pad(time.minutes)}</b> min</span>
			<span><b>${pad(time.seconds)}</b> sec</span>
		`;

		if (this.target <= Date.now()) {
			this.stop();
		}
	}
}
