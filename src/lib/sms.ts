import axios from "axios";

export interface LeadData {
	name: string;
	phone: string;
	loanAmount: number;
}

export async function sendSMSNotification(lead: LeadData) {
	try {
		const authorization = process.env.FAST2SMS_AUTHORIZATION;
		const senderId = process.env.FAST2SMS_SENDER_ID;
		const messageId = process.env.FAST2SMS_MESSAGE_ID;

		if (!authorization) {
			console.warn(
				"FAST2SMS_AUTHORIZATION not configured, skipping SMS notification"
			);
			return;
		}

		// Format the phone number (remove any non-digit characters except +)
		const phoneNumber = lead.phone.replace(/[^\d+]/g, "");

		// For Fast2SMS, phone number should be without + and country code
		// Remove + and ensure it's 10 digits for Indian numbers
		let formattedPhone = phoneNumber
			.replace(/^\+91/, "")
			.replace(/^91/, "");

		// Ensure it's exactly 10 digits
		if (formattedPhone.length === 10) {
			formattedPhone = formattedPhone;
		} else if (formattedPhone.length > 10) {
			formattedPhone = formattedPhone.slice(-10);
		} else {
			console.error("Invalid phone number format:", lead.phone);
			return;
		}

		// const loanType = "Business";

		// Prepare variables for the template
		const variablesValues = `${lead.name}:Business`;

		const requestBody = {
			route: "dlt",
			sender_id: senderId,
			message: messageId,
			variables_values: variablesValues,
			numbers: formattedPhone,
			flash: 0,
		};

		const response = await axios.post(
			"https://www.fast2sms.com/dev/bulkV2",
			requestBody,
			{
				headers: {
					authorization,
					"Content-Type": "application/json",
				},
				timeout: 10000, // 10 second timeout
			}
		);

		if (response.data.return === true) {
			console.log("SMS sent successfully:", response.data);
		} else {
			console.error("SMS failed:", response.data);
		}

		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("SMS API Error:", {
				status: error.response?.status,
				statusText: error.response?.statusText,
				data: error.response?.data,
				message: error.message,
			});
		} else {
			console.error("Failed to send SMS notification:", error);
		}
		// Don't throw error to prevent breaking the main flow
	}
}
