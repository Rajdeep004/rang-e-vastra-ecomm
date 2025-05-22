<script setup>
	defineProps({
		// Define props if needed
		productId: {
			type: Number,
			default: 1,
		},
		productName: {
			type: String,
			default: "Product Name",
		},
		categoryName: {
			type: String,
			default: "Long Kurti",
		},
		productPrice: {
			type: Number,
			default: 9999,
		},
		productOriginalPrice: {
			type: Number,
			default: 19999,
			optional: true,
		},
		productImage: {
			type: String,
			default: "/imgs/product_1.png",
		},
		isDiscounted: {
			type: Boolean,
			default: false,
		},
	});
</script>

<template>
	<NuxtLink :to="`/product/${productId}`">
		<div class="">
			<NuxtImg
				:src="productImage"
				:alt="productImage"
				class="object-cover object-center w-full md:h-84 rounded-lg"
			/>
		</div>
		<div class="mt-4">
			<h5 class="h5">{{ productName }}</h5>
			<p class="text-sm text-gray-500">{{ categoryName }}</p>
			<div class="inline-flex items-baseline justify-between mt-1 gap-2">
				<p
					class="text-lg font-medium text-gray-600 line-through"
					v-if="isDiscounted"
				>
					Rs. {{ productOriginalPrice }}
				</p>
				<p class="text-xl font-medium">Rs. {{ productPrice }}</p>
			</div>
		</div>
	</NuxtLink>
</template>

<style scoped></style>
