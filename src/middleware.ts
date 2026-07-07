import { withAuth } from "next-auth/middleware";

// Protect these routes — unauthenticated users are redirected straight to /login.
export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/contact/:path*"],
};
