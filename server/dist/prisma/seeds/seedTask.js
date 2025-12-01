import { PrismaClient, TaskStatus } from "@prisma/client";
const prisma = new PrismaClient();
export async function seedTasks() {
    const project = await prisma.project.findFirst();
    const user = await prisma.user.findFirst(); // optional
    if (!project) {
        console.warn("⚠️ No project found — skipping task seed");
        return;
    }
    // Seed 3 tasks
    const tasksData = [
        {
            title: "Site inspection",
            description: "Check access and safety",
            projectId: project.id,
            businessId: project.businessId,
            status: TaskStatus.PENDING,
            assignedToId: user?.id ?? null,
        },
        {
            title: "Order Materials",
            description: "Timber + concrete",
            projectId: project.id,
            businessId: project.businessId,
            status: TaskStatus.IN_PROGRESS,
        },
        {
            title: "Excavation Start",
            description: "Book machinery",
            projectId: project.id,
            businessId: project.businessId,
            status: TaskStatus.COMPLETED,
        },
    ];
    await prisma.task.createMany({ data: tasksData });
    console.log("   ➤ 3 Tasks seeded successfully!");
}
//# sourceMappingURL=seedTask.js.map