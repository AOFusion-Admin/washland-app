import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // This function is executed if the user is authenticated
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Super Admin routes
    if (pathname.startsWith("/admin/super")) {
      if (token?.role !== "SUPER_ADMIN") {
        return new Response("Access Denied", { status: 403 })
      }
    }

    // Franchise Admin routes
    if (pathname.startsWith("/admin/franchise")) {
      if (!["SUPER_ADMIN", "FRANCHISE_ADMIN"].includes(token?.role as string)) {
        return new Response("Access Denied", { status: 403 })
      }
    }

    // Store Admin routes
    if (pathname.startsWith("/admin/store")) {
      if (!["SUPER_ADMIN", "FRANCHISE_ADMIN", "STORE_ADMIN"].includes(token?.role as string)) {
        return new Response("Access Denied", { status: 403 })
      }
    }

    // Customer routes
    if (pathname.startsWith("/customer")) {
      if (!token?.role) {
        return new Response("Access Denied", { status: 403 })
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: [
    "/admin/:path*",
    "/customer/:path*",
    "/api/admin/:path*"
  ]
}