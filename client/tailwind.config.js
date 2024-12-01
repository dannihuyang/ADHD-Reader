/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
			},
			animation: {
				"spin-slow": "spin 2s linear infinite",
			},
			transitionDuration: {
				2000: "2000ms",
			},
		},
	},
	plugins: [],
};
