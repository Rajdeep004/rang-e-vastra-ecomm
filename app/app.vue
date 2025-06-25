<script setup>
	import { useEventListener } from "@vueuse/core";

	const originalStoreTitle = "Rangavastra- Shop Latest Designs";
	const attentionGrabbingTitle = "✨ Don't Miss Out! New Arrivals! ";

	const currentBrowserTitle = ref(originalStoreTitle);

	useHead({
		title: currentBrowserTitle,
	});

	// Use useEventListener for simplified event handling
	onMounted(() => {
		useEventListener(document, "visibilitychange", () => {
			if (document.visibilityState === "hidden") {
				currentBrowserTitle.value = attentionGrabbingTitle;
			} else {
				currentBrowserTitle.value = originalStoreTitle;
			}
		});
	});

	const cart = useCartStore();

	// items count in cart
	const itemsCount = computed(() => {
		return cart.items.reduce((total, item) => total + item.quantity, 0);
	});
</script>
<template>
	<!-- Navbar -->

	<header class="bg-white shadow-md sticky top-0 z-50">
		<div
			class="container mx-auto p-4 flex flex-1 items-center justify-between"
		>
			<!-- Logo -->
			<NuxtLink
				to="/"
				class="w-full"
			>
				<img
					src="/rangavatra.png"
					alt="rang-a-Vastra Logo"
					class="inline-block w-1/3 lg:w-48 mr-2"
				/>
			</NuxtLink>

			<NuxtLink
				to="/cart"
				class="text-4xl relative p-4"
			>
				<UChip
					:text="itemsCount"
					size="5xl"
					:ui="{
						base: itemsCount > 0 ? 'size-4 p-2.5' : 'hidden',
					}"
				>
					<Icon
						name="ic:outline-shopping-bag"
						class="text-gray-800 size-8 -z-20"
					/>
				</UChip>
			</NuxtLink>
		</div>
	</header>

	<UApp>
		<NuxtPage />
	</UApp>
	<!-- footer -->
	<footer class="bg-gray-100 mt-10">
		<div
			class="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-5 gap-6 text-sm text-gray-700"
		>
			<!-- Logo -->
			<div class="col-span-1 md:col-span-2">
				<img
					src="/rangavatra.png"
					alt="rang-a-Vastra Logo"
					class="w-1/2 lg:w-1/3 mb-4"
				/>
				<p>
					Rang-a-Vastra is your go-to destination for the latest in
					fashion. Explore our curated collection of clothing and
					accessories.
				</p>
			</div>
			<!-- Links -->
			<div>
				<h3 class="font-bold mb-2">Quick Links</h3>
				<ul class="space-y-1">
					<li>
						<NuxtLink
							to="/"
							class="hover:text-primary"
							>Home</NuxtLink
						>
					</li>
					<li>
						<NuxtLink
							to="/products"
							class="hover:text-primary"
							>Shop</NuxtLink
						>
					</li>
					<li>
						<NuxtLink
							to="/contact"
							class="hover:text-primary"
							>Contact</NuxtLink
						>
					</li>
				</ul>
			</div>

			<!-- Contact Info -->
			<div>
				<h3 class="font-bold mb-2">Contact Us</h3>
				<a
					href="mailto:rangavastra5@gmail.com"
					class="block mb-2 hover:text-primary hover:underline transition-all duration-100"
					>Email: rangavastra5@gmail.com</a
				>
				<a
					href="tel:+919157612108"
					class="block mb-2 hover:text-primary hover:underline transition-all duration-100"
					>Phone: +91 91576 12108
				</a>
			</div>

			<!-- Social Media -->
			<div>
				<h3 class="font-bold mb-2">Follow Us</h3>
				<div class="flex space-x-3">
					<a
						href="#"
						class="hover:text-primary"
						><Icon
							name="line-md:instagram"
							class="size-7"
					/></a>
					<a
						href="#"
						class="hover:text-primary"
						><Icon
							name="line-md:facebook"
							class="size-7"
					/></a>
				</div>
			</div>
		</div>

		<div class="h6 text-center py-4 border-t text-[#4D3F73] font-bold">
			Developed and Maintained by –
			<a
				href="https://www.pixiophile.com"
				class="hover:underline hover:text-purple-950"
				data-cur="pointer"
				>Pixiophile Solutions Pvt. Ltd.</a
			>
			©
			{{ new Date().getFullYear() }}
		</div>
	</footer>
</template>
