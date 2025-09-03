self.addEventListener("push", function (event) {
	if (event.data) {
		const data = event.data.json();
		const options = {
			body: data.message,
			icon: "/favicon.ico",
			badge: "/favicon.ico",
			tag: "lead-notification",
			requireInteraction: true,
			actions: [
				{
					action: "view",
					title: "View Leads",
				},
				{
					action: "dismiss",
					title: "Dismiss",
				},
			],
		};

		event.waitUntil(
			self.registration.showNotification("New Lead Submitted", options)
		);
	}
});

self.addEventListener("notificationclick", function (event) {
	event.notification.close();

	if (event.action === "view") {
		event.waitUntil(clients.openWindow("/admin"));
	}
});

self.addEventListener("install", function (event) {
	self.skipWaiting();
});

self.addEventListener("activate", function (event) {
	event.waitUntil(self.clients.claim());
});
