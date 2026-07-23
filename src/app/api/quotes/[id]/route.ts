import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdminEmail } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Quote from "@/models/Quote";
import { quoteStatusSchema } from "@/lib/validation";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = quoteStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  await connectToDatabase();

  const quote = await Quote.findByIdAndUpdate(
    params.id,
    {
      status: parsed.data.status,
      adminNotes: parsed.data.adminNotes ?? "",
    },
    { new: true }
  ).lean();

  if (!quote) {
    return NextResponse.json({ error: "Quote not found" }, { status: 404 });
  }

  return NextResponse.json({ quote });
}
