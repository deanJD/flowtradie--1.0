// server/src/utils/logger.ts
export const debugLog = (...args) => {
    if (process.env.NODE_ENV === "development") {
        console.log(...args);
    }
};
//# sourceMappingURL=logger.js.map