import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
	const client = await serverSupabaseClient(event);
	const productId = event.context.params.id;
	const { name, comment, rating } = await readBody(event);
	const { data, error } = await client.from("reviews").insert([
		{
			product_id: productId,
			name,
			comment,
			rating,
		},
	]);

	if (error) {
		console.error(`Error creating review for product ${productId}:`, error);
		return { error: `Failed to create review for product ${productId}` };
	}
	return data;
});
