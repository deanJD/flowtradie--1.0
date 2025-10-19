// server/src/graphql/scalars/dateTime.ts
import { GraphQLScalarType, Kind } from 'graphql';

export const dateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar type',
  // This function converts the Date object from our backend into a string (like an ISO string) to be sent to the client.
  serialize(value: unknown) {
    if (value instanceof Date) {
      return value.toISOString();
    }
    throw new Error('GraphQL DateTime Scalar serializer expected a `Date` object');
  },
  // This function converts a string from the client (like an ISO string) into a Date object for our backend.
  parseValue(value: unknown) {
    if (typeof value === 'string') {
      return new Date(value);
    }
    throw new Error('GraphQL DateTime Scalar parser expected a `string`');
  },
  // This function does the same as parseValue, but for arguments embedded in the query itself.
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});