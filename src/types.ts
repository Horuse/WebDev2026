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
