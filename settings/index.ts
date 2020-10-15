import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

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
export const proxyPath = '.a2r';

/**
 * Needed proxies (one for each project in solution)
 */
export const proxies = process.env.PROXIES.split(',');

/**
 * Server URL
 */
export const serverUrl = process.env.SEVER_URL || 'localhost:4000';

/**
 * Session cookie key
 */
export const cookieKey = process.env.COOKIE_KEY || 'a2r_sessionId';

/**
 * User token cookie key
 */
export const userTokenKey = process.env.USER_TOKEN_KEY || 'a2r_userToken';

/**
 * User token cookie key
 */
export const refererKey = process.env.REFERER_KEY || 'a2r_referer';

/**
 * Default socket path
 */
export const socketPath = '/ws';

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
export const defaultProxyTargetPath = path.resolve(process.cwd(), proxyPath);
