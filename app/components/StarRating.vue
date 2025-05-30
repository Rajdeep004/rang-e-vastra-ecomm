<template>
	<div class="flex gap-1 items-center">
		<svg
			v-for="index in maxStars"
			:key="index"
			xmlns="http://www.w3.org/2000/svg"
			:class="[
				'w-6 h-6 cursor-pointer transition-colors',
				index <= hoverValue || index <= modelValue
					? 'text-[#FFB400]'
					: 'text-gray-300',
				readonly ? 'cursor-default' : '',
			]"
			fill="currentColor"
			viewBox="0 0 24 24"
			@click="!readonly && updateRating(index)"
			@mouseover="!readonly && (hoverValue = index)"
			@mouseleave="!readonly && (hoverValue = 0)"
		>
			<path
				d="M14.2276 3.44406L15.9874 6.99276C16.2274 7.48675 16.8673 7.96058 17.4073 8.05131L20.5969 8.58563C22.6367 8.92841 23.1167 10.4205 21.6468 11.8924L19.1671 14.3926C18.7471 14.816 18.5172 15.6326 18.6471 16.2174L19.3571 19.3124C19.917 21.7622 18.6271 22.7099 16.4774 21.4295L13.4877 19.6451C12.9478 19.3225 12.0579 19.3225 11.5079 19.6451L8.51827 21.4295C6.3785 22.7099 5.07865 21.7521 5.63859 19.3124L6.34851 16.2174C6.47849 15.6326 6.24852 14.816 5.82856 14.3926L3.34884 11.8924C1.889 10.4205 2.35895 8.92841 4.39872 8.58563L7.58837 8.05131C8.11831 7.96058 8.75824 7.48675 8.99821 6.99276L10.758 3.44406C11.7179 1.51849 13.2777 1.51849 14.2276 3.44406Z"
			/>
		</svg>
	</div>
</template>

<script setup>
	const props = defineProps({
		modelValue: {
			type: Number,
			default: 0,
		},
		maxStars: {
			type: Number,
			default: 5,
		},
		readonly: {
			type: Boolean,
			default: false,
		},
	});

	const emit = defineEmits(["update:modelValue"]);
	const hoverValue = ref(0);

	function updateRating(value) {
		emit("update:modelValue", value);
	}
</script>
