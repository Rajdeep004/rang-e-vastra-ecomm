<script setup>
	defineProps({
		bg: {
			type: String,
			default: null, // e.g., 'gray-100', 'white', 'black', 'primary'
		},
		hasContainer: {
			type: Boolean,
			default: true,
		},
	});
</script>
<template>
	<section
		:class="[
			'w-full px-4 sm:px-6 lg:px-8 py-8',
			bg ? `bg-${bg}` : '',
			hasContainer ? 'container mx-auto' : '',
		]"
	>
		<slot />
	</section>
</template>
