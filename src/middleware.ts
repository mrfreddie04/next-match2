import { NextResponse } from "next/server";
import { auth } from "./auth";
import { authRoutes, publicRoutes } from "./routes";

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

  //console.log("STATUS", nextUrl.pathname, isLoggedIn, isPublic, isAuth);

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

  // if(isPublic || !isLoggedIn && isAuth || isLoggedIn && !isPublic) {
  //   return NextResponse.next()
  // }

  return NextResponse.next();
});

export const config = {  
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */    
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}