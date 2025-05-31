<script setup></script>
<template>
	<!-- Navbar -->

	<header class="bg-white shadow-md sticky top-0 z-50">
		<div class="container mx-auto p-4 flex items-center justify-between">
			<!-- Logo -->
			<div class="w-full">
				<img
					src="/rangavatra.png"
					alt="rang-a-Vastra Logo"
					class="inline-block w-1/3 lg:w-48 mr-2"
				/>
			</div>

			<NuxtLink
				to="/cart"
				class="text-2xl"
			>
				<Icon
					name="ic:outline-shopping-bag"
					class="text-gray-800 size-8"
				/>
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
							class="hover:text-pink-500"
							>Home</NuxtLink
						>
					</li>
					<li>
						<NuxtLink
							to="/products"
							class="hover:text-pink-500"
							>Shop</NuxtLink
						>
					</li>
					<li>
						<NuxtLink
							to="/contact"
							class="hover:text-pink-500"
							>Contact</NuxtLink
						>
					</li>
				</ul>
			</div>

			<!-- Contact Info -->
			<div>
				<h3 class="font-bold mb-2">Contact Us</h3>
				<p>Email: support@rangevastra.in</p>
				<p>Phone: +91 98765 43210</p>
			</div>

			<!-- Social Media -->
			<div>
				<h3 class="font-bold mb-2">Follow Us</h3>
				<div class="flex space-x-3">
					<a
						href="#"
						class="hover:text-pink-500"
						>Instagram</a
					>
					<a
						href="#"
						class="hover:text-pink-500"
						>Facebook</a
					>
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
