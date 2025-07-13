import { serverSupabaseClient } from "#supabase/server";

// --- Shiprocket Authentication ---
async function getShiprocketToken() {
	try {
		const response = await fetch(
			"https://apiv2.shiprocket.in/v1/external/auth/login",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: process.env.SHIPROCKET_EMAIL,
					password: process.env.SHIPROCKET_PASSWORD,
				}),
			}
		);
		const data = await response.json();
		if (!response.ok) {
			console.error("Shiprocket Auth Error:", data);
			return null;
		}
		return data.token;
	} catch (error) {
		console.error("Network error during Shiprocket auth:", error);
		return null;
	}
}

// --- Shiprocket Order Creation ---
async function createShiprocketOrder(token, orderDetails) {
	try {
		const response = await fetch(
			"https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
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

		// CORRECTED LOGIC: Check for a successful HTTP status AND the presence of a shipment_id.
		if (!response.ok || !data.shipment_id) {
			console.error("Shiprocket Order Creation Error:", data);
			return null;
		}

		console.log("✅ Shiprocket Order Created Successfully:", data);
		return data;
	} catch (error) {
		console.error("Network error during Shiprocket order creation:", error);
		return null;
	}
}

export default defineEventHandler(async (event) => {
	const client = await serverSupabaseClient(event);
	const { orderId, items, shiprocketPayload } = await readBody(event);

	if (!orderId) {
		throw createError({
			statusCode: 400,
			statusMessage: "Missing orderId",
		});
	}

	// --- 1. Fetch the complete, verified order from YOUR database ---
	const { data: order, error: orderError } = await client
		.from("orders")
		.select("*, order_items(*)")
		.eq("id", orderId)
		.eq("payment_status", "paid")
		.single();

	if (orderError || !order) {
		console.error("Error fetching order for shipment:", orderError);
		throw createError({
			statusCode: 404,
			statusMessage: "Verified order not found.",
		});
	}

	// --- 2. Create the Shiprocket Shipment ---
	const token = await getShiprocketToken();
	if (token) {
		const shiprocketOrderPayload = {
			order_id: order.order_number,
			order_date: new Date().toISOString().split("T")[0],
			pickup_location: "warehouse", // Your primary pickup location name in Shiprocket
			billing_customer_name: shiprocketPayload.contact.firstName,
			billing_last_name: shiprocketPayload.contact.lastName,
			billing_address: shiprocketPayload.shipping.street,
			billing_city: shiprocketPayload.shipping.city,
			billing_pincode: shiprocketPayload.shipping.zip,
			billing_state: shiprocketPayload.shipping.state,
			billing_country: shiprocketPayload.shipping.country,
			billing_email: shiprocketPayload.contact.email,
			billing_phone: shiprocketPayload.contact.phone,
			shipping_is_billing: true, // Assuming shipping and billing addresses are the same
			order_items: items.map((item) => ({
				name: item.name,
				sku: item.slug, // Using product slug as SKU
				units: item.quantity,
				selling_price: item.price,
			})),
			payment_method: "Prepaid",
			sub_total: order.total_amount,
			length: 10, // Default dimensions
			breadth: 10,
			height: 10,
			weight: 0.5, // Default weight
		};

		const shiprocketResult = await createShiprocketOrder(
			token,
			shiprocketOrderPayload
		);

		if (shiprocketResult) {
			await client
				.from("orders")
				.update({
					shiprocket_order_id: shiprocketResult.order_id,
					// Note: Shiprocket API uses 'shipment_id' in the response
					shiprocket_shipment_id: shiprocketResult.shipment_id,
				})
				.eq("id", order.id);

			return {
				success: true,
				message: "Shipment created successfully.",
				shiprocketData: shiprocketResult,
			};
		} else {
			throw createError({
				statusCode: 500,
				statusMessage: "Failed to create shipment in Shiprocket.",
			});
		}
	} else {
		throw createError({
			statusCode: 500,
			statusMessage: "Failed to authenticate with Shiprocket.",
		});
	}
});
