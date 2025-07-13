import { serverSupabaseClient } from "#supabase/server";
import crypto from "crypto";

export default defineEventHandler(async (event) => {
	const client = await serverSupabaseClient(event);
	const config = useRuntimeConfig();
	const body = await readBody(event);

	const {
		razorpay_order_id,
		razorpay_payment_id,
		razorpay_signature,
		items,
	} = body;

	// --- 1. Signature Verification ---
	const generated_signature = crypto
		.createHmac("sha256", process.env.RAZORPAY_SECRET)
		.update(razorpay_order_id + "|" + razorpay_payment_id)
		.digest("hex");

	if (generated_signature !== razorpay_signature) {
		throw createError({
			statusCode: 400,
			statusMessage: "Payment verification failed: Invalid signature.",
		});
	}

	// --- 2. Update Order Status in Supabase ---
	const { data: updatedOrder, error: updateError } = await client
		.from("orders")
		.update({
			payment_status: "paid",
			razorpay_payment_id: razorpay_payment_id,
		})
		.eq("razorpay_order_id", razorpay_order_id)
		.select()
		.single();

	if (updateError || !updatedOrder) {
		throw createError({
			statusCode: 500,
			statusMessage:
				"Payment verified but failed to update order status.",
		});
	}

	// --- 3. Save Order Items ---
	const orderItems = items.map((item) => ({
		order_id: updatedOrder.id,
		product_id: item.id,
		product_name: item.name,
		price: item.price,
		quantity: item.quantity,
	}));

	const { error: itemsError } = await client
		.from("order_items")
		.insert(orderItems);
	if (itemsError) {
		console.error(
			"Critical Error: Payment verified but failed to save order items:",
			itemsError
		);
		// In a real-world scenario, you would have a retry mechanism or alert system here.
	}

	// --- 4. Return Success to Frontend ---
	// The frontend now knows the payment is good and can proceed to the next step.
	return {
		success: true,
		orderId: updatedOrder.id, // Return your internal DB order ID
		message: "Payment verified and order saved.",
	};
});
