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
		<SectionHeading>Trending Now</SectionHeading></SectionWrapper
	>
</template>

<style></style>
