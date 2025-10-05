// ...other imports at the top of your file...
import { clientResolvers } from './resolvers/client.js';
import { projectResolvers } from './resolvers/project.js';
import { quoteResolvers } from './resolvers/quote.js';
import { invoiceResolvers } from './resolvers/invoice.js';
import { taskResolvers } from './resolvers/task.js';
import { expenseResolvers } from './resolvers/expense.js';
import { timeLogResolvers } from './resolvers/timelog.js';
import { reportingResolvers } from './resolvers/reporting.js'; // <-- THIS IS THE FIX
import merge from 'lodash.merge';
import { GraphQLScalarType, Kind } from 'graphql';
import { paymentResolvers } from './resolvers/payment.js';
import { authResolvers } from './resolvers/auth.js';
import { userResolvers } from './resolvers/user.js';
// ... any other code ...
// Define a custom scalar for handling DateTime objects.
const dateTimeScalar = new GraphQLScalarType({
    name: 'DateTime',
    description: 'DateTime custom scalar type',
    serialize(value) {
        if (value instanceof Date)
            return value.toISOString();
        throw new Error('GraphQL DateTime Scalar serializer expected a `Date` object');
    },
    parseValue(value) {
        if (typeof value === 'string')
            return new Date(value);
        throw new Error('GraphQL DateTime Scalar parser expected a `string`');
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING)
            return new Date(ast.value);
        return null;
    },
});
// Merge all resolver objects together.
const resolverModules = [
    { DateTime: dateTimeScalar },
    clientResolvers,
    projectResolvers,
    quoteResolvers,
    invoiceResolvers,
    taskResolvers,
    expenseResolvers,
    timeLogResolvers,
    paymentResolvers,
    reportingResolvers,
    authResolvers,
    userResolvers,
];
export const resolvers = merge({}, ...resolverModules.filter(Boolean));
//# sourceMappingURL=index.js.map