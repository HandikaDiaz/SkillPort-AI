// lib/auth.ts (atau auth.ts di root)
import { ConvexAdapter } from "@/app/ConvexAdapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { createSign, createPrivateKey } from "crypto";
import { Id } from "@/convex/_generated/dataModel";

const CONVEX_SITE_URL = process.env.NEXT_PUBLIC_CONVEX_URL!.replace(
    /.cloud$/,
    ".site",
);

// ✅ Parse private key
function getPrivateKeyPem(): string {
    const rawKey = process.env.CONVEX_AUTH_PRIVATE_KEY;
    if (!rawKey) {
        throw new Error("CONVEX_AUTH_PRIVATE_KEY is not set in .env.local");
    }
    
    // Debug
    console.log("=== DEBUG KEY ===");
    console.log("Raw length:", rawKey.length);
    console.log("Starts with:", rawKey.substring(0, 40));
    console.log("Ends with:", rawKey.substring(rawKey.length - 40));
    console.log("Has \\n:", rawKey.includes("\\n"));
    console.log("Has actual newline:", rawKey.includes("\n"));
    
    const cleaned = rawKey.replace(/\\n/g, "\n").trim();
    
    console.log("Cleaned length:", cleaned.length);
    console.log("Cleaned starts with:", cleaned.substring(0, 40));
    console.log("Cleaned ends with:", cleaned.substring(cleaned.length - 40));
    console.log("Lines count:", cleaned.split("\n").length);
    console.log("First line:", cleaned.split("\n")[0]);
    console.log("Last line:", cleaned.split("\n").pop());
    
    return cleaned;
}

const PRIVATE_KEY_PEM = getPrivateKeyPem();

// ✅ Validate format
if (!PRIVATE_KEY_PEM.includes("-----BEGIN PRIVATE KEY-----")) {
    throw new Error(
        "CONVEX_AUTH_PRIVATE_KEY must be in PKCS#8 format.\n" +
        "Run: node generate-keys.mjs\n" +
        "Got: " + PRIVATE_KEY_PEM.substring(0, 50)
    );
}

// ✅ Sign JWT dengan Node.js crypto (NO jose!)
function signConvexToken(payload: { sub?: string }): string {
    const privateKey = createPrivateKey(PRIVATE_KEY_PEM);

    const header = { alg: "RS256", typ: "JWT" };
    const now = Math.floor(Date.now() / 1000);

    const claims = {
        ...payload,
        iat: now,
        iss: CONVEX_SITE_URL,
        aud: "convex",
        exp: now + 3600, // 1 hour
    };

    const b64url = (str: string) => Buffer.from(str).toString("base64url");

    const encodedHeader = b64url(JSON.stringify(header));
    const encodedPayload = b64url(JSON.stringify(claims));
    const signingInput = `${encodedHeader}.${encodedPayload}`;

    const signer = createSign("RSA-SHA256");
    signer.update(signingInput);
    const signature = signer.sign(privateKey, "base64url");

    return `${signingInput}.${signature}`;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    debug: true,
    trustHost: true,
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
        }),
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                if (!ConvexAdapter.getUserByEmail) return null;

                const user = await ConvexAdapter.getUserByEmail(
                    credentials.email as string,
                );
                if (!user) return null;

                const passwordHash = await fetchQuery(api.users.getPasswordHash, {
                    userId: user.id as Id<"users">,
                });
                if (!passwordHash) return null;

                const isValid = await bcrypt.compare(
                    credentials.password as string,
                    passwordHash,
                );
                if (!isValid) return null;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                };
            },
        }),
    ],
    adapter: ConvexAdapter,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            console.log("🔥 jwt callback called");
            console.log("🔥 user:", user?.id);

            if (user) {
                token.sub = user.id;
                console.log("🔥 token.sub set to:", user.id);
            }
            return token;
        },
        async session({ session, token }) {
            console.log("🔥 session callback called");
            console.log("🔥 token.sub:", token.sub);

            try {
                console.log("🔥 calling signConvexToken...");
                const convexToken = signConvexToken({ sub: token.sub });
                console.log("🔥 convexToken generated successfully");

                return {
                    ...session,
                    userId: token.sub,
                    convexToken,
                    user: {
                        ...session.user,
                        id: token.sub!,
                    },
                };
            } catch (error) {
                console.error("❌ signConvexToken error:", error);
                // Return session tanpa convexToken biar tidak null
                return {
                    ...session,
                    userId: token.sub,
                    convexToken: "",
                    user: {
                        ...session.user,
                        id: token.sub!,
                    },
                };
            }
        },
    },
});

declare module "next-auth" {
    interface Session {
        userId?: string;
        convexToken: string;
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }
}