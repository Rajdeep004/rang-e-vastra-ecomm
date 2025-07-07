import { serverSupabaseClient } from "#supabase/server";
import Razorpay from "razorpay";

export default defineEventHandler(async (event) => {
	const client = await serverSupabaseClient(event);
	const { orderId, paymentId, signature } = await readBody(event);

	const razorpay = new Razorpay({
		key_id: process.env.RAZORPAY_KEY,
		key_secret: process.env.RAZORPAY_SECRET,
	});

	try {
		razorpay.utility.verifyPaymentSignature({
			razorpay_order_id: orderId,
			razorpay_payment_id: paymentId,
			razorpay_signature: signature,
		});

		await client
			.from("orders")
			.update({ payment_status: "paid" })
			.eq("razorpay_order_id", orderId);

		return { success: true };
	} catch (error) {
		console.error("Signature verification failed:", error);
		return { success: false, message: error.message };
	}
});
