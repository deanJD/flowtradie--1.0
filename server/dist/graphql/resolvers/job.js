import { jobService } from "../../services/job.service.js";
export const jobResolvers = {
    Query: {
        jobs: (_p, _a, ctx) => jobService.getAll(ctx),
        job: (_p, args, ctx) => jobService.getById(args.id, ctx),
    },
    Mutation: {
        createJob: (_p, args, ctx) => {
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
        updateJob: (_p, args, ctx) => {
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
        deleteJob: (_p, args, ctx) => jobService.delete(args.id, ctx),
    },
}; // ✅ make sure this final closing brace exists
//# sourceMappingURL=job.js.map