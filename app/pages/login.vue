<template>
	<div>
		<h1>Login</h1>
		<form @submit.prevent="handleLogin">
			<input
				type="email"
				v-model="email"
				placeholder="Email"
			/>
			<input
				type="password"
				v-model="password"
				placeholder="Password"
			/>
			<button type="submit">Login</button>
		</form>
	</div>
</template>

<script setup>
	const { signIn } = useAuth();
	const email = ref("");
	const password = ref("");

	const handleLogin = async () => {
		const { error } = await signIn(email.value, password.value);
		if (!error) {
			await navigateTo("/protected");
		}
	};
</script>
