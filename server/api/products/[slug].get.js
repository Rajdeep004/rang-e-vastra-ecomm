import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
	const client = await serverSupabaseClient(event);
	const slug = event.context.params.slug;
	const { data, error } = await client
		.from("products")
		.select("*, images(*), category:categories(*)")
		.eq("slug", slug)
		.single();

	if (error) {
		console.error(`Error fetching product ${slug}:`, error);
		return { error: `Failed to fetch product ${slug}` };
	}
	return data.images
		.map((image) => ({
			...image,
			url: `${process.env.PRODUCT_IMAGE_BASE_URL}${image.url}`,
		}))
		.then((images) => ({
			...data,
			images,
			category: data.category.name, // Assuming category has a 'name' field
		}));
});
