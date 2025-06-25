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

	const quickLinks = [
		{ name: "Home", to: "/" },
		{ name: "Trending Now", to: "/#trending" },
		{ name: "Kurti Set with Dupatta", to: "/#kurti-set-with-dupatta" },
		{ name: "Kurti Cord Set", to: "/#kurti-cord-set" },
		{ name: "Short Kurtis", to: "/#short-kurtis" },
		{ name: "Long Kurtis", to: "/#long-kurtis" },
	];

	const cart = useCartStore();

	// items count in cart
	const itemsCount = computed(() => {
		return cart.items.reduce((total, item) => total + item.quantity, 0);
	});
</script>
<template>
	<!-- Navbar -->

	<header class="bg-white shadow-md sticky top-0 z-50">
		<div class="container mx-auto p-4 flex items-center justify-between">
			<!-- Logo -->
			<NuxtLink
				to="/"
				class="w-"
			>
				<img
					src="/rangavatra.png"
					alt="rangavastra Logo"
					class="inline-block w-1/3 lg:h-20 lg:w-full mr-2"
				/>
			</NuxtLink>

			<!-- Navigation Links -->
			<nav class="hidden md:flex space-x-4">
				<NuxtLink
					v-for="link in quickLinks"
					:key="link.name"
					:to="link.to"
					class="text-gray-700 hover:text-primary hover:underline transition-all duration-100 font-semibold text-lg decoration-wavy underline-offset-4"
				>
					{{ link.name }}
				</NuxtLink>
			</nav>
			<!-- Cart Icon -->
			<div>
				<NuxtLink
					to="/cart"
					class="text-4xl block relative p-4"
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
					<li
						v-for="link in quickLinks"
						:key="item"
					>
						<a
							:href="link.to"
							class="hover:text-primary"
							>{{ link.name }}</a
						>
					</li>
				</ul>
			</div>
			<!-- Company Info -->
			<div>
				<h3 class="font-bold mb-2">Legal</h3>
				<ul class="space-y-1">
					<li>
						<NuxtLink
							to="/terms"
							class="hover:text-primary"
							>Terms and Conditions</NuxtLink
						>
					</li>
					<li>
						<NuxtLink
							to="/privacy"
							class="hover:text-primary"
							>Privacy Policy</NuxtLink
						>
					</li>
					<li>
						<NuxtLink
							to="/shipping-policy"
							class="hover:text-primary"
							>Shipping Policy</NuxtLink
						>
					</li>
					<li>
						<NuxtLink
							to="/refund"
							class="hover:text-primary"
							>Cancellation and Refund Policy</NuxtLink
						>
					</li>
				</ul>
			</div>

			<div class="flex flex-col space-y-4">
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
							href="https://www.instagram.com/rang_a_vastra/"
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
		</div>

		<div class="h6 text-center py-4 border-t text-[#4D3F73] font-bold">
			Developed and Maintained by – <br class="block lg:hidden" />
			<a
				href="https://www.pixiophilesolutions.com"
				class="h6 hover:underline hover:text-purple-950"
				data-cur="pointer"
				>Pixiophile Solutions Pvt. Ltd.</a
			>
			<Icon
				name="ri:copyright-line"
				class="size-5 inline-block ml-1 text-gray-500"
			/>
			{{ new Date().getFullYear() }}
		</div>
	</footer>
</template>
