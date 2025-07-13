<script setup>
	useHead({
		script: [
			{
				src: "https://checkout.razorpay.com/v1/checkout.js",
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
			country: "",
			city: "",
			state: "",
			zip: "",
		},
	});

	const countries = ref(["India", "USA", "Canada", "UK", "Australia"]);

	const shipmentRes = ref(null);
	// Place Order Function
	async function payWithRazorpay(amount) {
		// --- STEP 1: Create the Order ---
		const { data: order, error: createError } = await useFetch(
			"/api/orders/create",
			{
				method: "POST",
				body: {
					customer_name: `${formState.contact.firstName} ${formState.contact.lastName}`,
					customer_phone: formState.contact.phone,
					customer_email: formState.contact.email,
					shipping_address: `${formState.shipping.street}, ${formState.shipping.city}, ${formState.shipping.state}, ${formState.shipping.zip}`,
					total_amount: amount,
				},
			}
		);

		if (createError.value || !order.value) {
			console.error("🚨 Failed to create order:", createError.value);
			toast.add({
				title: "❌ Order Error",
				description: "Could not initiate payment. Please try again.",
				color: "danger",
			});
			return;
		}

		// --- STEP 2: Configure and Open Razorpay Checkout ---
		const config = useRuntimeConfig();
		const options = {
			key: config.public.razorpayKey,
			amount: order.value.amount, // Amount is already in paise from your backend
			currency: order.value.currency,
			name: "Rangavastra Store",
			description: `Order #${order.value.order_id}`,
			order_id: order.value.id, // This is the razorpay_order_id

			// --- STEP 3: Handle the Razorpay Response ---
			handler: async function (response) {
				console.log("💳 Razorpay payment response received:", response);

				let verificationResponse;
				try {
					// --- 3a. Verify the payment signature ---
					verificationResponse = await $fetch("/api/orders/verify", {
						method: "POST",
						body: {
							razorpay_payment_id: response.razorpay_payment_id,
							razorpay_order_id: response.razorpay_order_id,
							razorpay_signature: response.razorpay_signature,
							items: cart.items,
						},
					});

					if (!verificationResponse.success) {
						throw new Error(
							verificationResponse.message ||
								"Payment verification failed."
						);
					}

					toast.add({
						title: "✅ Payment Success",
						description: "Your order has been placed!",
						color: "success",
					});
				} catch (err) {
					console.error("🚨 Payment verification failed:", err);
					toast.add({
						title: "❌ Verification Failed",
						description: err.message,
						color: "danger",
					});
					return; // Stop execution if verification fails
				}

				// --- 3b. Create the shipment (ONLY after successful verification) ---
				try {
					const shipmentResponse = await $fetch(
						"/api/shipment/create",
						{
							method: "POST",
							body: {
								orderId: verificationResponse.orderId,
								items: cart.items,
								shiprocketPayload: formState,
							},
						}
					);
					shipmentRes.value = shipmentResponse;

					if (shipmentResponse.success) {
						toast.add({
							title: "✅ Order has been confirmed",
							description:
								"Your order is being prepared for shipping.",
							color: "success",
						});
					} else {
						throw new Error(
							shipmentResponse.message ||
								"Shipment creation failed."
						);
					}
				} catch (err) {
					toast.add({
						title: "❌ Shipment Error",
						description:
							"Your order was paid, you will get refund in 3-5 working days. Please contact support.",
						color: "warning",
					});
				} finally {
					// --- 3c. Finalize UI ---
					cart.clearCart();
					stepper.value?.next();
				}
			},
			prefill: {
				name: `${formState.contact.firstName} ${formState.contact.lastName}`,
				email: formState.contact.email,
				contact: formState.contact.phone,
			},
			theme: { color: "#e12d2d" },
		};

		const rzp = new Razorpay(options);
		rzp.open();
	}
	watch(shipmentRes, (newVal) => {
		if (newVal?.success) {
			setTimeout(() => {
				navigateTo("/");
			}, 5000);
		}
	});
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
						<h4 class="h4">Shopping Cart</h4>

						<div
							v-for="item in cartItems"
							:key="item.id"
							class="flex gap-4 items-start border-b pb-4"
						>
							<img
								:src="item.image"
								alt="Product Image"
								class="w-24 object-top rounded"
							/>
							<div class="flex-1 space-y-2">
								<NuxtLink
									class="font-medium block hover:underline"
									:to="`/product/${item.slug}`"
								>
									{{ item.name + " " + item.category }}
								</NuxtLink>
								<span class="text-gray-600"
									>Selected Size: {{ item.size }}</span
								>
								<button
									class="text-red-600 text-sm flex items-center gap-1 hover:underline"
									@click="cart.removeItem(item.id, item.size)"
								>
									<img
										src="/svgs/delete-put-back.svg"
										alt="delete"
									/>
									<span>Remove</span>
								</button>
							</div>
							<div
								class="flex flex-col justify-between items-end gap-5"
							>
								<!-- Product Price -->
								<div class="font-medium">
									₹{{
										(item.price * item.quantity).toFixed(2)
									}}
								</div>
								<!-- mt spacer -->
								<div class="mt-auto lg:hidden"></div>
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
				<div
					class="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 md:gap-20"
				>
					<!-- Left: Contact & Shipping Address form -->
					<div class="w-full md:w-1/2 space-y-8">
						<div class="space-y-6 bg-gray-50 p-6 rounded shadow">
							<h4 class="h4">Contact Information</h4>
							<UForm
								:state="formState"
								class="space-y-4"
							>
								<div
									class="grid grid-cols-1 md:grid-cols-2 gap-4"
								>
									<UInput
										v-model="formState.contact.firstName"
										label="First Name"
										placeholder="First name"
										required
									/>
									<UInput
										v-model="formState.contact.lastName"
										label="Last Name"
										placeholder="Last name"
										required
									/>
								</div>
								<UInput
									v-model="formState.contact.phone"
									label="Phone Number"
									placeholder="Phone number"
									type="tel"
									required
									class="w-full"
								/>
								<UInput
									v-model="formState.contact.email"
									label="Email address"
									placeholder="Your Email"
									type="email"
									required
									class="w-full"
								/>
							</UForm>
						</div>
						<div class="space-y-6 bg-gray-50 p-6 rounded shadow">
							<h4 class="h4">Shipping Address</h4>
							<UForm
								:state="formState"
								@submit.prevent="payWithRazorpay(total)"
								class="space-y-4"
							>
								<UInput
									v-model="formState.shipping.street"
									label="Street Address *"
									placeholder="Street Address"
									required
									class="w-full"
								/>
								<USelect
									v-model="formState.shipping.country"
									placeholder="Select Country"
									:items="countries"
									required
									class="w-full"
								/>

								<UInput
									v-model="formState.shipping.city"
									label="Town / City *"
									placeholder="Town / City"
									required
									class="w-full"
								/>
								<div
									class="grid grid-cols-1 md:grid-cols-2 gap-4"
								>
									<UInput
										v-model="formState.shipping.state"
										label="State"
										placeholder="State"
										required
									/>
									<UInput
										v-model="formState.shipping.zip"
										label="Zip Code"
										placeholder="Zip Code"
										type="number"
										required
									/>
								</div>

								<button
									type="submit"
									class="w-full bg-red-700 text-white px-6 py-2 rounded hover:bg-red-800"
								>
									Buy Now
								</button>
							</UForm>
						</div>
					</div>

					<!-- Right: Order Summary -->
					<div
						class="bg-gray-50 p-6 rounded shadow w-full h-fit md:w-1/2 space-y-6 sticky top-32"
					>
						<h4 class="h4">Order Summary</h4>

						<div
							v-for="item in cartItems"
							:key="item.id"
							class="flex gap-4 items-start border-b border-gray-200 pb-4 h-full"
						>
							<!-- Product Image -->
							<img
								:src="item.image"
								alt="Product Image"
								class="h-32 object-contain rounded"
							/>
							<!-- Product Details -->
							<div
								class="flex-1 flex justify-between items-start py-1 h-32"
							>
								<!-- Product Title and Quantity Control Button -->
								<div
									class="flex flex-col justify-between h-full"
								>
									<h3 class="font-medium">
										{{ item.name + " " + item.category }}
										<div class="text-gray-600 mt-1">
											Size: {{ item.size }}
										</div>
									</h3>

									<!-- Quantity Controls -->
									<div class="flex items-center border w-fit">
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
								<!-- Product Price and Remove Button -->
								<div
									class="flex flex-col justify-between h-full items-end"
								>
									<div class="font-medium">
										₹
										{{
											(
												item.price * item.quantity
											).toFixed(2)
										}}
									</div>
									<button
										class="text-red-600 text-sm flex items-center gap-1 hover:underline"
										@click="
											cart.removeItem(item.id, item.size)
										"
									>
										<img
											src="/svgs/delete-put-back.svg"
											alt=""
										/>
										<span>Remove</span>
									</button>
								</div>
							</div>
						</div>
						<!-- Coupon and Total -->
						<div
							class="flex flex-col gap-4 divide-gray-200 divide-y-2"
						>
							<p
								v-if="discount"
								class="pb-2 flex justify-between font-semibold text-lg"
							>
								<span>Subtotal</span>
								<span>₹{{ subtotal }}</span>
							</p>
							<p
								v-if="discount"
								class="pb-2 flex justify-between font-semibold text-lg"
							>
								<span class="">Coupon</span>
								<span class="text-green-600"
									>-₹{{ discount }}</span
								>
							</p>
							<p
								class="pb-2 flex justify-between font-semibold text-lg"
							>
								<span>Total</span>
								<span>₹{{ total }}</span>
							</p>
						</div>
					</div>
				</div>
			</template>

			<template #checkout>
				<div class="max-w-4xl mx-auto px-4">
					<div
						v-if="shipmentRes.success"
						class=""
					>
						<img
							src="/imgs/success.png"
							alt="Order Success"
							class="w-72 object-contain mx-auto"
						/>
						<h3 class="h3 text-center">
							Your Order has been confirmed
						</h3>
					</div>
					<div
						v-else
						class="flex-col gap-4 w-full flex items-center justify-center"
					>
						<div
							class="size-32 border-4 border-transparent text-black text-4xl animate-spin flex items-center justify-center border-t-black rounded-full"
						>
							<div
								class="size-28 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"
							></div>
						</div>
						<h3 class="h3 text-center">
							Wait till we confirm your order
						</h3>
						<h6 class="h6 text-center mt-1">
							Please do not back or close this screen
						</h6>
					</div>
				</div>
			</template>
		</UStepper>
	</SectionWrapper>
</template>
