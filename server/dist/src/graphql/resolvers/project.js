// server/src/graphql/resolvers/project.ts
import { projectService } from "../../services/project.service.js"; // Import our new service
export const projectResolvers = {
    Query: {
        projects: (_p, { clientId }, ctx) => {
            return projectService.getAll(clientId, ctx);
        },
        project: (_p, { id }, ctx) => {
            return projectService.getById(id, ctx);
        },
    },
    Mutation: {
        createProject: (_p, { input }, ctx) => {
            return projectService.create(input, ctx);
        },
        updateProject: async (_p, { id, input }, ctx) => {
            // vvvvvvvvvv AUTHORIZATION LOGIC vvvvvvvvvv
            const { user } = ctx;
            if (!user) {
                throw new Error("You must be logged in to update a project.");
            }
            // Check if the user is trying to update the protected budget field
            if (input.budgetedAmount !== undefined && input.budgetedAmount !== null) {
                // If they are, check if their role is authorized
                const isAuthorized = user.role === "OWNER" || user.role === "ADMIN";
                if (!isAuthorized) {
                    throw new Error("You are not authorized to edit the project budget.");
                }
            }
            // ^^^^^^^^^^ AUTHORIZATION LOGIC ^^^^^^^^^^
            // If all checks pass, proceed with the update
            return projectService.update(id, input, ctx);
        },
        deleteProject: (_p, { id }, ctx) => {
            return projectService.delete(id, ctx);
        },
    },
    // The relational resolver is no longer needed because our service
    // now includes the client data automatically! We can delete it.
};
//# sourceMappingURL=project.js.map