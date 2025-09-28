import { jobService } from "../../services/job.service.js";
import { GraphQLContext } from "../../context.js";

interface CreateJobArgs {
  input: {
    title: string;
    description?: string;
    location?: string;
    status?: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
    startDate?: string;
    endDate?: string;
    customerId: string;
    managerId?: string;
};
}

interface UpdateJobArgs {
  id: string;
  input: {
    title?: string;
    description?: string;
    location?: string;
    status?: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
    startDate?: string;
    endDate?: string;
    managerId?: string;
  };
}

interface DeleteJobArgs {
  id: string;
}

export const jobResolvers = {
  Query: {
    jobs: (_p: unknown, _a: unknown, ctx: GraphQLContext) =>
      jobService.getAll(ctx),

    job: (_p: unknown, args: { id: string }, ctx: GraphQLContext) =>
      jobService.getById(args.id, ctx),
  },

  Mutation: {
    createJob: (_p: unknown, args: CreateJobArgs, ctx: GraphQLContext) => {
      const input = {
        ...args.input,
        startDate: args.input.startDate
          ? new Date(args.input.startDate)
          : undefined,
        endDate: args.input.endDate
          ? new Date(args.input.endDate)
          : undefined,
      };
      return jobService.create(input, ctx);
    },

    updateJob: (_p: unknown, args: UpdateJobArgs, ctx: GraphQLContext) => {
      const input = {
        ...args.input,
        startDate: args.input.startDate
          ? new Date(args.input.startDate)
          : undefined,
        endDate: args.input.endDate
          ? new Date(args.input.endDate)
          : undefined,
      };
      return jobService.update(args.id, input, ctx);
    },

    deleteJob: (_p: unknown, args: DeleteJobArgs, ctx: GraphQLContext) =>
      jobService.delete(args.id, ctx),
  },
}; // ✅ make sure this final closing brace exists
