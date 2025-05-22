<script setup>
	const route = useRoute();
	const { slug } = route.params;
	const { data: product } = useFetch(
		`http://rjx.local:8000/api/v1/products/${slug}`
	);

	const selectdSize = ref("");
	const quantity = ref(1);
	const items = [
		"/imgs/product_1.png",
		"/imgs/product_2.png",
		"/imgs/product_3.png",
		"/imgs/product_4.png",
	];

	const carousel = useTemplateRef("carousel");
	const activeIndex = ref(0);
	function onSelect(index) {
		activeIndex.value = index;
	}

	function select(index) {
		activeIndex.value = index;

		carousel.value?.emblaApi?.scrollTo(index);
	}

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
			<h1 class="text-2xl font-semibold">
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
				<div class="flex flex-row gap-6 mt-6">
					<UInputNumber
						v-model="quantity"
						:min="1"
						:max="10"
						size="sm"
						class="w-1/2"
					/><button
						class="bg-white border px-6 py-2 rounded hover:shadow w-1/2"
					>
						Add to Cart
					</button>
				</div>
				<button
					class="bg-red-700 text-white px-6 py-2 rounded hover:bg-red-800"
				>
					Buy Now
				</button>
			</div>

			<!-- Trust Badges -->
			<div
				class="grid grid-cols-3 gap-4 text-center mt-6 text-sm text-gray-600"
			>
				<div>
					<span>✅ Easy Return</span>
				</div>
				<div>
					<span>💳 Secure Payment</span>
				</div>
				<div>
					<span>🚚 Fast Delivery</span>
				</div>
			</div>

			<!-- ETA -->
			<p class="mt-4 text-sm text-gray-500">
				Get it delivered by <strong>Sunday, Aug 11, 2024</strong><br />
				📍 Deliver to <strong>Ahmedabad - 380006</strong>
			</p>
		</div>
	</div>
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
					class="text-muted mb-4"
				></p>
			</template>

			<template #reviews="{ item }">
				<div class="flex flex-col gap-4">
					<div class="flex items-center gap-2">
						<span class="text-yellow-400">★★★★☆</span>
						<span class="text-sm text-gray-500">(200 reviews)</span>
					</div>
					<p class="text-muted mb-4">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Sed condimentum, nunc at bibendum facilisis, nisi nisl
						aliquet nunc, euismod aliquam nunc nisl euismod nisi.
						Sed condimentum, nunc at bibendum facilisis, nisi nisl
						aliquet nunc, euismod aliquam nunc nisl euismod nisi.
					</p>
				</div>
			</template>
		</UTabs></SectionWrapper
	>
</template>

<style scoped></style>
