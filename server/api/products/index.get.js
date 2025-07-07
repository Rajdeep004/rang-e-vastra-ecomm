import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
	const client = await serverSupabaseClient(event);
	const { data, error } = await client
		.from("products")
		.select("*, images(*), category:categories(*)");

	if (error) {
		console.error("Error fetching products:", error);
		return { error: "Failed to fetch products" };
	}
	return data;
});
