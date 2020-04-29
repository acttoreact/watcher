"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
/**
 * Asynchronously tests whether or not the given path exists by checking with the file system.
 * @param path A path to a file or directory. If a URL is provided, it must use the `file:` protocol. URL support is experimental.
 */
exports.exists = (path) => new Promise((resolve) => {
    fs_1.default.access(path, fs_1.default.constants.F_OK, (err) => {
        if (err) {
            return resolve(false);
        }
        return resolve(true);
    });
});
exports.default = {
    exists: exports.exists,
};
//# sourceMappingURL=fs.js.map