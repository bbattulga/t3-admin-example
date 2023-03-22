import { TRPCError } from '@trpc/server';
import { z } from "zod";
import moment from 'moment'
import {
    createTRPCRouter,
    superAdminProcedure,
} from "@/server/api/trpc";

const sleep = (ms: number) => {
    return new Promise((res, reject) => {
        setTimeout(() => res(0), ms)
    })
}

export const superAdminRouter = createTRPCRouter({
    dashboard: superAdminProcedure.query(async ({
        ctx
    }) => {
        const adminCount = await ctx.prisma.lt_admin.count()
        const roleCount = await ctx.prisma.lt_role.count()
        const userCount = await ctx.prisma.lt_user.count()
        const orgCount = await ctx.prisma.lt_organization.count()
        return {
            adminCount,
            roleCount,
            userCount,
            orgCount
        }
    }),
    adminUsers: superAdminProcedure.input(z.object({
        offset: z.number(),
        limit: z.number(),
    })).query(async ({
        ctx,
        input
    }) => {
        const total = ctx.prisma.lt_admin.count()
        const records = await ctx.prisma.lt_admin.findMany({
            select: {
                admin_id: true,
                email: true,
                name: true,
                role: {
                    select: {
                        role_id: true,
                        name: true,
                    }
                },
                org: {
                    select: {
                        org_id: true,
                        name: true,
                        slug: true,
                    }
                },
                created_at: true,
                updated_at: true,
            },
            take: input.limit,
            skip: input.offset,
        })
        return {
            total: total,
            records: records
        }
    }),
    roles: superAdminProcedure.query(async ({
        ctx,
    }) => {
        const total = ctx.prisma.lt_role.count()
        const records = await ctx.prisma.lt_role.findMany({
            select: {
                name: true,
                role_id: true,
                is_super: true,
                created_at: true,
                slug: true,
            }
        })
        return {
            total: total,
            records: records
        }
    }),
    orgs: superAdminProcedure.query(async ({
        ctx,
    }) => {
        const total = ctx.prisma.lt_organization.count()
        const records = await ctx.prisma.lt_organization.findMany({
            select: {
                name: true,
                org_id: true,
                created_at: true,
                slug: true,
                status: true,
            }
        })
        return {
            total: total,
            records: records
        }
    }),
    createOrg: superAdminProcedure.input(z.object({
        name: z.string(),
        slug: z.string(),
    })).mutation(async ({
        ctx,
        input
    }) => {
        const existing = await ctx.prisma.lt_organization.findFirst({
            where: {
                slug: input.slug,
            },
            select: {
                org_id: true,
            }
        })
        if (existing) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: `Organization with ${input.slug} slug exists.`,
            })
        }
        const created = await ctx.prisma.lt_organization.create({
            data: {
                name: input.name,
                slug: input.slug,
                status: 'active',
            }
        })
        return created
    }),
    updateOrg: superAdminProcedure.input(z.object({
        orgId: z.number(),
        name: z.string(),
        slug: z.string(),
    })).mutation(async ({
        ctx,
        input
    }) => {
        const existing = await ctx.prisma.lt_organization.findFirst({
            where: {
                org_id: input.orgId,
            },
            select: {
                org_id: true,
            }
        })
        if (!existing) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: `Organization not found.`,
            })
        }
        const existingBySlug = await ctx.prisma.lt_organization.findFirst({
            where: {
                AND: [
                    {
                        slug: input.slug
                    },
                    {
                        NOT: {
                            org_id: input.orgId,
                        }
                    }
                ]
            },
            select: {
                org_id: true,
            }
        })
        if (existingBySlug) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: `Organization with ${input.slug} already exists`
            })
        }
        const updated = await ctx.prisma.lt_organization.update({
            where: {
                org_id: input.orgId,
            },
            data: {
                name: input.name,
                slug: input.slug,
                status: 'active',
                updated_at: moment().toDate()
            }
        })
        return updated
    }),
    deleteOrg: superAdminProcedure.input(z.object({
        orgId: z.number()
    })).mutation(async ({
        ctx,
        input
    }) => {
        const existing = await ctx.prisma.lt_organization.findFirst({
            where: {
                org_id: input.orgId,
            },
            select: {
                org_id: true,
            }
        })
        if (!existing) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: `Organization not found`,
            })
        }
        const deleted = await ctx.prisma.lt_organization.delete({
            where: {
                org_id: input.orgId
            }
        })
        return deleted
    }),
    createRole: superAdminProcedure.input(z.object({
        name: z.string(),
        slug: z.string(),
        isSuper: z.boolean(),
    })).mutation(async ({
        ctx,
        input
    }) => {
        const existing = await ctx.prisma.lt_role.findFirst({
            where: {
                slug: input.slug,
            },
            select: {
                role_id: true,
            }
        })
        if (existing) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: `Role with ${input.slug} slug exists.`,
            })
        }
        const created = await ctx.prisma.lt_role.create({
            data: {
                name: input.name,
                slug: input.slug,
                is_super: input.isSuper,
            }
        })
        return created
    }),
    updateRole: superAdminProcedure.input(z.object({
        roleId: z.number(),
        name: z.string(),
        slug: z.string(),
        isSuper: z.boolean(),
    })).mutation(async ({
        ctx,
        input
    }) => {
        const existing = await ctx.prisma.lt_role.findFirst({
            where: {
                role_id: input.roleId,
            },
            select: {
                role_id: true,
                slug: true,
            }
        })
        if (!existing) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: `Role ${input.name} not found.`,
            })
        }
        const existingBySlug = await ctx.prisma.lt_role.findFirst({
            where: {
                slug: input.slug,
            },
            select: {
                role_id: true,
            },
        })
        if (existingBySlug && (existingBySlug.role_id !== input.roleId)) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: `Role with ${input.slug} already exists`
            })
        }
        const updated = await ctx.prisma.lt_role.update({
            where: {
                role_id: input.roleId,
            },
            data: {
                name: input.name,
                slug: input.slug,
                is_super: input.isSuper,
            }
        })
        return updated
    }),
    deleteRole: superAdminProcedure.input(z.object({
        id: z.number()
    }))
        .mutation(async ({ ctx, input }) => {
            const existing = await ctx.prisma.lt_role.findFirst({
                where: {
                    role_id: input.id,
                },
                select: {
                    role_id: true,
                }
            })
            if (!existing) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: "Role not found"
                })
            }
            const deleted = await ctx.prisma.lt_role.delete({
                where: {
                    role_id: input.id,
                }
            })
            return deleted
        }),
    createAdmin: superAdminProcedure.input(z.object({
        name: z.string(),
        email: z.string(),
        role: z.number(),
        org: z.number().optional(),
    })).mutation(async ({
        ctx,
        input
    }) => {
        const created = await ctx.prisma.lt_admin.create({
            data: {
                name: input.name,
                email: input.name,
                role_id: input.role,
                status: 'active',
                org_id: input.org,
            }
        })
        return created
    }),
    updateAdmin: superAdminProcedure.input(z.object({
        adminId: z.number(),
        name: z.string(),
        email: z.string(),
        role: z.number(),
        org: z.number().optional()
    })).mutation(async ({
        ctx,
        input
    }) => {
        const admin = await ctx.prisma.lt_admin.findFirst({
            where: {
                admin_id: input.adminId,
            }
        })
        if (!admin) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: 'Admin not found'
            })
        }
        const updated = await ctx.prisma.lt_admin.update({
            where: {
                admin_id: input.adminId,
            },
            data: {
                name: input.name,
                email: input.email,
                role_id: input.role,
                status: 'active',
                updated_at: moment().toDate(),
                org_id: input.org,
            }
        })
        return updated
    }),
});
