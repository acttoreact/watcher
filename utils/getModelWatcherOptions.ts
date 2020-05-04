import path from 'path';

import { WatcherOptions } from '../model/watcher';
import { handler, setup } from './modelHandler';
import onError from './onError';
import onReady from './onReady';
import { modelPath } from '../settings';

/**
 * Returns options for model watcher
 * @param serverPath main path containing `model` folder
 */
const getModelWatcherOptions = (serverPath: string, mainPath: string): WatcherOptions => {
  return {
    mainPath,
    handler,
    onError,
    onReady: (watcher, targetPath): void => {
      onReady(watcher, targetPath);
      setup();
    },
    targetPath: path.resolve(serverPath, modelPath),
  };
};

export default getModelWatcherOptions;
