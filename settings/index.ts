import path from 'path';

/**
 * Default target path for watchers, should contain `api` and `model` folders
 */
export const targetPath = 'server';

/**
 * Default api path inside main target path
 */
export const apiPath = 'api';

/**
 * Default model path inside main target path
 */
export const modelPath = 'model';

/**
 * Default proxy target path, where watcher will generate proxy for API and Model
 */
export const proxyPath = '.a2r/proxy';

/**
 * Default socket path
 */
export const socketPath = '/ws';

/**
 * Default socket port
 */
export const socketPort = 4000;

/**
 * Default API source path
 */
export const defaultApiSourcePath = path.resolve(process.cwd(), targetPath, apiPath);

/**
 * Default Model source path
 */
export const defaultModelSourcePath = path.resolve(process.cwd(), targetPath, apiPath);

/**
 * Default proxy target path
 */
export const defaultProxyTargetPath = path.resolve(process.cwd(), proxyPath, apiPath);
