import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const role = (req.auth?.user as any)?.role;

    console.log("[Proxy]", {
        path: nextUrl.pathname,
        isLoggedIn,
        role,
    });

    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
    const isPublicRoute = ["/", "/login", "/register"].includes(nextUrl.pathname);
    const isClientRoute = nextUrl.pathname.startsWith("/client");
    const isTalentRoute = nextUrl.pathname.startsWith("/talent");

    // 1. Allow NextAuth API routes
    if (isApiAuthRoute) {
        return NextResponse.next();
    }

    // 2. Redirect unauthenticated users
    if (!isLoggedIn) {
        if (!isPublicRoute) {
            const loginUrl = new URL("/login", nextUrl);
            loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
            return NextResponse.redirect(loginUrl);
        }
        return NextResponse.next();
    }

    // 3. Authenticated user checks
    if (isLoggedIn) {
        // If user doesn't have a role, redirect them to /register to select one
        if (!role) {
            if (nextUrl.pathname !== "/register") {
                return NextResponse.redirect(new URL("/register", nextUrl));
            }
            return NextResponse.next();
        }

        // Prevent client accessing talent routes and vice versa
        if (role === "client" && isTalentRoute) {
            return NextResponse.redirect(new URL("/client/dashboard", nextUrl));
        }
        if (role === "talent" && isClientRoute) {
            return NextResponse.redirect(new URL("/talent/dashboard", nextUrl));
        }

        // Prevent visiting login/register if already logged in
        if (nextUrl.pathname === "/login" || nextUrl.pathname === "/register") {
            const dest = role === "client" ? "/client/dashboard" : "/talent/dashboard";
            return NextResponse.redirect(new URL(dest, nextUrl));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};