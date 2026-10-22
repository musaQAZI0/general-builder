import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Quote from "@/models/Quote";
import { quoteSchema } from "@/lib/validation";
import { sendQuoteNotificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    const parsed = quoteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { name, phone, email, message, service, postcode, propertyType, timeline, budget, preferredContact, website } = parsed.data;

    // A hidden field catches basic bot submissions without adding friction for visitors.
    if (website) {
      return NextResponse.json({ message: "Your quote request has been received." }, { status: 201 });
    }

    await connectToDatabase();

    const quote = await Quote.create({
      userEmail: session?.user?.email,
      contactEmail: email || session?.user?.email,
      name,
      phone,
      message,
      service,
      postcode,
      propertyType,
      timeline,
      budget,
      preferredContact,
    });

    // Notify the business owner. Wrapped in try/catch so a mail failure never
    // blocks the (already successful) save or the user's success response.
    try {
      await sendQuoteNotificationEmail({
        name: quote.name,
        phone: quote.phone,
        message: quote.message,
        service: quote.service,
        email: quote.contactEmail,
        postcode: quote.postcode,
        propertyType: quote.propertyType,
        timeline: quote.timeline,
        budget: quote.budget,
        preferredContact: quote.preferredContact,
        createdAt: quote.createdAt,
      });
    } catch (mailErr) {
      console.error("Quote notification email failed (quote still saved):", mailErr);
    }

    return NextResponse.json(
      { message: "Your quote request has been received. We'll be in touch soon!" },
      { status: 201 }
    );
  } catch (err) {
    console.error("Contact/quote error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
