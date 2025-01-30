import type { NextAuthOptions } from "next-auth"
import { getSession } from "@auth0/nextjs-auth0"

export const authOptions: NextAuthOptions = {
  providers: [],
  callbacks: {
    async session({ session }) {
      try {
        const auth0Session = await getSession()
        if (auth0Session) {
          return {
            ...session,
            user: {
              ...session.user,
              ...auth0Session.user,
            },
          }
        }
        return session
      } catch (error) {
        console.error("Error in session callback:", error)
        return session
      }
    },
  },
}

