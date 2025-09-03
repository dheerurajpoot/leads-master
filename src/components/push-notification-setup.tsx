"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, BellOff } from "lucide-react";
import { pushNotificationService } from "@/lib/push-notifications";

export default function PushNotificationSetup() {
	const [isSubscribed, setIsSubscribed] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isSupported, setIsSupported] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Check if push notifications are supported
		const supported =
			"serviceWorker" in navigator &&
			"PushManager" in window &&
			"Notification" in window;
		setIsSupported(supported);

		if (supported) {
			// Check current subscription status
			checkSubscriptionStatus();
		}
	}, []);

	const checkSubscriptionStatus = async () => {
		try {
			// Initialize service worker first
			await pushNotificationService.initialize();

			const registration =
				await navigator.serviceWorker.getRegistration();
			if (registration) {
				const subscription =
					await registration.pushManager.getSubscription();
				setIsSubscribed(!!subscription);
			}
		} catch (error) {
			console.error("Error checking subscription status:", error);
		}
	};

	const handleSubscribe = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const subscription =
				await pushNotificationService.subscribeToPush();

			if (subscription) {
				// Store subscription in database
				const response = await fetch("/api/push-subscriptions", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ subscription }),
				});

				if (response.ok) {
					setIsSubscribed(true);
					console.log(
						"Successfully subscribed to push notifications"
					);
				} else {
					const errorData = await response.json();
					setError(errorData.error || "Failed to store subscription");
				}
			} else {
				setError(
					"Failed to create push subscription. Please check your browser permissions."
				);
			}
		} catch (error) {
			console.error("Error subscribing to push notifications:", error);
			setError("An error occurred while subscribing to notifications");
		} finally {
			setIsLoading(false);
		}
	};

	const handleUnsubscribe = async () => {
		setIsLoading(true);
		setError(null);
		try {
			// Get current subscription before unsubscribing
			const registration =
				await navigator.serviceWorker.getRegistration();
			let currentSubscription = null;

			if (registration) {
				currentSubscription =
					await registration.pushManager.getSubscription();
			}

			// Unsubscribe from push manager
			const success = await pushNotificationService.unsubscribeFromPush();

			if (success && currentSubscription) {
				// Remove subscription from database
				const response = await fetch("/api/push-subscriptions", {
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						subscription: JSON.stringify(currentSubscription),
					}),
				});

				if (response.ok) {
					setIsSubscribed(false);
					console.log(
						"Successfully unsubscribed from push notifications"
					);
				} else {
					const errorData = await response.json();
					setError(
						errorData.error || "Failed to remove subscription"
					);
				}
			} else {
				setIsSubscribed(false);
			}
		} catch (error) {
			console.error(
				"Error unsubscribing from push notifications:",
				error
			);
			setError(
				"An error occurred while unsubscribing from notifications"
			);
		} finally {
			setIsLoading(false);
		}
	};

	if (!isSupported) {
		return (
			<Card className='border border-gray-200'>
				<CardContent className='p-4'>
					<div className='flex items-center gap-2 text-gray-600'>
						<BellOff className='h-4 w-4' />
						<span className='text-sm'>
							Push notifications not supported in this browser
						</span>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className='border border-gray-200'>
			<CardHeader>
				<CardTitle className='text-lg flex items-center gap-2'>
					<Bell className='h-5 w-5' />
					Browser Notifications
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-3'>
					<p className='text-sm text-gray-600'>
						{isSubscribed
							? "You'll receive browser notifications for new leads even when the page is closed."
							: "Enable browser notifications to get alerts for new leads when you're not on this page."}
					</p>

					<Button
						onClick={
							isSubscribed ? handleUnsubscribe : handleSubscribe
						}
						disabled={isLoading}
						variant={isSubscribed ? "outline" : "default"}
						className={
							isSubscribed
								? "text-red-600 border-red-600 hover:bg-red-50"
								: ""
						}>
						{isLoading ? (
							"Loading..."
						) : isSubscribed ? (
							<>
								<BellOff className='h-4 w-4 mr-2' />
								Disable Notifications
							</>
						) : (
							<>
								<Bell className='h-4 w-4 mr-2' />
								Enable Notifications
							</>
						)}
					</Button>

					{error && (
						<div className='text-sm text-red-600 bg-red-50 p-3 rounded-md'>
							{error}
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
