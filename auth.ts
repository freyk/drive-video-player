import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { auth, handlers, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/drive.readonly",
          // Forzar a Google a mostrar de nuevo la pantalla de consentimiento
          // y asegurarnos de que incluya el scope de Drive en el token
          prompt: "consent",
          access_type: "offline",
        },
      },
    }),
  ],
  callbacks: {
    jwt({ token, account }) {
      if (account?.access_token) {
        token.access_token = account.access_token;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session as { accessToken?: string }).accessToken =
          token.access_token as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});
