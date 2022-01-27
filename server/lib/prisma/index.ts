import { PrismaClient, Prisma } from "@prisma/client";

let prisma: PrismaClient;
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({ log: ["query", "info", `warn`, `error`] });
} else {
  const globalObj = global as any;
  if (!globalObj.prisma) {
    globalObj.prisma = new PrismaClient();
  }

  prisma = globalObj.prisma;
}

export default prisma;