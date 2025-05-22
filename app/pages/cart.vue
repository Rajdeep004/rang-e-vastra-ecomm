<script setup>
	const tabss = [
		{
			label: "Shopping Cart",
			slot: "shoppingcart",
		},
		{
			label: "Chckout Details",
			slot: "checkout",
		},
		{
			label: "Order Complete",
			slot: "completed",
		},
	];
</script>

<template>
	<SectionWrapper>
		<SectionHeading> Cart </SectionHeading>

		<UTabs
			:items="tabss"
			variant="link"
			class="gap-4 w-full"
			:ui="{ trigger: 'grow' }"
		>
			<template #shoppingcart="{ items }">
				<p class="text-muted mb-4">
					Fabric : Lorem ipsum <br />
					Color : Black <br />
					Pattern : Lorem ipsum
				</p>
			</template>

			<template #checkout="{ item }">
				<div class="flex flex-col gap-4">
					<div class="flex items-center gap-2">
						<span class="text-yellow-400">★★★★☆</span>
						<span class="text-sm text-gray-500">(200 reviews)</span>
					</div>
					<p class="text-muted mb-4">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Sed condimentum, nunc at bibendum facilisis, nisi nisl
						aliquet nunc, euismod aliquam nunc nisl euismod nisi.
						Sed condimentum, nunc at bibendum facilisis, nisi nisl
						aliquet nunc, euismod aliquam nunc nisl euismod nisi.
					</p>
				</div>
			</template>
		</UTabs>
	</SectionWrapper>
</template>

<style scoped></style>
