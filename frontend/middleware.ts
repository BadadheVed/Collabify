import { NextRequest, NextResponse } from "next/server";
const protectedRoutes = [
  "/dashboard",
  "/teams",
  "/projects",
  "/documents",
  "/tasks",
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/teams/:path*",
    "/projects/:path*",
    "/documents/:path*",
    "/tasks/:path*",
  ],
};
