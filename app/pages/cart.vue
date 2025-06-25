<script setup>
	useHead({
		script: [
			{
				src: "https://checkout.razorpay.com/v1/checkout.js",
				type: "module",
			},
		],
	});
	const cart = useCartStore();
	const cartItems = computed(() => cart.items);
	onMounted(() => {
		cart.loadFromStorage();
	});

	const stepper = useTemplateRef("stepper");
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
	// shipping options
	const shippingOptions = ref([
		{
			label: "Free Shipping",
			value: "free",
			description: "Standard delivery in 5-7 working days.",
		},
		{
			label: "Express Shipping",
			value: "express",
			description: "Fast delivery in 1-2 working days. (₹59 extra)",
		},
	]);
	const couponCode = ref("");
	const discount = ref(0);
	const coupon = ref(false);
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
			(shipping.value === "express" ? 59 : 0) -
			(coupon.value ? discount.value : 0)
	);

	const applyCoupon = () => {
		if (couponCode.value === "SAVE50") {
			discount.value = 50;
			coupon.value = true;
		}
	};

	const removeCoupon = () => {
		coupon.value = false;
		discount.value = 0;
	};
	// Clipboard copy functionality
	const flat50 = ref("SAVE50");
	const toast = useToast();
	const copied = ref(false);
	function copy(text) {
		navigator.clipboard.writeText(text);
		copied.value = true;

		toast.add({
			title: "Copied to clipboard",
			description: text,
			color: "success",
		});
		setTimeout(() => {
			copied.value = false;
		}, 2000);
	}

	// --- FORM STATE ---
	const formState = reactive({
		contact: {
			firstName: "",
			lastName: "",
			phone: "",
			email: "",
		},
		shipping: {
			street: "",
			country: "India",
			city: "",
			state: "",
			zip: "",
			useDifferentBilling: false,
		},
	});

	// Place Order Function
	async function payWithRazorpay(amount) {
		const { data: order } = await useFetch(
			"http://localhost:8000/api/v1/payment/order",
			{
				method: "POST",
				body: { amount },
			}
		);

		const options = {
			key: "rzp_test_2Zkm81fatcOqRe", // Replace with real key or use runtime config
			amount: order.amount,
			currency: "INR",
			name: "Range-a-Vastra",
			description: "Order Payment",
			order_id: order.id,
			handler: async function (response) {
				// Send response.razorpay_payment_id, response.razorpay_order_id, and response.razorpay_signature to backend for verification
				console.log("Payment success:", response);
			},
			prefill: {
				name: "Rajdeep Singh",
				email: "user@rangavastra.com",
				contact: "9123456789",
			},
			theme: { color: "#F37254" },
		};

		const rzp = new Razorpay(options);
		rzp.open();
	}
</script>

<template>
	<SectionWrapper>
		<SectionHeading class="m-8">Cart</SectionHeading>
		<UStepper
			:items="tabs"
			class="w-full"
			ref="stepper"
			orientation="horizontal"
		>
			<template #cart>
				<div
					v-if="cartItems.length"
					class="grid md:grid-cols-3 gap-8"
				>
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
								class="w-24 h-24 object-top rounded"
							/>
							<div class="flex-1">
								<h3 class="font-medium">
									{{ item.name + " " + item.category }}
								</h3>
								<button
									class="text-red-600 text-sm flex items-center gap-1 hover:underline"
									@click="cart.removeItem(item.id)"
								>
									<img
										src="/svgs/delete-put-back.svg"
										alt=""
									/>
									<span>Remove</span>
								</button>
							</div>
							<div class="flex items-center gap-2">
								<!-- Quantity Controls -->
								<div class="flex items-center border">
									<button
										@click="cart.decrement(item.id)"
										class="px-2 text-gray-500"
									>
										−
									</button>
									<input
										type="text"
										:value="item.quantity"
										readonly
										class="w-8 text-center mx-1"
									/>
									<button
										@click="cart.increment(item.id)"
										class="px-2 text-gray-500"
									>
										+
									</button>
								</div>
							</div>
							<div
								class="w-20 text-right font-medium inline-flex"
							>
								₹
								{{ (item.price * item.quantity).toFixed(2) }}
							</div>
						</div>
					</div>

					<!-- Right: Summary -->
					<div class="bg-gray-50 p-6 rounded shadow">
						<h3 class="text-lg font-semibold mb-4">Cart summary</h3>

						<!-- shipping methods -->
						<URadioGroup
							color="primary"
							variant="table"
							default-value="pro"
							v-model="shipping"
							:items="shippingOptions"
						/>

						<hr class="my-3" />

						<p class="flex justify-between">
							<span>Subtotal</span>
							<span>₹{{ subtotal }}</span>
						</p>
						<p
							v-if="shipping == 'express'"
							class="flex justify-between"
						>
							<span>Extra Charges</span>
							<span>₹ 59</span>
						</p>
						<div
							v-if="coupon"
							class="mt-4"
						>
							<p class="flex justify-between">
								<span>Coupon Code</span>
								<button
									@click="removeCoupon"
									v-if="coupon"
								>
									✖
								</button>
							</p>
							<p
								v-if="discount"
								class="text-right text-green-600"
							>
								-₹{{ discount }}
							</p>
						</div>
						<p class="flex justify-between font-semibold text-lg">
							<span>Total</span>
							<span>₹{{ total }}</span>
						</p>

						<button
							class="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
							@click="stepper?.next()"
						>
							Checkout
						</button>

						<!-- Coupon -->
						<div class="mt-4 text-sm">
							<p>Have a coupon?</p>
							<UButtonGroup class="mt-4 w-full">
								<UInput
									icon="i-lucide-tag"
									size="lg"
									variant="outline"
									placeholder="Enter your coupon code"
									v-model="couponCode"
									class="flex-1"
								>
									<template
										v-if="couponCode?.length"
										#trailing
									>
										<UButton
											color="neutral"
											variant="link"
											size="sm"
											icon="i-lucide-circle-x"
											aria-label="Clear input"
											@click="couponCode = ''"
										/> </template
								></UInput>
								<UButton
									color="primary"
									size="lg"
									variant="outline"
									@click="applyCoupon"
									>Apply</UButton
								>
							</UButtonGroup>
							<USlideover
								title="Check Coupon Code"
								class="mt-1"
							>
								<UButton
									label="Check Coupon Code"
									color="neutral"
									variant="link"
								/>

								<template #body>
									<!-- Coupon Cards -->
									<div
										class="border rounded-xl p-4 shadow-sm"
									>
										<h3 class="text-xl font-bold mb-1">
											Flat discount on your order
										</h3>
										<p class="text-gray-600 text-sm mb-2">
											Save flat ₹50
										</p>
										<UInput
											readonly
											v-model="flat50"
											:ui="{
												trailing: 'pr-0.5',
												root: 'w-full',
												base: 'bg-gray-100 font-mono',
											}"
											variant="outline"
											class="mb-2"
										>
											<template #trailing>
												<UTooltip
													text="Copy to clipboard"
													:content="{ side: 'right' }"
												>
													<UButton
														:color="
															copied
																? 'success'
																: 'neutral'
														"
														variant="link"
														size="lg"
														:icon="
															copied
																? 'i-lucide-copy-check'
																: 'i-lucide-copy'
														"
														aria-label="Copy to clipboard"
														@click="copy('SAVE50')"
													/>
												</UTooltip>
											</template>
										</UInput>
										<ul
											class="text-sm text-gray-700 list-disc list-inside space-y-1"
										>
											<li>Valid till 31st Dec 2025.</li>
											<li>For all products.</li>
											<li>
												Use at checkout to apply
												discount.
											</li>
										</ul>
									</div>
								</template>
							</USlideover>
						</div>
					</div>
				</div>
				<div
					v-else
					class="text-center text-gray-500 py-10"
				>
					<p>Your cart is empty</p>
					<NuxtLink
						to="/"
						class="text-red-600 hover:underline"
					>
						Continue Shopping
					</NuxtLink>
				</div>
			</template>
			<template #address>
				<div class="space-y-6">
					<h2 class="text-xl font-semibold">Shipping Address</h2>
					<UForm
						:state="formState"
						@submit="stepper?.next()"
					>
						<UInput
							v-model="formState.contact.firstName"
							label="First Name"
							placeholder="Enter your first name"
							required
						/>
						<UInput
							v-model="formState.contact.lastName"
							label="Last Name"
							placeholder="Enter your last name"
							required
						/>
						<UInput
							v-model="formState.contact.phone"
							label="Phone"
							placeholder="Enter your phone number"
							type="tel"
							required
						/>
						<UInput
							v-model="formState.contact.email"
							label="Email"
							placeholder="Enter your email address"
							type="email"
							required
						/>
						<UInput
							v-model="formState.shipping.street"
							label="Street Address"
							placeholder="123 Main St"
							required
						/>
						<UInput
							v-model="formState.shipping.city"
							label="City"
							placeholder="Enter your city"
							required
						/>
						<UInput
							v-model="formState.shipping.state"
							label="State"
							placeholder="Enter your state"
							required
						/>
						<UInput
							v-model="formState.shipping.zip"
							label="Zip Code"
							placeholder="12345"
							type="number"
							required
						/>
						<USelect
							v-model="formState.shipping.country"
							label="Country"
							:options="[
								{
									label: 'United States',
									value: 'United States',
								},
								{ label: 'India', value: 'India' },
								{ label: 'Canada', value: 'Canada' },
								{
									label: 'United Kingdom',
									value: 'United Kingdom',
								},
								{ label: 'Australia', value: 'Australia' },
							]"
							required
						/>
						<UCheckbox
							v-model="formState.shipping.useDifferentBilling"
							label="Use different billing address"
						/>
						<UButton
							type="submit"
							color="primary"
							class="w-full"
							>Next</UButton
						>
					</UForm>
				</div>
				<p class="text-sm text-gray-500 mt-4">
					By clicking "Next", you agree to our
					<NuxtLink
						to="/terms"
						class="text-red-600 hover:underline"
						>Terms of Service</NuxtLink
					>
					and
					<NuxtLink
						to="/privacy"
						class="text-red-600 hover:underline"
						>Privacy Policy</NuxtLink
					>.
				</p></template
			>

			<template #checkout>
				<Placeholder class="aspect-video"> Checkout </Placeholder>
			</template>
		</UStepper>
	</SectionWrapper>
</template>
