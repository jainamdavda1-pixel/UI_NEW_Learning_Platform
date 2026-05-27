import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function getOrCreateUser() {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }

  const user = await currentUser();
  if (!user) {
    return null;
  }

  // Check if user exists in DB
  let dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser) {
    // Determine name
    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "Student";
    const email = user.emailAddresses[0]?.emailAddress || "";
    
    // Default role to student, you can update this via Clerk metadata if needed
    const role = (user.publicMetadata?.role as string) || "student";

    dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name,
        email,
        role,
      },
    });
  }

  return dbUser;
}
