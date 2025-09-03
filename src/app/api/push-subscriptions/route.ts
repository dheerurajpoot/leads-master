import { connectDb } from "@/lib/database";
import { NextRequest } from "next/server";
import { PushSubscription } from "@/lib/models/push-subscription";

export async function POST(request: NextRequest) {
	try {
		const { subscription } = await request.json();

		if (!subscription) {
			return Response.json(
				{ error: "Subscription data required" },
				{ status: 400 }
			);
		}

		await connectDb();

		// Store subscription with timestamp
		await PushSubscription.create({
			subscription: JSON.parse(subscription),
			active: true,
		});

		return Response.json({ success: true });
	} catch (error) {
		console.error("Error storing push subscription:", error);
		return Response.json(
			{ error: "Failed to store subscription" },
			{ status: 500 }
		);
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const { subscription } = await request.json();

		if (!subscription) {
			return Response.json(
				{ error: "Subscription data required" },
				{ status: 400 }
			);
		}

		await connectDb();

		// Remove subscription
		await PushSubscription.deleteOne({
			subscription: JSON.parse(subscription),
		});

		return Response.json({ success: true });
	} catch (error) {
		console.error("Error removing push subscription:", error);
		return Response.json(
			{ error: "Failed to remove subscription" },
			{ status: 500 }
		);
	}
}
