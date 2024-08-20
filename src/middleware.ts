import { NextResponse } from "next/server";
import { auth } from "./auth";
import { authRoutes, publicRoutes, adminRoutes } from "./routes";
import { Role } from "@prisma/client";

//use NextAuth to generate middleware function - it returns AppRouteHandlerFn
//normally we export a function as such:
// export function middleware(request: NextRequest) {
//   return NextResponse.redirect(new URL('/home', request.url))
// }

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth; //session object - same as retuned by auth()
  
  const isPublic = publicRoutes.includes(nextUrl.pathname);
  const isAuth = authRoutes.includes(nextUrl.pathname);
  const isAdminRoute = adminRoutes.some( route => nextUrl.pathname.startsWith(route) );
  const isProfileComplete = req.auth?.user.profileComplete;
  const isAdmin = req.auth?.user.role === Role.ADMIN;

  //console.log("STATUS", nextUrl.pathname, isLoggedIn, isPublic, isAuth);
  //admin has access to all routes
  if(isPublic || isAdmin) {
    return NextResponse.next();
  }  

  if(isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/", nextUrl)); 
  }

  if(isAuth) {
    //console.log("Redirect /members")
    if(isLoggedIn) {
      return NextResponse.redirect(new URL("/members", nextUrl)); //we pass nextUrl for basePath
    }
    return NextResponse.next();
  }

  if(!isLoggedIn && !isPublic) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }  

  //redirect to /complete-profile if the profile is not complete, the last condition is to avoid infinite loop
  if(isLoggedIn && !isProfileComplete && nextUrl.pathname !== "/complete-profile") {
    return NextResponse.redirect(new URL("/complete-profile", nextUrl));
  }

  return NextResponse.next();
});

//define a matcher to exclude certain routes from the middleware
export const config = {  
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */    
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
  ]
}