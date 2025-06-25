<template>
	<div class="marquee">
		<div
			v-for="i in 16"
			:key="i"
			class="marquee__item"
		>
			<slot />
		</div>
	</div>
</template>

<script setup>
	defineProps({
		repeat: {
			type: Number,
			default: 4,
		},
	});
</script>

<style scoped>
	.marquee {
		display: flex;
		overflow: hidden;
		white-space: nowrap;
		width: 100%;
	}
	.marquee__item {
		animation-duration: 8s;
		animation-iteration-count: infinite;
		animation-name: marquee-content;
		animation-timing-function: linear;
	}
	.marquee:hover .marquee__item {
		animation-play-state: paused;
	}

	@keyframes marquee-content {
		from {
			transform: translateX(0%);
		}
		to {
			transform: translateX(-100%);
		}
	}
</style>
