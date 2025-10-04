// server/src/graphql/resolvers/customer.ts
import { GraphQLContext } from "../../context.js";
import { customerService } from "../../services/customer.service.js";
import { CreateCustomerInput, UpdateCustomerInput } from "@/__generated__/graphql.js";

export const customerResolvers = {
  Query: {
    customers: (_p: unknown, _a: unknown, ctx: GraphQLContext) => {
      return customerService.getAll(ctx);
    },
    customer: (_p: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      return customerService.getById(id, ctx);
    },
  },
  Mutation: {
    createCustomer: (
      _p: unknown,
      { input }: { input: CreateCustomerInput },
      ctx: GraphQLContext
    ) => {
      return customerService.create(input, ctx);
    },
    updateCustomer: (
      _p: unknown,
      { id, input }: { id: string; input: UpdateCustomerInput },
      ctx: GraphQLContext
    ) => {
      return customerService.update(id, input, ctx);
    },
    deleteCustomer: (
      _p: unknown,
      { id }: { id: string },
      ctx: GraphQLContext
    ) => {
      return customerService.delete(id, ctx);
    },
  },

  // Since our service calls don't include the 'jobs' relation,
  // this relational resolver is still needed for now.
  Customer: {
    jobs: (parent: { id: string }, _a: unknown, ctx: GraphQLContext) => {
      return ctx.prisma.job.findMany({
        where: { customerId: parent.id },
      });
    },
  },
};