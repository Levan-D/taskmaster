/** @format */

import { authMiddleware } from "@kinde-oss/kinde-auth-nextjs/server"
import { cookies } from "next/headers"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

export default authMiddleware

