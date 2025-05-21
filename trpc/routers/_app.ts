import { baseProcedure, createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  hello: baseProcedure.query(() => {
    return "Hello, world!";
  }),
});

export type AppRouter = typeof appRouter;