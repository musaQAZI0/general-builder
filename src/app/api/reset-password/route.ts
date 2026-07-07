import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { resetPasswordSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { token, password } = parsed.data;

    // Hash the incoming raw token and match it against the stored hash.
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    await connectToDatabase();

    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "This reset link is invalid or has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Set the new password and invalidate the token.
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null as unknown as undefined;
    user.resetPasswordExpires = null as unknown as undefined;
    await user.save();

    return NextResponse.json(
      { message: "Your password has been reset. You can now log in." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Reset-password error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
