// server/src/graphql/resolvers/project.ts

import { GraphQLContext } from "../../context.js";
import { projectService } from "../../services/project.service.js";

import {
  QueryProjectArgs,
  MutationCreateProjectArgs,
  MutationUpdateProjectArgs,
  MutationDeleteProjectArgs,
  Project as GQLProject,
} from "@/__generated__/graphql.js";

export const projectResolvers = {
  Query: {
    projects: async (
      _p: unknown,
      _args: unknown,
      ctx: GraphQLContext
    ): Promise<GQLProject[]> => {
      const result = await projectService.getAll(undefined, ctx);
      return result as unknown as GQLProject[];  // ⬅ FIX: CAST
    },

    project: async (
      _p: unknown,
      { id }: QueryProjectArgs,
      ctx: GraphQLContext
    ): Promise<GQLProject | null> => {
      const result = await projectService.getById(id, ctx);
      return result as unknown as GQLProject | null;  // ⬅ FIX: CAST
    },
  },

  Mutation: {
    createProject: async (
      _p: unknown,
      { input }: MutationCreateProjectArgs,
      ctx: GraphQLContext
    ): Promise<GQLProject> => {
      const result = await projectService.create(input, ctx);
      return result as unknown as GQLProject;  // ⬅ FIX: CAST
    },

    updateProject: async (
      _p: unknown,
      { id, input }: MutationUpdateProjectArgs,
      ctx: GraphQLContext
    ): Promise<GQLProject> => {
      const { user } = ctx;
      if (!user) throw new Error("You must be logged in to update a project.");

      // Role-guard for budget
      if (
        input.budgetedAmount !== undefined &&
        user.role !== "OWNER" &&
        user.role !== "ADMIN"
      ) {
        throw new Error("You are not authorized to edit the project budget.");
      }

      const result = await projectService.update(id, input, ctx);
      return result as unknown as GQLProject;  // ⬅ FIX: CAST
    },

    deleteProject: async (
      _p: unknown,
      { id }: MutationDeleteProjectArgs,
      ctx: GraphQLContext
    ): Promise<GQLProject> => {
      const result = await projectService.delete(id, ctx);
      return result as unknown as GQLProject;  // ⬅ FIX: CAST
    },
  },
};
