import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";
import { authConfig } from "@/lib/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Strategia JWT, nie sesje w bazie: Credentials w v5 i tak wymusza JWT,
  // wiec adapter Prismy bylby martwym kodem.
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(data) {
        const result = loginSchema.safeParse(data);
        if (!result.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: result.data.email },
        });
        if (!user) return null;

        const passwordMatches = await bcrypt.compare(result.data.password, user.passwordHash);
        if (!passwordMatches) return null;

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
});
