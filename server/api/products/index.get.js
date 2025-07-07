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
	return data.map((product) => {
		product.images = product.images.map((image) => ({
			...image,
			url: `${process.env.PRODUCT_IMAGE_BASE_URL}${image.url}`,
		}));
		return {
			...product,
			category: product.category.name, // Assuming category has a 'name' field
		};
	});
});
