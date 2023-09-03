import User from "@models/user";
import { connectToDB } from "@utils/database";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  callbacks: {
    async session({ session }) {
      const sessionUser = await User.findOne({ email: session?.user?.email });
      if (sessionUser) {
        session.user.id = sessionUser._id.toString();
      }
      return session;
    },

    async signIn({ profile }) {
      await connectToDB();
      try {
        // check if user exists in db
        const isUserExist = await User.findOne({ email: profile?.email });
        // if not, create user
        if (!isUserExist) {
          await User.create({
            email: profile?.email,
            name: profile?.name?.replace(" ", "").toLowerCase(),
            image: profile?.image,
          });
        }
        return true;
      } catch (error) {
        console.log("Auth Error", error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
