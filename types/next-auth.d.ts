import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
      unijos?: string
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
    unijos?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    unijos?: string
  }
}
