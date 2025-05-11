<script setup>
	import SectionWrapper from "~/components/SectionWrapper.vue";
</script>

<template>
	<NuxtImg
		src="/imgs/hero_banner.png"
		alt="hero banner"
		class="w-full h-96 object-cover"
		:placeholder="[50, 25, 75, 5]"
	/>
	<SectionWrapper hasContainer>
		<SectionHeading>Trending Now</SectionHeading>
		<ProductCard
			product-name="Black Tshirt"
			category-name="Oversized Men Tshirts"
			is-discounted="true"
			product-price="999"
			product-original-price="1999"
			product-image="/imgs/product_1.png"
		/>
	</SectionWrapper>
</template>

<style></style>
