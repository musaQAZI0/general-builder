import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { signupSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Server-side validation (never trust the client).
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { email, phone, password } = parsed.data;

    await connectToDatabase();

    // Check for duplicate email.
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash the password before storing.
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 }
    );
  } catch (err) {
    // Handle a race-condition duplicate (unique index) gracefully.
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code?: number }).code === 11000
    ) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
