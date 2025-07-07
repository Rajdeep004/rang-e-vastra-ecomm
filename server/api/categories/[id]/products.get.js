import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
	const client = await serverSupabaseClient(event);
	const categoryId = event.context.params.id;
	const { data, error } = await client
		.from("products")
		.select("*, images(*)")
		.eq("category_id", categoryId);

	if (error) {
		console.error(
			`Error fetching products for category ${categoryId}:`,
			error
		);
		return { error: `Failed to fetch products for category ${categoryId}` };
	}
	return data.forEach((product) => {
		product.images = product.images.map((image) => ({
			...image,
			url: `${process.env.PRODUCT_IMAGE_BASE_URL}${image.url}`,
		}));
		return product;
	});
});
