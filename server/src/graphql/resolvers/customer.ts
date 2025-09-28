import { customerService } from "../../services/customer.service.js";
import { GraphQLContext } from "../../context.js";

interface CreateCustomerArgs {
  input: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
}

interface UpdateCustomerArgs {
  id: string;
  input: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
}

interface DeleteCustomerArgs {
  id: string;
}

export const customerResolvers = {
  Query: {
    customers: (_p: unknown, _a: unknown, ctx: GraphQLContext) =>
      customerService.getAll(ctx),

    customer: (_p: unknown, args: { id: string }, ctx: GraphQLContext) =>
      customerService.getById(args.id, ctx),
  },

  Mutation: {
    createCustomer: (_p: unknown, args: CreateCustomerArgs, ctx: GraphQLContext) => {
      const input = {
        ...args.input,
        phone: args.input.phone ?? null,
        address: args.input.address ?? null,
      };
      return customerService.create(input, ctx);
    },

    updateCustomer: (_p: unknown, args: UpdateCustomerArgs, ctx: GraphQLContext) =>
      customerService.update(args.id, args.input, ctx),

    deleteCustomer: (_p: unknown, args: DeleteCustomerArgs, ctx: GraphQLContext) =>
      customerService.delete(args.id, ctx),
  },
};
