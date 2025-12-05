// server/src/graphql/index.ts
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import path from "path";
import { fileURLToPath } from "url";
import billableItemResolvers from "./resolvers/billable_item.js";
import { clientResolvers } from "./resolvers/client.js";
import { projectResolvers } from "./resolvers/project.js";
import { quoteResolvers } from "./resolvers/quote.js";
import { invoiceResolvers } from "./resolvers/invoice.js";
import { taskResolvers } from "./resolvers/task.js";
import { expenseResolvers } from "./resolvers/expense.js";
import { timeLogResolvers } from "./resolvers/timelog.js";
import { reportingResolvers } from "./resolvers/reporting.js";
import { paymentResolvers } from "./resolvers/payment.js";
import { meResolvers } from "./resolvers/me.js";
import { authResolvers } from "./resolvers/auth.js";
import { userResolvers } from "./resolvers/user.js";
import { dateTimeScalar } from "./scalars/dateTime.js";
import { invoiceSettingsResolvers } from "./resolvers/invoiceSettings.js";
import { businessResolvers } from "./resolvers/business.js";
import { GraphQLJSON } from "graphql-type-json";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const typesArray = loadFilesSync(path.join(__dirname, "./schemas"), {
    extensions: ["graphql"],
});
export const typeDefs = mergeTypeDefs(typesArray);
// ✅ FIX: Scalars must be wrapped inside one resolvers object
const scalarResolvers = {
    DateTime: dateTimeScalar,
    JSON: GraphQLJSON,
};
const resolverModules = [
    scalarResolvers, // <-- FIX
    meResolvers,
    authResolvers,
    userResolvers,
    clientResolvers,
    projectResolvers,
    quoteResolvers,
    invoiceResolvers,
    taskResolvers,
    expenseResolvers,
    timeLogResolvers,
    paymentResolvers,
    reportingResolvers,
    billableItemResolvers,
    invoiceSettingsResolvers,
    businessResolvers,
];
export const resolvers = mergeResolvers(resolverModules.filter(Boolean));
//# sourceMappingURL=index.js.map