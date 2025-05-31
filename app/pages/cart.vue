<script setup>
	const cart = useCartStore();
	const cartItems = computed(() => cart.items);
	onMounted(() => {
		cart.loadFromStorage();
	});
	const tabs = [
		{
			slot: "cart",
			title: "Cart",
			description: "Set your preferred shipping method",
			icon: "i-lucide-shopping-cart",
		},
		{
			slot: "address",
			title: "Address",
			description: "Add your address here",
			icon: "i-lucide-house",
		},

		{
			slot: "checkout",
			title: "Checkout",
			description: "Confirm your order",
			icon: "i-lucide-credit-card", // or i-lucide-scan-line
		},
	];

	const couponCode = ref("");
	const discount = ref(34);
	const coupon = ref(true);
	const shipping = ref("free");

	const subtotal = computed(() =>
		cartItems.value.reduce(
			(sum, item) => sum + item.price * item.quantity,
			0
		)
	);
	const total = computed(
		() =>
			subtotal.value +
			(shipping.value === "express" ? 15 : 0) -
			(coupon.value ? discount.value : 0)
	);

	const increment = (id) => {
		const item = cartItems.value.find((i) => i.id === id);
		if (item) item.quantity++;
	};

	const decrement = (id) => {
		const item = cartItems.value.find((i) => i.id === id);
		if (item && item.quantity > 1) item.quantity--;
	};

	const removeItem = (id) => {
		cartItems.value = cartItems.value.filter((item) => item.id !== id);
	};

	const applyCoupon = () => {
		if (couponCode.value === "SAVE10") {
			discount.value = 50;
			coupon.value = true;
		}
	};

	const removeCoupon = () => {
		coupon.value = false;
		discount.value = 0;
	};
</script>

<template>
	<SectionWrapper>
		<SectionHeading class="m-8">Cart</SectionHeading>
		<UStepper
			:items="tabs"
			class="w-full"
		>
			<template #cart>
				<!-- Left: Product List -->
				<div class="md:col-span-2 space-y-6">
					<h2 class="text-xl font-semibold">Shopping Cart</h2>

					<div
						v-for="item in cartItems"
						:key="item.id"
						class="flex gap-4 items-start border-b pb-4"
					>
						<img
							:src="item.image"
							alt="Product Image"
							class="w-24 h-24 object-cover rounded"
						/>
						<div class="flex-1">
							<h3 class="font-medium">{{ item.name }}</h3>
							<p class="text-gray-500 text-sm mb-2">
								Color: {{ item.color }}
							</p>
							<button
								class="text-red-600 text-sm flex items-center gap-1"
								@click="removeItem(item.id)"
							>
								🗑 Remove
							</button>
						</div>
						<div class="flex items-center gap-2">
							<button @click="decrement(item.id)">-</button>
							<input
								type="text"
								:value="item.quantity"
								readonly
								class="w-10 text-center border rounded"
							/>
							<button @click="increment(item.id)">+</button>
						</div>
						<div class="w-20 text-right font-medium">
							${{ (item.price * item.quantity).toFixed(2) }}
						</div>
					</div>
				</div>

				<!-- Right: Summary -->
				<div class="bg-gray-50 p-6 rounded shadow">
					<h3 class="text-lg font-semibold mb-4">Cart summary</h3>

					<div class="space-y-3">
						<label class="flex justify-between items-center">
							<input
								type="radio"
								v-model="shipping"
								value="free"
							/>
							Free shipping <span>$0.00</span>
						</label>
						<label class="flex justify-between items-center">
							<input
								type="radio"
								v-model="shipping"
								value="express"
							/>
							Express shipping <span>+$15.00</span>
						</label>
					</div>

					<div class="mt-4">
						<p class="flex justify-between">
							<span>Coupon Code</span>
							<button
								@click="removeCoupon"
								v-if="coupon"
							>
								✖
							</button>
						</p>
						<p class="text-right text-green-600">
							-₹{{ discount }}
						</p>
					</div>

					<hr class="my-3" />

					<p class="flex justify-between">
						<span>Subtotal</span>
						<span>₹{{ subtotal }}</span>
					</p>
					<p class="flex justify-between font-semibold text-lg">
						<span>Total</span>
						<span>₹{{ total }}</span>
					</p>

					<button
						class="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
					>
						Checkout
					</button>

					<!-- Coupon -->
					<div class="mt-4 text-sm">
						<p>Have a coupon?</p>
						<div class="flex mt-1">
							<input
								v-model="couponCode"
								placeholder="Enter code"
								class="border rounded-l px-2 py-1 flex-1"
							/>
							<button
								@click="applyCoupon"
								class="bg-gray-200 px-4 rounded-r"
							>
								Apply
							</button>
						</div>
					</div>
				</div>
			</template>
			<template #address>
				<Placeholder class="aspect-video"> Address </Placeholder>
			</template>

			<template #checkout>
				<Placeholder class="aspect-video"> Checkout </Placeholder>
			</template>
		</UStepper>
	</SectionWrapper>
</template>
