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
		"@nuxtjs/supabase",
	],
	plugins: ["~/plugins/pinia-plugin-persisted.client.js"],
	css: ["~/assets/css/main.css"],
	ui: {
		colorMode: false,
	},
	supabase: {
		url: process.env.SUPABASE_URL,
		key: process.env.SUPABASE_KEY,
		redirect: false,
	},
	runtimeConfig: {
		public: {
			razorpayKey: process.env.RAZORPAY_KEY,
			imgBaseUrl:
				process.env.PRODUCT_IMAGE_BASE_URL ||
				"https://uppdfjvqwkjkacsyjmar.supabase.co/storage/v1/object/public/product-images/",
		},
	},
	future: {
		compatibilityVersion: 4,
	},
	compatibilityDate: "2024-11-27",
});
