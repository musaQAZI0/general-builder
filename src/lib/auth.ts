import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export function isAdminEmail(email?: string | null) {
  const adminEmails = (process.env.ADMIN_EMAILS || process.env.OWNER_EMAIL || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  return !!email && adminEmails.includes(email.toLowerCase());
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectToDatabase();

        const user = await User.findOne({
          email: credentials.email.toLowerCase().trim(),
        });

        if (!user) {
          // No user with that email — invalid credentials.
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          return null;
        }

        // Returned object is stored in the JWT.
        return {
          id: user._id.toString(),
          email: user.email,
          phone: user.phone,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
        token.phone = (user as { phone?: string }).phone;
        token.isAdmin = isAdminEmail(user.email);
      }
      if (token.email) token.isAdmin = isAdminEmail(token.email);
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { phone?: string }).phone = token.phone as string;
        (session.user as { isAdmin?: boolean }).isAdmin = Boolean(token.isAdmin);
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
