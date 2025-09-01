import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST || "smtp.gmail.com",
	port: Number.parseInt(process.env.SMTP_PORT || "587"),
	secure: false,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

export async function sendEmail({
	to,
	subject,
	html,
}: {
	to: string;
	subject: string;
	html: string;
}) {
	try {
		await transporter.sendMail({
			from: process.env.SMTP_FROM,
			to,
			subject,
			html,
		});
		return { success: true };
	} catch (error) {
		console.error("Email sending error:", error);
		return { success: false, error };
	}
}

export function generateAdminEmail(
	name: string,
	email: string,
	phone: string,
	city: string,
	loanAmount: string
): string {
	return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Lead - Mudra Loans</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #059669, #0d9488); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">Mudra Loan</h1>
          <p style="color: #e6fffa; margin: 10px 0 0 0;">New Lead Received!</p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 0 0 10px 10px;">                
          <div style="background: white; border: 2px solid #059669; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <p style="margin: 0; color: #059669; font-size: 16px;">Name: ${name}</p>
            <p style="margin: 0; color: #059669; font-size: 16px;">Email: ${email}</p>
            <p style="margin: 0; color: #059669; font-size: 16px;">Phone: ${phone}</p>
            <p style="margin: 0; color: #059669; font-size: 16px;">City: ${city}</p>
            <p style="margin: 0; color: #059669; font-size: 16px;">Loan Amount: ${loanAmount}</p>
          </div>
        
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #64748b;">
            Best regards,<br>
            The Mudra Loans Team
          </p>
        </div>
      </body>
      </html>
    `;
}

export function generateLeadEmail(name: string): string {
	return `
		Hey ${name},
		Your application for Mudra Loan has been received.
		We will contact you shortly.
	`;
}
