// server/src/graphql/resolvers/project.ts

import { GraphQLContext } from "../../context.js";
import { projectService } from "../../services/project.service.js"; // Import our new service
import { CreateProjectInput, UpdateProjectInput } from "@/__generated__/graphql.js";

export const projectResolvers = {
  Query: {
    projects: (_p: unknown, { clientId }: { clientId?: string }, ctx: GraphQLContext) => {
      return projectService.getAll(clientId, ctx);
    },
    project: (_p: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      return projectService.getById(id, ctx);
    },
  },

  Mutation: {
    createProject: (_p: unknown, { input }: { input: CreateProjectInput }, ctx: GraphQLContext) => {
      return projectService.create(input, ctx);
    },

    updateProject: async (_p: unknown, { id, input }: { id: string; input: UpdateProjectInput }, ctx: GraphQLContext) => {
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

    deleteProject: (_p: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      return projectService.delete(id, ctx);
    },
  },

  // The relational resolver is no longer needed because our service
  // now includes the client data automatically! We can delete it.
};