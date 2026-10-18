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
	rocket: {
		configuration: {
			full_name: string;
			description?: string;
			length?: number | null;
			diameter?: number | null;
			successful_launches?: number;
			failed_launches?: number;
		};
	};
	mission: {
		name: string;
		type: string;
		description: string;
		orbit: { name: string } | null;
	} | null;
	pad: {
		name: string;
		map_url: string | null;
		location: { name: string };
	};
	vid_urls?: Video[];
}

export interface Video {
	title: string;
	url: string;
}

export interface SpaceEvent {
	id: number;
	name: string;
	date: string;
	description: string;
	location: string | null;
	type: { name: string };
}
