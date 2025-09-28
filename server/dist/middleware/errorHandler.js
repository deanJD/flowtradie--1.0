export function formatError(err) {
    return {
        message: err.message,
        path: err.path,
        extensions: err.extensions,
    };
}
//# sourceMappingURL=errorHandler.js.map