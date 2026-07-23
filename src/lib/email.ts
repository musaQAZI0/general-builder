import nodemailer from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const OWNER_EMAIL = process.env.OWNER_EMAIL || "uzairawan211@gmail.com";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (!EMAIL_USER || !EMAIL_PASS) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
  }
  return transporter;
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const mailer = getTransporter();

  if (!mailer) {
    console.warn("EMAIL_USER / EMAIL_PASS not set; not sending a real email.");
    console.log(`Password reset link for ${to}:\n${resetUrl}\n`);
    return;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background:#111827; color:#f3f4f6; border-radius:12px;">
      <h2 style="color:#f59e0b; margin-top:0;">Reset your password</h2>
      <p>We received a request to reset the password for your Flint LTD account.</p>
      <p>Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
      <p style="text-align:center; margin:32px 0;">
        <a href="${resetUrl}" style="background:#d97706; color:#fff; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:bold;">Set New Password</a>
      </p>
      <p style="font-size:12px; color:#9ca3af;">If the button does not work, copy this link into your browser:<br>${resetUrl}</p>
      <p style="font-size:12px; color:#9ca3af;">If you did not request this, you can safely ignore this email.</p>
    </div>
  `;

  await mailer.sendMail({
    from: `"Flint LTD" <${EMAIL_USER}>`,
    to,
    subject: "Reset your Flint LTD password",
    html,
    text: `Reset your password using this link, which expires in 1 hour: ${resetUrl}`,
  });
}

export interface QuoteNotification {
  email?: string;
  name: string;
  phone: string;
  message: string;
  service?: string;
  postcode?: string;
  propertyType?: string;
  timeline?: string;
  budget?: string;
  preferredContact?: string;
  createdAt: Date;
}

export async function sendQuoteNotificationEmail(quote: QuoteNotification) {
  const serviceLabel = quote.service?.trim() || "General Enquiry";
  const mailer = getTransporter();

  if (!mailer) {
    console.warn("EMAIL_USER / EMAIL_PASS not set; not sending quote emails.");
    console.log(`New quote request (${serviceLabel}) from ${quote.name} / ${quote.phone}:\n${quote.message}\n`);
    if (quote.email) console.log(`Customer confirmation email would be sent to ${quote.email}`);
    return;
  }

  const submittedAt = quote.createdAt.toLocaleString("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background:#111827; color:#f3f4f6; border-radius:12px;">
      <h2 style="color:#f59e0b; margin-top:0;">New Quote Request</h2>
      <p style="color:#9ca3af; margin-top:0;">A customer has requested a quote via the website.</p>
      <table style="width:100%; border-collapse:collapse; margin-top:16px;">
        <tr><td style="padding:8px 0; color:#9ca3af; width:140px;">Service</td><td style="padding:8px 0; font-weight:bold; color:#f59e0b;">${serviceLabel}</td></tr>
        <tr><td style="padding:8px 0; color:#9ca3af;">Name</td><td style="padding:8px 0;">${quote.name}</td></tr>
        <tr><td style="padding:8px 0; color:#9ca3af;">Phone</td><td style="padding:8px 0;">${quote.phone}</td></tr>
        <tr><td style="padding:8px 0; color:#9ca3af;">Email</td><td style="padding:8px 0;">${quote.email || "Not supplied"}</td></tr>
        <tr><td style="padding:8px 0; color:#9ca3af;">Postcode</td><td style="padding:8px 0;">${quote.postcode || "Not supplied"}</td></tr>
        <tr><td style="padding:8px 0; color:#9ca3af;">Property</td><td style="padding:8px 0;">${quote.propertyType || "Not supplied"}</td></tr>
        <tr><td style="padding:8px 0; color:#9ca3af;">Timeline</td><td style="padding:8px 0;">${quote.timeline || "Not supplied"}</td></tr>
        <tr><td style="padding:8px 0; color:#9ca3af;">Budget</td><td style="padding:8px 0;">${quote.budget || "Not supplied"}</td></tr>
        <tr><td style="padding:8px 0; color:#9ca3af;">Preferred contact</td><td style="padding:8px 0;">${quote.preferredContact || "Not supplied"}</td></tr>
        <tr><td style="padding:8px 0; color:#9ca3af; vertical-align:top;">Message</td><td style="padding:8px 0; white-space:pre-wrap;">${quote.message}</td></tr>
        <tr><td style="padding:8px 0; color:#9ca3af;">Submitted</td><td style="padding:8px 0;">${submittedAt}</td></tr>
      </table>
    </div>
  `;

  const text = [
    `New Quote Request - ${serviceLabel}`,
    "",
    `Service:   ${serviceLabel}`,
    `Name:      ${quote.name}`,
    `Phone:     ${quote.phone}`,
    `Email:     ${quote.email || "Not supplied"}`,
    `Postcode:  ${quote.postcode || "Not supplied"}`,
    `Property:  ${quote.propertyType || "Not supplied"}`,
    `Timeline:  ${quote.timeline || "Not supplied"}`,
    `Budget:    ${quote.budget || "Not supplied"}`,
    `Contact:   ${quote.preferredContact || "Not supplied"}`,
    `Message:   ${quote.message}`,
    `Submitted: ${submittedAt}`,
  ].join("\n");

  await mailer.sendMail({
    from: `"Flint LTD Website" <${EMAIL_USER}>`,
    to: OWNER_EMAIL,
    replyTo: quote.email || EMAIL_USER,
    subject: `New Quote Request - ${serviceLabel}`,
    html,
    text,
  });

  if (quote.email) {
    await mailer.sendMail({
      from: `"Flint LTD" <${EMAIL_USER}>`,
      to: quote.email,
      subject: "We received your Flint LTD project request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; background:#f7f3e9; color:#18372f;">
          <h2 style="margin-top:0;">Project request received</h2>
          <p>Thanks ${quote.name}. We have received your ${serviceLabel.toLowerCase()} request and will review the details before getting in touch.</p>
          <p><strong>Typical reply:</strong> within 24 hours.</p>
          <p><strong>Project postcode:</strong> ${quote.postcode || "Not supplied"}</p>
          <p><strong>Preferred contact:</strong> ${quote.preferredContact || "Not supplied"}</p>
        </div>
      `,
      text: `Thanks ${quote.name}. We received your ${serviceLabel} request and will usually reply within 24 hours.`,
    });
  }
}
