// server/src/utils/business.ts
import { GraphQLContext } from "../context.js";

export async function getBusinessId(ctx: GraphQLContext): Promise<string> {
  const userId = ctx?.user?.id;
  if (!userId) throw new Error("Unauthorized");

  const user = await ctx.prisma.user.findUnique({
    where: { id: userId },
    select: { businessId: true },
  });

  if (!user?.businessId) {
    throw new Error("You must create a business first.");
  }

  return user.businessId;
}
