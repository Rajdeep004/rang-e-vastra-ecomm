<script setup>
	defineProps({
		size: {
			type: String,
			default: "h2",
		},
	});
</script>

<template>
	<div class="flex items-center justify-center gap-6">
		<NuxtImg
			src="/svgs/wavyline.svg"
			class="w-12"
		/>
		<h2
			class="text-gray-900"
			:class="size"
		>
			<slot />
		</h2>
		<NuxtImg
			src="/svgs/wavyline.svg"
			class="w-12"
		/>
	</div>
</template>

<style scoped></style>
