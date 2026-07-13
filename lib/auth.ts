import { ConvexAdapter } from "@/app/ConvexAdapter";
import { SignJWT, importPKCS8 } from "jose";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

const CONVEX_SITE_URL = process.env.NEXT_PUBLIC_CONVEX_URL!.replace(
    /.cloud$/,
    ".site",
);

export const { handlers, signIn, signOut, auth } = NextAuth({
    debug: true,
    providers: [
        Google,
        GitHub,
    ],
    adapter: ConvexAdapter,
    callbacks: {
        async session({ session, user }) {
            const privateKey = await importPKCS8(
                process.env.CONVEX_AUTH_PRIVATE_KEY!,
                "RS256",
            );
            // In database session strategy, user holds the database user info.
            // session.userId is also available if we type it.
            const userId = user?.id || (session as any).userId;
            const convexToken = await new SignJWT({
                sub: userId,
            })
                .setProtectedHeader({ alg: "RS256" })
                .setIssuedAt()
                .setIssuer(CONVEX_SITE_URL)
                .setAudience("convex")
                .setExpirationTime("1h")
                .sign(privateKey);
            return { ...session, userId, convexToken };
        },
    },
});

declare module "next-auth" {
    interface Session {
        userId?: string;
        convexToken: string;
    }
}

