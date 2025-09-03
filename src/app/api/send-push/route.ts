import { connectDb } from "@/lib/database";
import { NextRequest } from "next/server";
import webpush from "web-push";
import { PushSubscription } from "@/lib/models/push-subscription";

// Configure web-push with VAPID keys
webpush.setVapidDetails(
	`mailto:${process.env.VAPID_EMAIL || "admin@example.com"}`,
	process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
	process.env.VAPID_PRIVATE_KEY || ""
);

export async function POST(request: NextRequest) {
	try {
		const { message } = await request.json();

		if (!message) {
			return Response.json(
				{ error: "Message required" },
				{ status: 400 }
			);
		}

		await connectDb();

		// Get all active subscriptions
		const subscriptions = await PushSubscription.find({ active: true });

		if (subscriptions.length === 0) {
			return Response.json({
				success: true,
				message: "No active subscriptions",
			});
		}

		const pushPromises = subscriptions.map(async (doc) => {
			try {
				await webpush.sendNotification(
					doc.subscription,
					JSON.stringify({
						message,
						timestamp: new Date().toISOString(),
					})
				);
				return { success: true, subscription: doc.subscription };
			} catch (error: any) {
				console.error("Push notification failed:", error);

				// If subscription is invalid, mark it as inactive
				if (error.statusCode === 410) {
					await PushSubscription.findByIdAndUpdate(doc._id, {
						active: false,
					});
				}

				return { success: false, error: error.message };
			}
		});

		const results = await Promise.allSettled(pushPromises);
		const successful = results.filter(
			(result) => result.status === "fulfilled" && result.value.success
		).length;

		return Response.json({
			success: true,
			message: `Sent to ${successful}/${subscriptions.length} subscribers`,
		});
	} catch (error) {
		console.error("Error sending push notifications:", error);
		return Response.json(
			{ error: "Failed to send notifications" },
			{ status: 500 }
		);
	}
}
