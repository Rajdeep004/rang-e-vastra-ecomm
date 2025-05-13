<script setup></script>

<template>
	<div class="flex items-center justify-center gap-6">
		<NuxtImg
			src="/svgs/wavyline.svg"
			class="w-12"
		/>
		<h2 class="h2 font-gray- text-gray-900"><slot /></h2>
		<NuxtImg
			src="/svgs/wavyline.svg"
			class="w-12"
		/>
	</div>
</template>

<style scoped></style>
