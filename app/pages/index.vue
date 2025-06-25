<script setup>
	const productStore = useProductStore();
	await productStore.fetchAll();

	const products = computed(() => productStore.products);
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
	<NuxtImg
		src="/imgs/cover.png"
		alt="hero banner"
		class="w-full object-cover"
		:placeholder="[50, 25, 75, 5]"
	/>
	<!-- Trending Now -->
	<SectionWrapper hasContainer>
		<SectionHeading class="my-4">Trending Now</SectionHeading>
		<div
			class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
		>
			<ProductCard
				v-for="(product, index) in products"
				v-show="product.isFeatured"
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
	<SectionWrapper hasContainer>
		<SectionHeading class="my-4">Kurti Set with Dupatta</SectionHeading>
		<div
			class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
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
	<!-- Short Kurtis -->
	<SectionWrapper hasContainer>
		<SectionHeading class="my-4">Short Kurtis</SectionHeading>
		<div
			class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
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
</template>

<style scoped></style>
