/** @format */

import { authMiddleware } from "@kinde-oss/kinde-auth-nextjs/server"

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/dashboard/:path*",
  ],
}

export default authMiddleware
