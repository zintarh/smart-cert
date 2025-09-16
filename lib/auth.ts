import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials")
            return null
          }

          console.log("Attempting to authenticate:", credentials.email)

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user) {
            console.log("User not found:", credentials.email)
            return null
          }

          if (!user.password) {
            console.log("User has no password")
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            console.log("Invalid password for:", credentials.email)
            return null
          }

          console.log("Authentication successful for:", credentials.email)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
            university: user.university,
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          const userWithRole = user as { role?: string; university?: string };
          token.role = userWithRole.role || 'admin'
          token.university = userWithRole.university || ''
        }
        return token
      } catch (error) {
        console.error("JWT callback error:", error)
        return token
      }
    },
    async session({ session, token }) {
      try {
        if (token && session.user) {
          session.user.id = token.sub!
          session.user.role = token.role as string
          session.user.university = token.university as string
        }
        return session
      } catch (error) {
        console.error("Session callback error:", error)
        return session
      }
    }
  },
  pages: {
    signIn: "/login",
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log("Sign in event:", { user: user.email, account: account?.type })
    },
    async signOut({ session, token }) {
      console.log("Sign out event:", { session: session?.user?.email })
    },
  },
}
