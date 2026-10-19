import { defineConfig } from 'vitest/config';

export default defineConfig({
	base: './',
	build: {
		rollupOptions: {
			input: {
				home: 'index.html',
				launches: 'launches.html',
				launch: 'launch.html',
			},
		},
	},
	test: {
		environment: 'jsdom',
	},
});
