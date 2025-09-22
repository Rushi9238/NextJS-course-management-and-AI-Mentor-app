import { NextResponse } from "next/server"
import { NextRequest } from "next/server"
import { jwtVerify } from "jose"

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value
  const { pathname } = request.nextUrl

  // Public routes
  const publicRoutes = ["/", "/login", "/signup"]

  const isPublic = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
  if (isPublic) return NextResponse.next()

  // No token -> redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    // Verify JWT using jose
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!))

    // console.log("JWT decoded:", payload)

    const roleRoutes:any = {
      admin: ["/dashboard", "/users", "/courses", "/my-learning", "/ai-mentor", "/enrollments"],
      instructor: ["/dashboard", "/courses", "/my-learning", "/ai-mentor", "/enrollments"],
      student: ["/dashboard", "/my-learning", "/ai-mentor", "/courses"],
    }

    const allowedRoutes = roleRoutes[payload.role as string] || []

    const hasAccess = allowedRoutes.some(
      (route:any) => pathname === route || pathname.startsWith(`${route}/`)
    )

    if (!hasAccess) {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }

    return NextResponse.next()
  } catch (err) {
    console.error("JWT verification failed:", err)
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
