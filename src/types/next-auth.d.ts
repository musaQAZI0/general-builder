import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      email?: string | null;
      phone?: string;
      isAdmin?: boolean;
    };
  }

  interface User {
    id: string;
    phone?: string;
    isAdmin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    phone?: string;
    isAdmin?: boolean;
  }
}
