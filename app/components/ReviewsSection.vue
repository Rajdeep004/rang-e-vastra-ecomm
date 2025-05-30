<script setup>
	const userRating = ref(3.75);
	userRating.value = Math.round(userRating.value);
</script>

<template>
	<StarRating
		v-model="userRating"
		readonly
	/>
	<p>Selected rating: {{ userRating }} out of 5</p>
	<div class="rating">
		<input
			id="rating1"
			type="radio"
			name="rating"
			value="1"
		/>
		<label for="rating1">1</label>
		<input
			id="rating2"
			type="radio"
			name="rating"
			value="2"
		/>
		<label for="rating2">2</label>
		<input
			id="rating3"
			type="radio"
			name="rating"
			value="3"
		/>
		<label for="rating3">3</label>
		<input
			id="rating4"
			type="radio"
			name="rating"
			value="4"
		/>
		<label for="rating4">4</label>
		<input
			id="rating5"
			type="radio"
			name="rating"
			value="5"
		/>
		<label for="rating5">5</label>
	</div>
</template>

<style scoped>
	.rating {
		display: flex;
	}

	.rating input {
		position: absolute;
		left: -100vw;
	}

	.rating label {
		width: 48px;
		height: 48px;
		overflow: hidden;
		padding: 48px 0 0;
		background: url("/svgs/stars.svg") no-repeat top left;
	}

	.rating:not(:hover) input:indeterminate + label,
	.rating:not(:hover) input:checked ~ input + label,
	.rating input:hover ~ input + label {
		background-position: -48px 0;
	}

	.rating:not(:hover) input:focus-visible + label {
		background-position: -96px 0;
	}
</style>
