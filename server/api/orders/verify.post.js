import { serverSupabaseClient } from "#supabase/server";
import crypto from "crypto";

// --- Shiprocket Authentication ---
const config = useRuntimeConfig();
async function getShiprocketToken() {
	const response = await fetch(
		"https://apiv2.shiprocket.in/v1/external/auth/login",
		{
			method: "POST",
			body: JSON.stringify({
				email: config.shiprocketEmail,
				password: config.shiprocketPass,
			}),
		}
	);
	const data = await response.json();
	if (!response.ok) {
		console.error("Shiprocket Auth Error:", data);
		return null;
	}
	return data.token;
}

// --- Shiprocket Order Creation ---
async function createShiprocketOrder(token, orderDetails) {
	const response = await fetch(
		"https://apiv2.shiprocket.in/v1/external/orders/create/add",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(orderDetails),
		}
	);
	const data = await response.json();
	if (!response.ok || data.status_code !== 200) {
		console.error("Shiprocket Order Creation Error:", data);
		return null;
	}
	console.log("Shiprocket Order Created Successfully:", data);
	return data;
}

export default defineEventHandler(async (event) => {
	const client = await serverSupabaseClient(event);
	const body = await readBody(event);

	const {
		razorpay_order_id,
		razorpay_payment_id,
		razorpay_signature,
		items,
		shiprocketPayload,
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

	if (updateError) {
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
		console.error("Error saving order items:", itemsError);
		// You might want to handle this error, but for now, we'll just log it.
	}

	// --- 4. Create Shiprocket Shipment ---
	const token = await getShiprocketToken();
	if (token) {
		const shiprocketOrderPayload = {
			order_id: updatedOrder.order_number,
			order_date: new Date().toISOString().split("T")[0],
			pickup_location: "Primary", // Your primary pickup location name in Shiprocket
			billing_customer_name: shiprocketPayload.contact.firstName,
			billing_last_name: shiprocketPayload.contact.lastName, // Shiprocket requires a last name
			billing_address: shiprocketPayload.shipping.street,
			billing_city: shiprocketPayload.shipping.city, // You'll need to parse this from the address
			billing_pincode: shiprocketPayload.shipping.zip, // You'll need to parse this
			billing_state: shiprocketPayload.shipping.state, // You'll need to parse this
			billing_country: shiprocketPayload.shipping.country,
			billing_email: updatedOrder.customer_email,
			billing_phone: updatedOrder.customer_phone,
			shipping_is_billing: true, // Assuming shipping and billing addresses are the same
			order_items: items.map((item) => ({
				name: item.name,
				sku: item.slug, // Using product slug as SKU
				units: item.quantity,
				selling_price: item.price,
			})),
			payment_method: "Prepaid",
			sub_total: updatedOrder.total_amount,
			length: 10, // Default dimensions
			breadth: 10,
			height: 10,
			weight: 0.5, // Default weight
		};

		await createShiprocketOrder(token, shiprocketOrderPayload);
	}

	return { success: true, orderId: razorpay_order_id };
});
