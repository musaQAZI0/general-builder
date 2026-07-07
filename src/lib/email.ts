import nodemailer from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

/**
 * Sends a password-reset email via Gmail SMTP.
 *
 * If EMAIL_USER / EMAIL_PASS are not configured yet, we fall back to logging
 * the reset link to the server console so the flow is still testable locally.
 */
export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  // Fallback: no SMTP credentials configured -> log to console.
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn(
      "\n⚠️  EMAIL_USER / EMAIL_PASS not set — not sending a real email."
    );
    console.log(`🔑 Password reset link for ${to}:\n${resetUrl}\n`);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS, // Gmail App Password (not your normal password)
    },
  });

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

  await transporter.sendMail({
    from: `"General Builder" <${EMAIL_USER}>`,
    to,
    subject: "Reset your General Builder password",
    html,
    text: `Reset your password using this link (expires in 1 hour): ${resetUrl}`,
  });

  console.log(`📧 Password reset email sent to ${to}`);
}
