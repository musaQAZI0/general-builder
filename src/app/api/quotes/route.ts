import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdminEmail } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Quote from "@/models/Quote";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const filter = isAdminEmail(session.user.email)
    ? {}
    : { userEmail: session.user.email.toLowerCase() };

  const quotes = await Quote.find(filter)
    .sort({ createdAt: -1 })
    .select("userEmail name phone service message postcode propertyType timeline budget preferredContact status adminNotes createdAt updatedAt")
    .lean();

  return NextResponse.json({ quotes });
}
