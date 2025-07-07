import { serverSupabaseClient } from "#supabase/server";
import Razorpay from "razorpay";

export default defineEventHandler(async (event) => {
	const client = await serverSupabaseClient(event);
	const {
		customer_name,
		customer_phone,
		customer_email,
		shipping_address,
		total_amount,
	} = await readBody(event);

	const { data: order, error: orderError } = await client
		.from("orders")
		.insert([
			{
				order_number: `ORD-${Date.now()}`,
				customer_name,
				customer_phone,
				customer_email,
				shipping_address,
				payment_status: "pending",
				total_amount,
			},
		])
		.select()
		.single();

	if (orderError) {
		console.error("Error creating order:", orderError);
		return { error: "Failed to create order" };
	}

	const razorpay = new Razorpay({
		key_id: process.env.RAZORPAY_KEY,
		key_secret: process.env.RAZORPAY_SECRET,
	});

	const razorpayOrder = await razorpay.orders.create({
		amount: total_amount * 100,
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
});
