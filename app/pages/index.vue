<script setup>
	const products = [
		{
			productName: "Black Oversized T-Shirt",
			categoryName: "Oversized Men Tshirts",
			isDiscounted: true,
			productPrice: 999,
			productOriginalPrice: 1999,
			productImage: "imgs/product_1.png",
		},
		{
			productName: "White Graphic Tee",
			categoryName: "Casual Men Tshirts",
			isDiscounted: false,
			productPrice: 899,
			productOriginalPrice: 899,
			productImage: "imgs/product_2.png",
		},
		{
			productName: "Navy Blue Polo Shirt",
			categoryName: "Polo Shirts",
			isDiscounted: true,
			productPrice: 1199,
			productOriginalPrice: 1799,
			productImage: "imgs/product_3.png",
		},
		{
			productName: "Beige Linen Shirt",
			categoryName: "Formal Shirts",
			isDiscounted: false,
			productPrice: 1499,
			productOriginalPrice: 1499,
			productImage: "imgs/product_4.png",
		},
		{
			productName: "Olive Green Henley",
			categoryName: "Henley Shirts",
			isDiscounted: true,
			productPrice: 799,
			productOriginalPrice: 1399,
			productImage: "imgs/product_5.png",
		},
		{
			productName: "Rust Red Casual Tee",
			categoryName: "Casual Men Tshirts",
			isDiscounted: true,
			productPrice: 699,
			productOriginalPrice: 1099,
			productImage: "imgs/product_6.png",
		},
		{
			productName: "Charcoal V-Neck Tee",
			categoryName: "V-Neck Tshirts",
			isDiscounted: false,
			productPrice: 749,
			productOriginalPrice: 749,
			productImage: "imgs/product_7.png",
		},
		{
			productName: "Sky Blue Striped Shirt",
			categoryName: "Formal Shirts",
			isDiscounted: true,
			productPrice: 1299,
			productOriginalPrice: 1899,
			productImage: "imgs/product_8.png",
		},
	];
</script>

<template>
	<NuxtImg
		src="/imgs/hero_banner.png"
		alt="hero banner"
		class="w-full h-96 object-cover"
		:placeholder="[50, 25, 75, 5]"
	/>
	<SectionWrapper hasContainer>
		<SectionHeading class="my-4">Trending Now</SectionHeading>
		<div
			class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-6 bg-primary"
		>
			<ProductCard
				v-for="(product, index) in products"
				:key="index"
				:product-name="product.productName"
				:category-name="product.categoryName"
				:is-discounted="product.isDiscounted"
				:product-price="product.productPrice"
				:product-original-price="product.productOriginalPrice"
				:product-image="product.productImage"
			/>
		</div>
	</SectionWrapper>
</template>

<style></style>
