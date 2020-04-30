import path from 'path';

import { WatcherOptions } from '../model/watcher';
import { handler, setup } from './apiHandler';
import onError from './onError';
import onReady from './onReady';
import { apiPath } from '../settings';

/**
 * Returns options for API watcher
 * @param serverPath main path containing `api` folder
 */
const getApiWatcherOptions = (serverPath: string, mainPath: string): WatcherOptions => {
  return {
    mainPath,
    handler,
    onError,
    onReady: (watcher, targetPath): void => {
      onReady(watcher, targetPath);
      setup(targetPath, mainPath);
    },
    targetPath: path.resolve(serverPath, apiPath),
  };
};

export default getApiWatcherOptions;
