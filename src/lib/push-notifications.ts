export class PushNotificationService {
	private static instance: PushNotificationService;
	private swRegistration: ServiceWorkerRegistration | null = null;

	private constructor() {}

	static getInstance(): PushNotificationService {
		if (!PushNotificationService.instance) {
			PushNotificationService.instance = new PushNotificationService();
		}
		return PushNotificationService.instance;
	}

	async initialize(): Promise<boolean> {
		if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
			console.log("Push notifications not supported");
			return false;
		}

		try {
			this.swRegistration = await navigator.serviceWorker.register(
				"/sw.js"
			);
			console.log("Service Worker registered");
			return true;
		} catch (error) {
			console.error("Service Worker registration failed:", error);
			return false;
		}
	}

	async requestPermission(): Promise<boolean> {
		if (!("Notification" in window)) {
			console.log("Notifications not supported");
			return false;
		}

		const permission = await Notification.requestPermission();
		return permission === "granted";
	}

	async subscribeToPush(): Promise<string | null> {
		if (!this.swRegistration) {
			const initialized = await this.initialize();
			if (!initialized) return null;
		}

		const permissionGranted = await this.requestPermission();
		if (!permissionGranted) {
			console.log("Notification permission denied");
			return null;
		}

		try {
			const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
			if (!vapidPublicKey) {
				console.error("VAPID public key not found");
				return null;
			}

			const subscription =
				await this.swRegistration!.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey:
						this.urlBase64ToUint8Array(vapidPublicKey),
				});

			return JSON.stringify(subscription);
		} catch (error) {
			console.error("Failed to subscribe to push notifications:", error);
			return null;
		}
	}

	async unsubscribeFromPush(): Promise<boolean> {
		if (!this.swRegistration) return false;

		try {
			const subscription =
				await this.swRegistration.pushManager.getSubscription();
			if (subscription) {
				await subscription.unsubscribe();
				return true;
			}
			return false;
		} catch (error) {
			console.error(
				"Failed to unsubscribe from push notifications:",
				error
			);
			return false;
		}
	}

	private urlBase64ToUint8Array(base64String: string): ArrayBuffer {
		const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
		const base64 = (base64String + padding)
			.replace(/-/g, "+")
			.replace(/_/g, "/");

		const rawData = window.atob(base64);
		const outputArray = new Uint8Array(rawData.length);

		for (let i = 0; i < rawData.length; ++i) {
			outputArray[i] = rawData.charCodeAt(i);
		}
		return outputArray.buffer;
	}
}

export const pushNotificationService = PushNotificationService.getInstance();
