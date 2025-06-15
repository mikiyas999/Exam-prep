import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Middleware function
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Public routes — always allow
  const publicPaths = ["/auth/login", "/auth/register", "/unauthorized"];
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // If no token and trying to access a protected route
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Role-based protection: Only "admin" can access /admin/*
  if (pathname.startsWith("/admin") && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Otherwise allow
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protect everything except the following:
    "/((?!_next/static|_next/image|favicon.ico|images|auth|unauthorized).*)",
  ],
};
