<script setup>
	const productStore = useProductStore();
	await productStore.fetchAll();

	const products = computed(() => productStore.products);

	const config = useRuntimeConfig();

	// Carousel items
	const carouselItems = [
		"/imgs/cover1.png",
		"/imgs/cover2.png",
		"/imgs/cover3.png",
		"/imgs/cover4.png",
	];
</script>

<template>
	<Marquee
		class="font-semibold text-lg py-2 bg-primary"
		:repeat="4"
	>
		<div class="flex items-center font-bold text-bkg">
			<span>100% Pure Cotton</span>
			<span class="mx-4">|</span>
			<span>Free Shipping</span>
			<span class="mx-4">|</span>
			<span>Easy Returns & Exchanges</span>
			<span class="mx-4">|</span>
		</div>
	</Marquee>
	<UCarousel
		v-slot="{ item }"
		:items="carouselItems"
		:autoplay="{ delay: 2000 }"
		class="w-full mx-auto"
	>
		<NuxtImg
			:src="item"
			alt="hero banner"
			class="w-full object-cover"
			:placeholder="[50, 25, 75, 5]"
	/></UCarousel>
	<!-- Trending Now -->
	<SectionWrapper
		id="trending"
		hasContainer
	>
		<SectionHeading class="font-title tracking-widest my-4"
			>Trending Now</SectionHeading
		>
		<div
			class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
		>
			<ProductCard
				v-for="(product, index) in products"
				v-show="product.is_featured"
				:key="index"
				:product-id="product.id"
				:product-slug="product.slug"
				:product-name="product.name"
				:product-image="product.images[0].url"
				:category-name="product.category"
				is-discounted
				:product-discount-price="product.discount_price"
				:product-price="product.price"
			/>
		</div>
	</SectionWrapper>
	<!-- Kurti Set with Dupatta -->
	<SectionWrapper
		id="kurti-set-with-dupatta"
		hasContainer
	>
		<SectionHeading class="font-title tracking-widest my-4"
			>Kurti Set with Dupatta</SectionHeading
		>
		<div
			class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
		>
			<ProductCard
				v-for="(product, index) in products"
				v-show="product.category === 'Kurti Set with Dupatta'"
				:key="index"
				:product-id="product.id"
				:product-slug="product.slug"
				:product-name="product.name"
				:product-image="product.images[0].url"
				:category-name="product.category"
				is-discounted
				:product-discount-price="product.discount_price"
				:product-price="product.price"
			/>
		</div>
	</SectionWrapper>
	<!-- Kurti Cord Set  -->
	<SectionWrapper
		id="kurti-cord-set"
		hasContainer
	>
		<SectionHeading class="font-title tracking-widest my-4"
			>Kurti Cord Set</SectionHeading
		>
		<div
			class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
		>
			<ProductCard
				v-for="(product, index) in products"
				v-show="product.category === 'Cord Set'"
				:key="index"
				:product-id="product.id"
				:product-slug="product.slug"
				:product-name="product.name"
				:product-image="product.images[0].url"
				:category-name="product.category"
				is-discounted
				:product-discount-price="product.discount_price"
				:product-price="product.price"
			/>
		</div>
	</SectionWrapper>
	<!-- Short Kurtis -->
	<SectionWrapper
		id="short-kurtis"
		hasContainer
	>
		<SectionHeading class="font-title tracking-widest my-4"
			>Short Kurtis</SectionHeading
		>
		<div
			class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
		>
			<ProductCard
				v-for="(product, index) in products"
				v-show="product.category === 'Short Kurti'"
				:key="index"
				:product-id="product.id"
				:product-slug="product.slug"
				:product-name="product.name"
				:product-image="product.images[0].url"
				:category-name="product.category"
				is-discounted
				:product-discount-price="product.discount_price"
				:product-price="product.price"
			/>
		</div>
	</SectionWrapper>
	<!-- Long Kurtis -->
	<SectionWrapper
		id="long-kurtis"
		hasContainer
	>
		<SectionHeading class="font-title tracking-widest my-4"
			>Long Kurtis</SectionHeading
		>
		<div
			class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
		>
			<ProductCard
				v-for="(product, index) in products"
				v-show="product.category === 'Long Kurti'"
				:key="index"
				:product-id="product.id"
				:product-slug="product.slug"
				:product-name="product.name"
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
