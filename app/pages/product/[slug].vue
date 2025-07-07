<script setup>
	const { slug } = useRoute().params;

	const productStore = useProductStore();
	const cart = useCartStore();
	await productStore.fetchAll();
	const product = computed(() => productStore.getBySlug(slug));
	const relatedProducts = computed(() =>
		productStore.getByCategory(product.value.category_id)
	);

	const selectdSize = ref("");
	const quantity = ref(1);
	const isItemInCart = computed(() =>
		cart.items.some((item) => item.id === product.value.id)
	);

	// product image carousel
	const carousel = useTemplateRef("carousel");
	const activeIndex = ref(0);
	function onSelect(index) {
		activeIndex.value = index;
	}

	function select(index) {
		activeIndex.value = index;

		carousel.value?.emblaApi?.scrollTo(index);
	}

	const toast = useToast();
	function addToCart() {
		if (selectdSize.value === "") {
			toast.add({
				title: "Please Select Size",
				color: "error",
			});
			return;
		}
		cart.addItem({
			id: product.value.id,
			name: product.value.name,
			category: product.value.category,
			size: selectdSize.value,
			price: product.value.discount_price,
			quantity: quantity.value,
			image: product.value.images[0].url,
		});
		toast.add({
			title: product.value.name + product.value.category,
			description: "Added to the cart.",
			color: "success",
		});
	}
	function removeFromCart() {
		cart.removeItem(product.value.id);
		toast.add({
			title: product.value.name + product.value.category,
			description: "Removed from the cart.",
			color: "warning",
		});
	}
	function buyNow() {
		if (selectdSize.value === "") {
			toast.add({
				title: "Please Select Size",
				color: "error",
			});
			return;
		}
		addToCart();
		router.push("/cart");
	}

	// Format the date for delivery
	const futureDate = new Date();
	futureDate.setDate(futureDate.getDate() + 7);
	const formattedDate = futureDate.toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "short",
		day: "numeric",
	});

	// Multiple Tabs
	const tabss = [
		{
			label: "Description",
			slot: "description",
		},
		{
			label: "Reviews",
			slot: "reviews",
		},
	];
</script>

<template>
	<div class="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
		<!-- Left: Images -->
		<div class="flex flex-col-reverse md:flex-row gap-4 md:col-span-5">
			<div class="flex md:flex-col gap-6">
				<div
					v-for="(item, index) in product.images"
					:key="index"
					class="size-20 opacity-25 hover:opacity-100 transition-opacity"
					:class="{ 'opacity-100': activeIndex === index }"
					@click="select(index)"
				>
					<NuxtImg
						:src="item.url"
						class="rounded-lg"
					/>
				</div>
			</div>

			<UCarousel
				ref="carousel"
				v-slot="{ item }"
				:items="product.images.map((image) => image.url)"
				class="w-full max-w-md mx-auto"
				@select="onSelect"
			>
				<NuxtImg
					:src="item"
					class="rounded-lg object-cover h-full"
				/>
			</UCarousel>
		</div>

		<!-- Right: Info -->
		<div class="md:col-span-7">
			<h1 class="h4 font-title">
				{{ product.name }} {{ product.category }}
			</h1>
			<div class="flex items-center gap-2 mt-1">
				<span class="text-yellow-400">★★★★☆</span>
				<span class="text-sm text-gray-500">(200 reviews)</span>
			</div>

			<div class="mt-2">
				<span class="line-through text-gray-400 text-sm"
					>Rs. {{ product.price }}.00</span
				>
				<span class="text-xl font-bold text-red-600 ml-2"
					>Rs. {{ product.discount_price }}.00</span
				>
				<span class="text-xs font-medium text-gray-600">
					MRP Incl. of all taxes
				</span>
			</div>

			<!-- Size -->
			<div class="mt-4">
				<p class="font-medium">Size</p>
				<div class="flex gap-2 mt-1">
					<button
						v-for="size in product.sizes"
						:key="size"
						@click="selectdSize = size"
						class="px-3 py-1 border rounded hover:bg-gray-100 basicanimation"
						:class="{
							'bg-primary hover:bg-primary/90 text-white':
								selectdSize === size,
						}"
					>
						{{ size }}
					</button>
				</div>
			</div>

			<!-- Stock Notice -->
			<p
				v-if="product.stock <= 10"
				class="text-sm text-red-600 mt-2"
			>
				Hurry up! Only {{ product.stock }} left
			</p>

			<!-- CTA Buttons -->
			<div class="flex flex-col gap-4 mt-2 md:w-92">
				<div class="flex flex-row gap-2 mt-6">
					<UInputNumber
						v-model="quantity"
						:min="1"
						:max="10"
						size="sm"
						class="w-1/3"
						:ui="{ base: 'py-4 border' }"
						:incrementDisabled="quantity >= 10"
						:decrementDisabled="quantity <= 1"
					/><button
						class="bg-white border px-6 py-2 rounded hover:shadow w-2/3 font-medium text-gray-900"
						:class="{
							'bg-primary text-black ': isItemInCart,
						}"
						@click="isItemInCart ? removeFromCart() : addToCart()"
					>
						{{ isItemInCart ? "Remove from cart" : "Add to Cart" }}
					</button>
				</div>
				<button
					class="bg-red-700 text-white px-6 py-2 rounded hover:bg-red-800"
					@click="buyNow"
				>
					Buy Now
				</button>
				<!-- Trust Badges -->
				<div
					class="grid grid-cols-4 gap-1 text-center mt-6 text-sm text-gray-600"
				>
					<div class="flex flex-col items-center w-full">
						<NuxtImg
							src="/svgs/Delivery Delay.svg"
							alt="Fast Delivery"
							class="w-8 h-8 mb-2"
						/>
						<span class="text-xs">Fast Delivery</span>
					</div>

					<div class="flex flex-col items-center w-full">
						<NuxtImg
							src="/svgs/Delivery Return.svg"
							alt="Fast Delivery"
							class="w-8 h-8 mb-2"
						/>
						<span class="text-xs text-wrap"
							>Easy Order Tracking</span
						>
					</div>
					<div class="flex flex-col items-center w-full">
						<NuxtImg
							src="/svgs/Delivery Return.svg"
							alt=""
							class="w-8 h-8 mb-2"
						/>
						<span class="text-xs text-wrap">7 Days Return</span>
					</div>
					<div class="flex flex-col items-center w-full">
						<NuxtImg
							src="/svgs/Credit Card Validation.svg"
							alt=""
							class="w-8 h-8 mb-2"
						/>
						<span class="text-xs text-wrap"
							>Secure Transcation</span
						>
					</div>
				</div>
				<!-- ETA -->
				<p class="mt-4 text-sm text-gray-400">
					Get it delivered by
					<span class="text-gray-900 font-bold">{{
						formattedDate
					}}</span
					><br />
					Deliver to
					<span class="text-gray-900 font-bold"
						>Ahmedabad - 382330</span
					>
				</p>
			</div>
		</div>
	</div>
	<!-- Wavy Horizontal Rule -->
	<hr class="border-0" />
	<svg
		class="w-full h-4 text-gray-200"
		viewBox="0 0 100 10"
		preserveAspectRatio="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M0 5 Q 2.5 0, 5 5 T 10 5 T 15 5 T 20 5 T 25 5 T 30 5 T 35 5 T 40 5 T 45 5 T 50 5 T 55 5 T 60 5 T 65 5 T 70 5 T 75 5 T 80 5 T 85 5 T 90 5 T 95 5 T 100 5"
			fill="transparent"
			stroke="currentColor"
			stroke-width="0.5"
		/>
	</svg>

	<SectionWrapper hasContainer>
		<UTabs
			:items="tabss"
			variant="link"
			class="gap-4 w-full"
			:ui="{ trigger: 'grow' }"
		>
			<template #description="{ item }">
				<p
					v-html="product.description"
					class="text-gray-600 mb-4"
				></p>
			</template>

			<template #reviews="{ item }">
				<ReviewsSection :product-id="product.id" />
			</template> </UTabs
	></SectionWrapper>

	<SectionWrapper
		hasContainer
		ref="relatedSection"
		id="relatedSection"
	>
		<SectionHeading class="my-4">Related Products</SectionHeading>
		<div
			class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
			:key="relatedProducts.length"
		>
			<ProductCard
				v-for="(product, index) in relatedProducts"
				:key="index"
				:product-id="product.id"
				:product-name="product.name + ' ' + product.category"
				:product-slug="product.slug"
				:product-image="product.images[0].url"
				:category-name="product.category"
				is-discounted
				:product-discount-price="product.discount_price"
				:product-price="product.price"
			/>
		</div>
	</SectionWrapper>
</template>

<style scoped></style>
