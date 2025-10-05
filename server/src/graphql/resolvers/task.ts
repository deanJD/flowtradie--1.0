// server/src/graphql/resolvers/task.ts
import { GraphQLContext } from "../../context.js";
import { taskService } from "../../services/task.service.js";
import { CreateTaskInput, UpdateTaskInput } from "@/__generated__/graphql.js";

export const taskResolvers = {
  Query: {
    tasks: (_p: unknown, { projectId }: { projectId: string }, ctx: GraphQLContext) =>
      taskService.getAllByProject(projectId, ctx),

    task: (_p: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
      taskService.getById(id, ctx),
  },

  Mutation: {
    createTask: (_p: unknown, { input }: { input: CreateTaskInput }, ctx: GraphQLContext) =>
      taskService.create(input, ctx),

    updateTask: (
      _p: unknown,
      { id, input }: { id: string; input: UpdateTaskInput },
      ctx: GraphQLContext
    ) => taskService.update(id, input, ctx),

    deleteTask: (_p: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
      taskService.delete(id, ctx),
  },
  
  // Note: The extra relational resolvers for `Project.tasks`, `Task.assignedTo`,
  // and `Task.project` are no longer needed! Because our service functions now use `include`,
  // GraphQL's default resolver is smart enough to find the `project` and `assignedTo`
  // properties on the parent Task object automatically.
};