import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
	const client = await serverSupabaseClient(event);
	const productId = event.context.params.id;
	const { data, error } = await client
		.from("reviews")
		.select("*")
		.eq("product_id", productId);

	if (error) {
		console.error(
			`Error fetching reviews for product ${productId}:`,
			error
		);
		return { error: `Failed to fetch reviews for product ${productId}` };
	}
	return data;
});
