import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { forgotPasswordSchema } from "@/lib/validation";
import { sendPasswordResetEmail } from "@/lib/email";

// Generic response — we never reveal whether an email is registered.
const GENERIC_MESSAGE =
  "If an account exists for that email, a password reset link has been sent.";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();

    await connectToDatabase();
    const user = await User.findOne({ email });

    if (user) {
      // Create a high-entropy raw token for the URL, store only its hash.
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

      user.resetPasswordToken = tokenHash;
      user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await user.save();

      const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
      const resetUrl = `${baseUrl}/reset-password?token=${rawToken}`;

      // If email sending fails, don't leak that — just log it server-side.
      try {
        await sendPasswordResetEmail(user.email, resetUrl);
      } catch (mailErr) {
        console.error("Failed to send reset email:", mailErr);
      }
    }

    return NextResponse.json({ message: GENERIC_MESSAGE }, { status: 200 });
  } catch (err) {
    console.error("Forgot-password error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
