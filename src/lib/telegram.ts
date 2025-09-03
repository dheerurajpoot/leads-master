import TelegramBot from "node-telegram-bot-api";

// Initialize bot with token
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, {
	polling: false,
});

export interface LeadData {
	name: string;
	email: string;
	phone: string;
	city: string;
	loanAmount?: number | null;
}

export async function sendTelegramNotification(lead: LeadData) {
	try {
		const chatId = process.env.TELEGRAM_CHAT_ID;

		if (!chatId) {
			console.warn(
				"TELEGRAM_CHAT_ID not configured, skipping Telegram notification"
			);
			return;
		}

		const message = formatLeadMessage(lead);

		await bot.sendMessage(chatId, message, {
			parse_mode: "HTML",
			disable_web_page_preview: true,
		});
	} catch (error) {
		console.error("Failed to send Telegram notification:", error);
	}
}

function formatLeadMessage(lead: LeadData): string {
	const emoji = "🆕";
	const loanAmountText = lead.loanAmount
		? `<b>Loan Amount:</b> ₹${lead.loanAmount.toLocaleString()}`
		: "<b>Loan Amount:</b> Not specified";

	const cityText = lead.city
		? `<b>City:</b> ${lead.city}`
		: "<b>City:</b> Not specified";

	return `${emoji} <b>NEW LEAD RECEIVED!</b>

<b>Name:</b> ${lead.name}
<b>Email:</b> ${lead.email}
<b>Phone:</b> ${lead.phone}
${cityText}
${loanAmountText}
<b>Time:</b> ${new Date().toLocaleString("en-IN", {
		timeZone: "Asia/Kolkata",
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	})}

<b>Admin Panel: https://leads.evtn.org/admin</b>`;
}
