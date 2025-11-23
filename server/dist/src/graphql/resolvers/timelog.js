import * as timeLogService from "../../services/timelog.service.js";
export const timeLogResolvers = {
    Query: {
        // Get all time logs for THIS BUSINESS
        timeLogs: async (_p, _args, ctx) => {
            return (await timeLogService.getAll(ctx));
        },
        // Get single timelog by ID
        timeLog: async (_p, { id }, ctx) => {
            return (await timeLogService.getById(id, ctx));
        },
    },
    Mutation: {
        createTimeLog: async (_p, { input }, ctx) => {
            return (await timeLogService.create(input, ctx));
        },
        updateTimeLog: async (_p, { id, input }, ctx) => {
            return (await timeLogService.update(id, input, ctx));
        },
        deleteTimeLog: async (_p, { id }, ctx) => {
            return (await timeLogService.remove(id, ctx));
        },
    },
};
//# sourceMappingURL=timelog.js.map