import { z } from "zod";

import {
    createTRPCRouter,
    adminProcedure,
} from "@/server/api/trpc";

export const adminRouter = createTRPCRouter({
    dashboard: adminProcedure.query(async ({
        ctx,
    }) => {
        const adminCount = await ctx.prisma.lt_admin.count({
            where: {
                org_id: ctx.session.user.orgId
            },
        })
        return {
            adminCount
        }
    }),
    users: adminProcedure.input(z.object({
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
                role: {
                    select: {
                        name: true,
                    }
                },
                created_at: true,
            },
            where: {

            },
            take: input.limit,
            skip: input.offset,
        })
        return {
            total: total,
            records: records
        }
    }),
});
