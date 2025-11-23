// prisma/seeds/seedProject.ts
import { PrismaClient, ClientType } from "@prisma/client";
const prisma = new PrismaClient();
export default async function seedProject() {
    console.log("🌱 Seeding Project...");
    // 1) Find business
    const business = await prisma.business.findFirst({
        where: { email: "contact@flowtradie.com" },
    });
    if (!business) {
        console.error("❌ No business found - seedBusiness must run first.");
        return;
    }
    // 2) Create / upsert CLIENT FIRST (must exist before project)
    let client = await prisma.client.findFirst({
        where: { email: "seedclient@flowtradie.com" },
    });
    if (!client) {
        client = await prisma.client.create({
            data: {
                businessId: business.id,
                type: ClientType.RESIDENTIAL, // ✔ VALID ENUM
                firstName: "Seed",
                lastName: "Client",
                email: "seedclient@flowtradie.com",
            },
        });
    }
    // 3) Upsert Project
    const project = await prisma.project.upsert({
        where: { id: "seed-project-1" },
        update: {},
        create: {
            id: "seed-project-1",
            businessId: business.id,
            clientId: client.id, // ✔ NOW VALID
            title: "Seed Test Project",
            description: "Project for timelog/task/invoice testing",
        },
    });
    console.log("📂 Project:", project.id);
    return project;
}
//# sourceMappingURL=seedProject.js.map