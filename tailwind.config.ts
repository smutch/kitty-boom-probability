import { join } from 'path'
import type { Config } from 'tailwindcss'
import { skeleton } from '@skeletonlabs/tw-plugin'
import forms from '@tailwindcss/forms';

const colorSafeList: string[] = [];

for (const style of ['success', 'warning', 'error']) { 
	colorSafeList.push(`stroke-${style}-500`);
}

export default {
	darkMode: 'class',
	safelist: colorSafeList,
	content: ['./src/**/*.{html,js,svelte,ts}', join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')],
	theme: {
		extend: {},
	},
	plugins: [
		forms,
		skeleton({
			themes: {
				preset: [
					{
						name: 'modern',
						enhancements: true,
					},
				],
			},
		}),
	],
} satisfies Config;
