import { useSupabaseClient, useSupabaseUser } from "#imports";

export const useAuth = () => {
	const user = useSupabaseUser();
	const client = useSupabaseClient();

	const isLoggedIn = computed(() => !!user.value);

	const signUp = async (email, password) => {
		const { data, error } = await client.auth.signUp({
			email,
			password,
		});
		return { data, error };
	};

	const signIn = async (email, password) => {
		const { data, error } = await client.auth.signInWithPassword({
			email,
			password,
		});
		return { data, error };
	};

	const signOut = async () => {
		const { error } = await client.auth.signOut();
		if (error) {
			console.error("Error signing out:", error);
			return;
		}
		await navigateTo("/login");
	};

	return {
		user,
		isLoggedIn,
		signUp,
		signIn,
		signOut,
	};
};
