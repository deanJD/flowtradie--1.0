import { GraphQLError } from "graphql";

export function formatError(err: GraphQLError) {
  return {
    message: err.message,
    path: err.path,
    extensions: err.extensions,
  };
}


