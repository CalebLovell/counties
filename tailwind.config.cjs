/** @type {import('tailwindcss').Config} */
const { fontFamily } = require(`tailwindcss/defaultTheme`);

module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: [`Inter`, ...fontFamily.sans],
			},
			height: {
				content: `var(--h-content)`,
				slideover: `var(--h-slideover)`,
			},
			backgroundImage: {
				radial: `radial-gradient(ellipse at center, var(--tw-gradient-stops))`,
				"radial-at-t": `radial-gradient(ellipse at top, var(--tw-gradient-stops))`,
				"radial-at-b": `radial-gradient(ellipse at bottom, var(--tw-gradient-stops))`,
				"radial-at-l": `radial-gradient(ellipse at left, var(--tw-gradient-stops))`,
				"radial-at-r": `radial-gradient(ellipse at right, var(--tw-gradient-stops))`,
				"radial-at-tl": `radial-gradient(ellipse at top left, var(--tw-gradient-stops))`,
				"radial-at-tr": `radial-gradient(ellipse at top right, var(--tw-gradient-stops))`,
				"radial-at-bl": `radial-gradient(ellipse at bottom left, var(--tw-gradient-stops))`,
				"radial-at-br": `radial-gradient(ellipse at bottom right, var(--tw-gradient-stops))`,
			},
		},
	},
	plugins: [],
};
