// server/src/graphql/resolvers/project.ts
import { projectService } from "../../services/project.service.js";
export const projectResolvers = {
    Query: {
        projects: async (_p, _args, ctx) => {
            const result = await projectService.getAll(undefined, ctx);
            return result; // ⬅ FIX: CAST
        },
        project: async (_p, { id }, ctx) => {
            const result = await projectService.getById(id, ctx);
            return result; // ⬅ FIX: CAST
        },
    },
    Mutation: {
        createProject: async (_p, { input }, ctx) => {
            const result = await projectService.create(input, ctx);
            return result; // ⬅ FIX: CAST
        },
        updateProject: async (_p, { id, input }, ctx) => {
            const { user } = ctx;
            if (!user)
                throw new Error("You must be logged in to update a project.");
            // Role-guard for budget
            if (input.budgetedAmount !== undefined &&
                user.role !== "OWNER" &&
                user.role !== "ADMIN") {
                throw new Error("You are not authorized to edit the project budget.");
            }
            const result = await projectService.update(id, input, ctx);
            return result; // ⬅ FIX: CAST
        },
        deleteProject: async (_p, { id }, ctx) => {
            const result = await projectService.delete(id, ctx);
            return result; // ⬅ FIX: CAST
        },
    },
};
//# sourceMappingURL=project.js.map