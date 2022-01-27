import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";
import { downloads } from "server/routers/downloads";

const sampleRouter = trpc.router().query("hello", {
  input: z
    .object({
      text: z.string().nullish(),
    })
    .nullish(),
  resolve({ input }) {
    return {
      greeting: `hello ${input?.text ?? "world"}`,
    };
  },
});

// export type definition of API
export type AppRouter = typeof appRouter;

const appRouter = trpc
  .router()
  .merge("sample.", sampleRouter)
  .merge("downloads.", downloads);

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
