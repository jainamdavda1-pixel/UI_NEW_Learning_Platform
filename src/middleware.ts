import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)']);
const isFacultyRoute = createRouteMatcher(['/faculty(.*)', '/api/faculty(.*)']);
const isStudentRoute = createRouteMatcher(['/student(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  const session = await auth();

  // If user is not logged in and it's not a public route, redirect to sign-in
  if (!session.userId) {
    return session.redirectToSignIn({ returnBackUrl: req.url });
  }

  // Role based protection (assume roles are set in Clerk public metadata, defaulting to student)
  const sessionClaims = session.sessionClaims as { metadata?: { role?: string } } | undefined;
  const role = sessionClaims?.metadata?.role || 'student';

  if (isFacultyRoute(req) && role !== 'faculty') {
    return NextResponse.redirect(new URL('/student/dashboard', req.url));
  }

  if (isStudentRoute(req) && role === 'faculty') {
    return NextResponse.redirect(new URL('/faculty/dashboard', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
