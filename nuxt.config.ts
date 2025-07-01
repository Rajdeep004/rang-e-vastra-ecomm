// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	vite: {
		server: {
			allowedHosts: ["rjx.local"],
		},
	},
	modules: [
		"@nuxt/ui",
		"@nuxt/eslint",
		"@nuxt/scripts",
		"@nuxt/image",
		"@pinia/nuxt",
	],
	plugins: ["~/plugins/pinia-plugin-persisted.client.js"],
	css: ["~/assets/css/main.css"],
	ui: {
		colorMode: false,
	},
	runtimeConfig: {
		public: {
			razorpayKey: process.env.RAZORPAY_KEY || "rzp_test_2Zkm81fatcOqRe",
			apiBaseUrl: process.env.API_BASE_URL || "http://localhost:3000/api",
		},
	},
	future: {
		compatibilityVersion: 4,
	},
	compatibilityDate: "2024-11-27",
});
