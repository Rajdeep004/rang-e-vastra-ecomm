<script setup>
	const props = defineProps({
		productId: {
			type: Number,
			required: true,
		},
	});

	// states
	const iswriteReviewOpen = ref(false);
	const selectdRating = ref(0);
	const userName = ref("");
	const userReview = ref("");
	const successMessage = ref("");

	// reviews data
	const { data: reviews } = await useFetch(
		`/api/products/${props.productId}/reviews`
	);

	const averageRating = computed(() => {
		if (reviews.value.length === 0) return 0;
		const total = reviews.value.reduce((sum, r) => sum + r.rating, 0);
		return Math.ceil(total / reviews.value.length);
	});

	const reviewComments = computed(() => {
		return reviews.value
			.filter((r) => r.comment && r.comment.trim() !== "")
			.map((r) => ({
				name: r.name,
				comment: r.comment,
				rating: r.rating,
				created_at: r.created_at,
			}));
	});

	async function submitReview() {
		// Handle the review submission
		await useFetch(`api/products/${props.productId}/reviews`, {
			method: "POST",
			body: {
				name: userName.value,
				comment: userReview.value,
				rating: selectdRating.value,
			},
		});

		// Reset the form
		selectdRating.value = 0;
		userReview.value = "";
		successMessage.value = "Thank you for your review!";
	}

	const dateOptions = {
		year: "numeric",
		month: "short",
		day: "numeric",
	};
</script>

<template>
	<!-- Reviews Section -->
	<div
		class="flex flex-col items-center justify-center gap-4 lg:flex-row lg:justify-around"
	>
		<div id="ratings">
			<h4 class="h4">Customer Reviews</h4>
			<div class="inline-flex items-center gap-1 mb-2">
				<StarRating
					v-model="averageRating"
					readonly
					class="inline-flex"
				/>
				<p class="font-medium">{{ averageRating }} out of 5</p>
			</div>
			<p>Based on {{ reviews.length }} reviews</p>
		</div>
		<UButton
			type="submit"
			size="xl"
			variant="outline"
			color="neutral"
			class="rounded-none hover:scale-105 basicanimation"
			:class="!iswriteReviewOpen && 'bg-black text-bkg hover:bg-gray-800'"
			@click="iswriteReviewOpen = !iswriteReviewOpen"
			v-text="iswriteReviewOpen ? 'Close review form' : 'Write a review'"
		/>
	</div>

	<!-- write a review section -->
	<div
		v-if="iswriteReviewOpen"
		class="max-w-2xl mx-auto mt-4"
	>
		<h3 class="h3 text-center">Write a review</h3>
		<div class="flex items-center mt-4">
			<p class="">Rating:</p>
			<StarRating
				v-model="selectdRating"
				@update:model-value="selectdRating = $event"
				class="inline-flex"
			/>
			<span class="ml-2 text-gray-600"> {{ selectdRating }} / 5</span>
		</div>
		<!-- input -->
		<form
			@submit.prevent="submitReview"
			class="mt-1"
		>
			<UInput
				v-model="userName"
				class="rounded-none w-full mt-2"
				placeholder="Enter your name"
				required
			/>
			<UTextarea
				v-model="userReview"
				class="rounded-none w-full mt-6"
				placeholder="Write your review here..."
			/>
			<p
				v-if="successMessage"
				class="text-green-600 mt-2"
			>
				{{ successMessage }}
			</p>
		</form>
		<!-- submit button -->
		<div class="flex justify-center lg:justify-end mt-4">
			<UButton
				type="submit"
				@click="submitReview"
				class="rounded-none bg-black text-bkg hover:bg-gray-800 hover:scale-105 basicanimation px-8"
			>
				Submit
			</UButton>
		</div>
	</div>

	<!-- all reviews -->
	<div
		v-if="reviewComments.length > 0"
		class="max-w-2xl mx-auto mt-8"
	>
		<h3 class="h3 text-center mb-4">All Reviews</h3>
		<div
			v-for="(review, index) in reviewComments"
			:key="index"
			class="border-b border-gray-200 py-4"
		>
			<div class="flex items-center gap-2 mb-2">
				<p class="h6">{{ review.name }}</p>
				<StarRating
					v-model="review.rating"
					readonly
					class="inline-flex"
				/>
			</div>
			<p class="text-gray-700">{{ review.comment }}</p>
			<p class="text-sm text-gray-500 mt-1">
				{{
					new Date(review.created_at).toLocaleDateString(
						"en-US",
						dateOptions
					)
				}}
			</p>
		</div>
	</div>

	<div v-else>
		<p class="text-center text-gray-500 mt-4">
			No reviews yet. Be the first to write one!
		</p>
	</div>
</template>
