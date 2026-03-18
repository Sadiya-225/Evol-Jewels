import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function createTRPCContext(opts: { headers: Headers }) {
  // Get session from BetterAuth
  const session = await auth.api.getSession({
    headers: opts.headers,
  });

  return {
    db,
    session: session?.session || null,
    user: session?.user || null,
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
