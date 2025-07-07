import { serverSupabaseClient } from "#supabase/server";
import Razorpay from "razorpay";

export default defineEventHandler(async (event) => {
	const client = await serverSupabaseClient(event);

	// Read and parse the request body
	const body = await readBody(event);

	// --- Data Validation (More Robust) ---
	if (
		!body ||
		!body.customer_name ||
		!body.customer_phone ||
		!body.shipping_address ||
		!body.total_amount
	) {
		throw createError({
			statusCode: 400,
			statusMessage: "Missing required fields in request body",
		});
	}
	// ------------------------------------

	const { data: order, error: orderError } = await client
		.from("orders")
		.insert([
			{
				order_number: `ORD-${Date.now()}`,
				customer_name: body.customer_name,
				customer_phone: body.customer_phone,
				customer_email: body.customer_email,
				shipping_address: body.shipping_address,
				payment_status: "pending",
				total_amount: body.total_amount,
			},
		])
		.select()
		.single();

	if (orderError) {
		console.error("Error creating order:", orderError);
		throw createError({
			statusCode: 500,
			statusMessage: "Failed to create order in database",
		});
	}

	const razorpay = new Razorpay({
		key_id: process.env.RAZORPAY_KEY,
		key_secret: process.env.RAZORPAY_SECRET,
	});

	try {
		const razorpayOrder = await razorpay.orders.create({
			amount: body.total_amount * 100,
			currency: "INR",
			receipt: order.order_number,
		});

		await client
			.from("orders")
			.update({ razorpay_order_id: razorpayOrder.id })
			.eq("id", order.id);

		return {
			id: razorpayOrder.id,
			amount: razorpayOrder.amount,
			currency: razorpayOrder.currency,
			order_id: order.id,
		};
	} catch (razorpayError) {
		console.error("Error creating Razorpay order:", razorpayError);
		throw createError({
			statusCode: 500,
			statusMessage: "Failed to create Razorpay order",
		});
	}
});
