export interface Launch {
	id: string;
	name: string;
	net: string;
	status: {
		name: string;
		abbrev: string;
	};
	image: {
		image_url: string;
		thumbnail_url: string;
	} | null;
	launch_service_provider: {
		name: string;
	};
	pad: {
		name: string;
		location: { name: string };
	};
}

export interface SpaceEvent {
	id: number;
	name: string;
	date: string;
	description: string;
	location: string | null;
	type: { name: string };
}
