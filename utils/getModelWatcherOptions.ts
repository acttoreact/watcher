import path from 'path';

import { WatcherOptions } from '../model/watcher';
import handler from './handler';
import onError from './onError';
import onReady from './onReady';

/**
 * Returns options for model watcher
 * @param serverPath main path containing `model` folder
 */
const getModelWatcherOptions = (serverPath: string): WatcherOptions => {
  return {
    handler,
    onError,
    onReady,
    targetPath: path.resolve(serverPath, 'model'),
  };
};

export default getModelWatcherOptions;
