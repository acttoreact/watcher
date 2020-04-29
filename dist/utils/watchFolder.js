"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const chokidar_1 = __importDefault(require("chokidar"));
const fs_1 = __importDefault(require("./fs"));
/**
 * Watch project API folder recursively for files changes
 *
 * @param {WatcherOptions} watcherOptions
 */
const watchFolder = async (watcherOptions) => new Promise((resolve, reject) => {
    const { targetPath, handler, onReady, onError, options } = watcherOptions;
    const normalizedTargetPath = path_1.default.normalize(targetPath);
    fs_1.default.exists(normalizedTargetPath).then((exists) => {
        if (exists) {
            const watcher = chokidar_1.default.watch(normalizedTargetPath, options);
            watcher.on('all', (eventName, eventPath, stats) => {
                handler(normalizedTargetPath, eventName, eventPath, stats);
            });
            watcher.on('error', onError);
            watcher.on('ready', () => {
                if (onReady) {
                    onReady(normalizedTargetPath, watcher);
                }
                resolve(watcher);
            });
        }
        else {
            reject(new Error(`Provided target path doesn't exist`));
        }
    });
});
exports.default = watchFolder;
//# sourceMappingURL=watchFolder.js.map