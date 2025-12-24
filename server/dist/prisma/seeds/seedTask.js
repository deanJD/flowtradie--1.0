import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default async function seedTask(prisma) {
    console.log("🌱 Seeding tasks...");
    const business = await prisma.business.findFirst();
    if (!business)
        throw new Error("Business not found – seedBusiness must run first");
    const projects = await prisma.project.findMany({
        where: { businessId: business.id },
    });
    if (projects.length === 0) {
        console.log("   ➤ No projects found – seedProject must run first");
        return;
    }
    const existingCount = await prisma.task.count({
        where: { businessId: business.id },
    });
    if (existingCount > 0) {
        console.log(`   ➤ ${existingCount} tasks already exist – skipping`);
        return;
    }
    const tasksData = [];
    for (const project of projects) {
        tasksData.push({
            title: "Site measure & quote",
            description: "Visit site and confirm scope.",
            businessId: business.id,
            projectId: project.id,
            status: "COMPLETED",
            isCompleted: true,
        }, {
            title: "Order materials",
            description: "Order all required materials.",
            businessId: business.id,
            projectId: project.id,
            status: "IN_PROGRESS",
            isCompleted: false,
        }, {
            title: "Install & commissioning",
            description: "Complete install and test.",
            businessId: business.id,
            projectId: project.id,
            status: "PENDING",
            isCompleted: false,
        });
    }
    await prisma.task.createMany({ data: tasksData });
    console.log(`   ➤ Seeded ${tasksData.length} tasks`);
}
//# sourceMappingURL=seedTask.js.map