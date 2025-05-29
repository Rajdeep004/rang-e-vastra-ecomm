<script setup>
	const productStore = useProductStore();
	await productStore.fetchAll();

	const products = computed(() => productStore.products);
</script>

<template>
	<NuxtImg
		src="/imgs/cover.png"
		alt="hero banner"
		class="w-full object-cover"
		:placeholder="[50, 25, 75, 5]"
	/>
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
</template>

<style></style>
