import { initTRPC } from "@trpc/server";
import { cache } from "react";
import superjson from "superjson";
import { getTokenFromCookie } from "@/app/server/action";

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  const token = await getTokenFromCookie();
  return { token };
});
const t = initTRPC.context<typeof createTRPCContext>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async function (opts) {
  const { ctx, next } = opts;
  
  if (!ctx.token) {
    throw new Error("Unauthorized");
  }

  return next({
    ctx: {
      ...ctx,
      token: ctx.token,
    },
  });
});