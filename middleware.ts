import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAuth = !!token;
        const isAuthPage = req.nextUrl.pathname.startsWith("/login") ||
            req.nextUrl.pathname.startsWith("/register");

        if (isAuthPage) {
            if (isAuth) {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
            return null;
        }

        if (!isAuth && !req.nextUrl.pathname.startsWith("/explore")) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // Role protection for Admin
        if (req.nextUrl.pathname.startsWith("/admin") && token?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        return null;
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token || true, // Handled in function
        },
    }
);

export const config = {
    matcher: [
        "/dashboard",
        "/admin/:path*",
        "/listings/create",
        "/listings/my-listings",
        "/donations/:path*",
        "/pickups/:path*",
        "/notifications/:path*",
        "/impact/:path*",
    ],
};
