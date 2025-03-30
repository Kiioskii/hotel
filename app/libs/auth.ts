import { NextAuthOptions } from "next-auth";
import { SanityAdapter, SanityCredentials } from "next-auth-sanity";
import GithubProvider from "next-auth/providers/github";
import SanityClient from "./sanity";
export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.HITHUB_CLIENT_SECRET as string,
    }),
    SanityCredentials(SanityClient),
  ],
  session: {
    strategy: "jwt",
  },
  adapter: SanityAdapter(SanityClient),
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session: async ({ session, token }) => {
      const userEmail = token.email;
      const userIdObj = await SanityClient.fetch<{ _id: string }>(
        `*[_type == "user" && email == $email[0] {
        _id
        }]`,
        { email: userEmail }
      );
      return {
        ...session,
        user: {
          ...session.user,
          id: userIdObj._id,
        },
      };
    },
  },
};
