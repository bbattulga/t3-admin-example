import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
  DefaultUser,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "@/env.mjs";
import { prisma } from "@/server/db";
import { useSession } from "next-auth/react";
import { DefaultJWT, JWT } from "next-auth/jwt";
import jsonwebtoken from 'jsonwebtoken'

export type UserRole = 'admin' | 'super-admin' | string

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      role: UserRole;
      orgId?: number;
      adminId: number;
      roleName: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string;
    adminId: number;
  }
}

export type AuthSession = ReturnType<typeof useSession>

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  jwt: {
    async encode(params): Promise<string> {
      // return a custom encoded JWT string
      if (!params.token?.email) {
        throw `Email not found when encoding the JWT`
      }
      const admin = await prisma.lt_admin.findFirstOrThrow({
        where: {
          email: params.token.email,
        },
        select: {
          admin_id: true,
          role: {
            select: {
              slug: true,
            }
          },
        }
      })
      params.token.role = admin.role.slug
      params.token.adminId = admin.admin_id
      return jsonwebtoken.sign(params.token, params.secret)
    },
    async decode(params): Promise<JWT | null> {
      // return a `JWT` object, or `null` if decoding failed
      console.log(`decode token`)
      if (!params.token) {
        console.log(`Decode token null`)
        return null
      }
      return jsonwebtoken.verify(params.token, params.secret) as JWT
    },
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.email) {
        const dbAdmin = await prisma.lt_admin.findFirst({
          where: {
            email: token.email,
          },
          select: {
            admin_id: true,
            org_id: true,
            role: {
              select: {
                slug: true,
                name: true,
              }
            }
          }
        })
        if (dbAdmin && dbAdmin.role) {
          session.user.roleName = dbAdmin.role.name;
          session.user.adminId = dbAdmin.admin_id;
          session.user.orgId = dbAdmin.org_id || undefined;
          session.user.role = dbAdmin.role.slug; // <-- put other properties on the session here
        }
      }
      return session;
    },

  },
  adapter: PrismaAdapter(prisma),
  providers: [
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    })
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
