"use strict";
// import path from 'path';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("./fs"));
/**
 * Starts watchers
 * @param serverPath Server main path (containing api and model)
 */
const initWatchers = async (serverPath) => {
    const exists = await fs_1.default.exists(serverPath);
    if (!exists) {
        throw new Error(`Provided server path doesn't exist`);
    }
    console.log('Starting watchers');
    // const apiPath = path.resolve(serverPath, 'api');
    // const modelPath = path.resolve(serverPath, 'api');
};
exports.default = initWatchers;
//# sourceMappingURL=initWatchers.js.map