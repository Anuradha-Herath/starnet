import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/login",
    "/signup",
    "/browse",
    "/browse/(.*)",
    "/performer/(.*)",
    "/unauthorized",
    "/api/(.*)",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
