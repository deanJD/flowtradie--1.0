// server/src/graphql/resolvers/job.ts
import { jobService } from "../../services/job.service.js"; // Import our new service
export const jobResolvers = {
    Query: {
        jobs: (_p, { customerId }, ctx) => {
            return jobService.getAll(customerId, ctx);
        },
        job: (_p, { id }, ctx) => {
            return jobService.getById(id, ctx);
        },
    },
    Mutation: {
        createJob: (_p, { input }, ctx) => {
            return jobService.create(input, ctx);
        },
        updateJob: async (_p, { id, input }, ctx) => {
            // vvvvvvvvvv AUTHORIZATION LOGIC vvvvvvvvvv
            const { user } = ctx;
            if (!user) {
                throw new Error("You must be logged in to update a job.");
            }
            // Check if the user is trying to update the protected budget field
            if (input.budgetedAmount !== undefined && input.budgetedAmount !== null) {
                // If they are, check if their role is authorized
                const isAuthorized = user.role === "OWNER" || user.role === "ADMIN";
                if (!isAuthorized) {
                    throw new Error("You are not authorized to edit the job budget.");
                }
            }
            // ^^^^^^^^^^ AUTHORIZATION LOGIC ^^^^^^^^^^
            // If all checks pass, proceed with the update
            return jobService.update(id, input, ctx);
        },
        deleteJob: (_p, { id }, ctx) => {
            return jobService.delete(id, ctx);
        },
    },
    // The relational resolver is no longer needed because our service
    // now includes the customer data automatically! We can delete it.
};
//# sourceMappingURL=job.js.map