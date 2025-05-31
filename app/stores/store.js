import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
	state: () => ({
		items: [],
		shipping: "free",
		couponCode: "",
		discount: 0,
	}),

	getters: {
		subtotal: (state) =>
			state.items.reduce(
				(sum, item) => sum + item.price * item.quantity,
				0
			),
		total: (state) => {
			const shippingCost = state.shipping === "express" ? 15 : 0;
			return state.subtotal + shippingCost - state.discount;
		},
		totalQuantity: (state) =>
			state.items.reduce((sum, item) => sum + item.quantity, 0),
	},

	actions: {
		addItem(product) {
			const existing = this.items.find((item) => item.id === product.id);
			if (existing) {
				existing.quantity += product.quantity || 1;
			} else {
				this.items.push({
					...product,
					quantity: product.quantity || 1,
				});
			}
			this.saveToStorage();
		},

		removeItem(id) {
			this.items = this.items.filter((item) => item.id !== id);
			this.saveToStorage();
		},

		increment(id) {
			const item = this.items.find((i) => i.id === id);
			if (item) item.quantity++;
			this.saveToStorage();
		},

		decrement(id) {
			const item = this.items.find((i) => i.id === id);
			if (item && item.quantity > 1) item.quantity--;
			this.saveToStorage();
		},

		applyCoupon(code) {
			if (code === "SAVE10") {
				this.discount = 50;
				this.couponCode = code;
			}
			this.saveToStorage();
		},

		removeCoupon() {
			this.couponCode = "";
			this.discount = 0;
			this.saveToStorage();
		},

		changeShipping(option) {
			this.shipping = option;
			this.saveToStorage();
		},

		saveToStorage() {
			if (process.client) {
				localStorage.setItem(
					"cart",
					JSON.stringify({
						items: this.items,
						shipping: this.shipping,
						couponCode: this.couponCode,
						discount: this.discount,
					})
				);
			}
		},

		loadFromStorage() {
			if (process.client) {
				const data = localStorage.getItem("cart");
				if (data) {
					const parsed = JSON.parse(data);
					this.items = parsed.items || [];
					this.shipping = parsed.shipping || "free";
					this.couponCode = parsed.couponCode || "";
					this.discount = parsed.discount || 0;
				}
			}
		},
	},
});
