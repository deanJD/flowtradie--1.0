// This file imports all individual resolver files and merges them into a single
// object for the Apollo Server.

import { customerResolvers } from './resolvers/customer.js';
import { jobResolvers } from './resolvers/job.js';
import { quoteResolvers } from './resolvers/quote.js';
import { invoiceResolvers } from './resolvers/invoice.js';
import { userResolvers } from './resolvers/user.js';
import { taskResolvers } from './resolvers/task.js';
import { expenseResolvers } from './resolvers/expense.js';
import { timeLogResolvers } from './resolvers/timelog.js';
import {reportingResolvers} from './resolvers/reporting.js';
// FIX: Import the 'merge' function from the lodash.merge library.
import merge from 'lodash.merge';
import { GraphQLScalarType, Kind } from 'graphql';
import { paymentResolvers } from './resolvers/payment.js';

// Define a custom scalar for handling DateTime objects.
const dateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar type',
  serialize(value: unknown) {
    if (value instanceof Date) {
      return value.toISOString();
    }
    throw Error('GraphQL DateTime Scalar serializer expected a `Date` object');
  },
  parseValue(value: unknown) {
    if (typeof value === 'string') {
      return new Date(value);
    }
    throw new Error('GraphQL DateTime Scalar parser expected a `string`');
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

// Merge all resolver objects together.
export const resolvers = merge(
  { DateTime: dateTimeScalar },
  customerResolvers,
  jobResolvers,
  quoteResolvers,
  invoiceResolvers,
  userResolvers,
  taskResolvers,
  expenseResolvers,
  timeLogResolvers,
  paymentResolvers,
  reportingResolvers
);

