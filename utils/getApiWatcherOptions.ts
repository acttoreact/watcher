import path from 'path';

import { WatcherOptions } from '../model/watcher';
import handler from './handler';
import onError from './onError';
import onReady from './onReady';

/**
 * Returns options for API watcher
 * @param serverPath main path containing `api` folder
 */
const getApiWatcherOptions = (serverPath: string): WatcherOptions => {
  return {
    handler,
    onError,
    onReady,
    targetPath: path.resolve(serverPath, 'api'),
  };
};

export default getApiWatcherOptions;
