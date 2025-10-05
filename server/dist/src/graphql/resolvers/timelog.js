// server/src/graphql/resolvers/timelog.ts
import { timeLogService } from "../../services/timelog.service.js";
export const timeLogResolvers = {
    Query: {
        timeLogsForProject: (_p, { projectId }, ctx) => timeLogService.getAllByProject(projectId, ctx),
        timeLogsForUser: (_p, { userId }, ctx) => timeLogService.getAllByUser(userId, ctx),
    },
    Mutation: {
        createTimeLog: (_p, { input }, ctx) => timeLogService.create(input, ctx),
        updateTimeLog: (_p, { id, input }, ctx) => timeLogService.update(id, input, ctx),
        deleteTimeLog: (_p, { id }, ctx) => timeLogService.delete(id, ctx),
    },
    // Note: The relational resolvers for `TimeLog.project` and `TimeLog.user`
    // are no longer needed because our new service functions automatically
    // include that data.
};
//# sourceMappingURL=timelog.js.map