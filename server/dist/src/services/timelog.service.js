export async function getAll(ctx) {
    const result = await ctx.prisma.timeLog.findMany({
        where: ctx.businessId ? { businessId: ctx.businessId } : {},
        include: { project: true, user: true },
    });
    return result.map((log) => ({
        ...log,
        hoursWorked: log.hoursWorked.toNumber(), // 🔥 FIX
    }));
}
export async function getById(id, ctx) {
    const log = await ctx.prisma.timeLog.findUnique({
        where: { id },
        include: { project: true, user: true },
    });
    return log ? { ...log, hoursWorked: log.hoursWorked.toNumber() } : null;
}
export async function create(input, ctx) {
    const log = await ctx.prisma.timeLog.create({
        data: {
            ...input,
            ...(ctx.businessId !== null ? { businessId: ctx.businessId } : {}),
        },
        include: { project: true, user: true },
    });
    return { ...log, hoursWorked: log.hoursWorked.toNumber() };
}
export async function update(id, input, ctx) {
    const { hoursWorked, ...rest } = input;
    const updateData = {
        ...rest,
        ...(hoursWorked !== null && hoursWorked !== undefined ? { hoursWorked } : {}),
    };
    const log = await ctx.prisma.timeLog.update({
        where: { id },
        data: updateData,
        include: { project: true, user: true },
    });
    return { ...log, hoursWorked: log.hoursWorked.toNumber() };
}
export async function remove(id, ctx) {
    const log = await ctx.prisma.timeLog.findUnique({
        where: { id },
        include: { project: true, user: true },
    });
    if (!log)
        return null;
    await ctx.prisma.timeLog.delete({ where: { id } });
    return { ...log, hoursWorked: log.hoursWorked.toNumber() }; // 🔥 Return full previous version
}
//# sourceMappingURL=timelog.service.js.map