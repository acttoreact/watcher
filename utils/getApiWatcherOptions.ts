import path from 'path';

import { WatcherOptions } from '../model/watcher';
import handler from './handler';
import onError from './onError';
import onReady from './onReady';

const getApiWatcherOptions = (serverPath: string): WatcherOptions => {
  return {
    handler,
    onError,
    onReady,
    targetPath: path.resolve(serverPath, 'api'),
  };
};

export default getApiWatcherOptions;
