import { defineStore } from "pinia";

export const useProductStore = defineStore("product", {
	state: () => ({
		products: [],
	}),

	getters: {
		getBySlug: (state) => (slug) => {
			return state.products.find((p) => p.slug === slug);
		},
		getById: (state) => (id) => {
			return state.products.find((p) => p.id === id);
		},
		getByCategory: (state) => (category) => {
			return state.products.filter((p) => p.category_id === category);
		},
	},

	actions: {
		async fetchAll() {
			if (this.products.length > 0) return;
			const { data } = await useFetch("/api/products");
			if (data.value) this.products = data.value;
		},
	},
	persist: true,
});
