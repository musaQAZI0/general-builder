import nodemailer from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// Business owner's inbox that receives new-quote notifications.
const OWNER_EMAIL = process.env.OWNER_EMAIL || "uzairawan211@gmail.com";

/**
 * Shared Gmail SMTP transporter, created once and reused by every mail helper.
 * Returns null when credentials aren't configured (dev fallback -> console log).
 */
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (!EMAIL_USER || !EMAIL_PASS) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS, // Gmail App Password (not your normal password)
      },
    });
  }
  return transporter;
}

/**
 * Sends a password-reset email via Gmail SMTP.
 *
 * If EMAIL_USER / EMAIL_PASS are not configured yet, we fall back to logging
 * the reset link to the server console so the flow is still testable locally.
 */
export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const mailer = getTransporter();

  // Fallback: no SMTP credentials configured -> log to console.
  if (!mailer) {
    console.warn(
      "\n⚠️  EMAIL_USER / EMAIL_PASS not set — not sending a real email."
    );
    console.log(`🔑 Password reset link for ${to}:\n${resetUrl}\n`);
    return;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background:#111827; color:#f3f4f6; border-radius:12px;">
      <h2 style="color:#f59e0b; margin-top:0;">Reset your password</h2>
      <p>We received a request to reset the password for your General Builder account.</p>
      <p>Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
      <p style="text-align:center; margin:32px 0;">
        <a href="${resetUrl}" style="background:#d97706; color:#fff; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:bold;">Set New Password</a>
      </p>
      <p style="font-size:12px; color:#9ca3af;">If the button doesn't work, copy this link into your browser:<br>${resetUrl}</p>
      <p style="font-size:12px; color:#9ca3af;">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;

  await transporter!.sendMail({
    from: `"General Builder" <${EMAIL_USER}>`,
    to,
    subject: "Reset your General Builder password",
    html,
    text: `Reset your password using this link (expires in 1 hour): ${resetUrl}`,
  });

  console.log(`📧 Password reset email sent to ${to}`);
}

export interface QuoteNotification {
  name: string;
  phone: string;
  message: string;
  service?: string;
  createdAt: Date;
}

/**
 * Notifies the business owner of a new quote request via Gmail SMTP
 * (reuses the same shared transporter as the password-reset email).
 *
 * Throws if sending fails — the caller is expected to catch and swallow the
 * error so an email failure never blocks saving the quote to the database.
 */
export async function sendQuoteNotificationEmail(quote: QuoteNotification) {
  const serviceLabel = quote.service?.trim() || "General Enquiry";
  const mailer = getTransporter();

  // Fallback: no SMTP credentials configured -> log to console.
  if (!mailer) {
    console.warn(
      "\n⚠️  EMAIL_USER / EMAIL_PASS not set — not sending the quote notification email."
    );
    console.log(
      `📨 New quote request (${serviceLabel}) from ${quote.name} / ${quote.phone}:\n${quote.message}\n`
    );
    return;
  }

  const submittedAt = quote.createdAt.toLocaleString("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; background:#111827; color:#f3f4f6; border-radius:12px;">
      <h2 style="color:#f59e0b; margin-top:0;">New Quote Request</h2>
      <p style="color:#9ca3af; margin-top:0;">A customer has requested a quote via the website.</p>
      <table style="width:100%; border-collapse:collapse; margin-top:16px;">
        <tr><td style="padding:8px 0; color:#9ca3af; width:120px;">Service</td><td style="padding:8px 0; font-weight:bold; color:#f59e0b;">${serviceLabel}</td></tr>
        <tr><td style="padding:8px 0; color:#9ca3af;">Name</td><td style="padding:8px 0;">${quote.name}</td></tr>
        <tr><td style="padding:8px 0; color:#9ca3af;">Phone</td><td style="padding:8px 0;"><a href="tel:${quote.phone}" style="color:#f3f4f6;">${quote.phone}</a></td></tr>
        <tr><td style="padding:8px 0; color:#9ca3af; vertical-align:top;">Message</td><td style="padding:8px 0; white-space:pre-wrap;">${quote.message}</td></tr>
        <tr><td style="padding:8px 0; color:#9ca3af;">Submitted</td><td style="padding:8px 0;">${submittedAt}</td></tr>
      </table>
    </div>
  `;

  const text = [
    `New Quote Request - ${serviceLabel}`,
    ``,
    `Service:   ${serviceLabel}`,
    `Name:      ${quote.name}`,
    `Phone:     ${quote.phone}`,
    `Message:   ${quote.message}`,
    `Submitted: ${submittedAt}`,
  ].join("\n");

  await transporter!.sendMail({
    from: `"General Builder Website" <${EMAIL_USER}>`,
    to: OWNER_EMAIL,
    replyTo: EMAIL_USER,
    subject: `New Quote Request - ${serviceLabel}`,
    html,
    text,
  });

  console.log(`📧 Quote notification email sent to ${OWNER_EMAIL}`);
}
