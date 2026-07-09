import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { ConvexAdapter } from 'convex-adapter';

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google],
    adapter: ConvexAdapter(process.env.CONVEX_DEPLOYMENT as string),
    callbacks: {
        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
});