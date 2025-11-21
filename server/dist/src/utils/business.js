export async function getBusinessId(ctx) {
    const userId = ctx?.user?.id;
    if (!userId)
        throw new Error("Unauthorized");
    const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
        select: { businessId: true },
    });
    if (!user?.businessId) {
        throw new Error("You must create a business first.");
    }
    return user.businessId;
}
//# sourceMappingURL=business.js.map