/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: 'rgb(var(--color-primary-rgb) / <alpha-value>)',
				background: 'var(--color-background)',
				surface: 'var(--color-surface)',
				'neutral-50': 'var(--color-neutral-50)',
				'neutral-900': 'var(--color-neutral-900)',
			},
			fontFamily: {
				display: ['var(--font-display)'],
				body: ['var(--font-body)'],
			},
		},
	},
	plugins: [],
}
