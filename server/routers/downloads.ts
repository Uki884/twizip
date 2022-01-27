import * as trpc from "@trpc/server";
import { z } from "zod";
import prisma from 'server/lib/prisma';

export const downloads = trpc.router()
  .mutation("create", {
    input: z.object({
      user_name: z.string(),
    }),
    resolve: async ({ input }) => {
      await prisma.download.upsert({
        where: {
          user_name: input.user_name,
        },
        update: {
          count: {
            increment: 1
          }
        },
        create: {
          count: 1,
          user_name: input.user_name,
        },
      })
      return {
        result: 'success',
      };
    },
  })
  .query("list", {
    async resolve() {
      return await prisma.download.findMany()
    },
  });
