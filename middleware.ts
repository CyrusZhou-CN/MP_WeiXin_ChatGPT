//middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
    // Get the pathname of the request (e.g. /, /protected)
    const path = req.nextUrl.pathname;
    // If it's the root path, just render it
    if (path === "/") {
        return NextResponse.next();
    }
    const session = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });
    console.log("path:", path);
    console.log("session:", session);

    if (!session && path.startsWith("/admin") && path !== "/admin/login") {
        return NextResponse.redirect(new URL("/admin/login", req.url));
    } else if (session && (path==="/admin/login" || path==="/admin")) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.next();
}