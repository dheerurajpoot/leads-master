import mongoose from "mongoose";

const pushSubscriptionSchema = new mongoose.Schema({
	subscription: {
		endpoint: String,
		keys: {
			p256dh: String,
			auth: String,
		},
	},
	createdAt: { type: Date, default: Date.now },
	active: { type: Boolean, default: true },
});

export const PushSubscription =
	mongoose.models.PushSubscription ||
	mongoose.model("PushSubscription", pushSubscriptionSchema);
