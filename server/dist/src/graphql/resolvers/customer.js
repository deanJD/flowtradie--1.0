import { customerService } from "../../services/customer.service.js";
export const customerResolvers = {
    Query: {
        customers: (_p, _a, ctx) => {
            return customerService.getAll(ctx);
        },
        customer: (_p, { id }, ctx) => {
            return customerService.getById(id, ctx);
        },
    },
    Mutation: {
        createCustomer: (_p, { input }, ctx) => {
            return customerService.create(input, ctx);
        },
        updateCustomer: (_p, { id, input }, ctx) => {
            return customerService.update(id, input, ctx);
        },
        deleteCustomer: (_p, { id }, ctx) => {
            return customerService.delete(id, ctx);
        },
    },
    // Since our service calls don't include the 'jobs' relation,
    // this relational resolver is still needed for now.
    Customer: {
        jobs: (parent, _a, ctx) => {
            return ctx.prisma.job.findMany({
                where: { customerId: parent.id },
            });
        },
    },
};
//# sourceMappingURL=customer.js.map