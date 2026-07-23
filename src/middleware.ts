import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedPaths = ["/dashboard"];
const authPaths = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const isProtected = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const isAuthPage = authPaths.includes(pathname);

  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  // An authenticated client should land in the portal, not see auth forms again.
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/login", "/signup"] };
