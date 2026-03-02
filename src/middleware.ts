import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Allow invite acceptance page without auth (it's the sign-up flow)
  if (request.nextUrl.pathname.startsWith("/founders/accept")) {
    return NextResponse.next();
  }

  const sessionCookie =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/admin/:path*", "/founders/:path*"],
};
