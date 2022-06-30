export function parseError(err) {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
        if ((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error)
            return err.response.data.error;
        if (((_c = err.response) === null || _c === void 0 ? void 0 : _c.data) && ((_d = err.response.data) === null || _d === void 0 ? void 0 : _d.length) < 50)
            return err.response.data;
        if ((_e = err.response) === null || _e === void 0 ? void 0 : _e.statusText)
            return `${(_f = err.response) === null || _f === void 0 ? void 0 : _f.status} ${(_g = err.response) === null || _g === void 0 ? void 0 : _g.statusText}`;
        else
            return "An error occurred.";
    }
    catch (_h) {
        return "An error occurred.";
    }
}
//# sourceMappingURL=parseError.js.map