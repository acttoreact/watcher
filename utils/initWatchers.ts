import chokidar from 'chokidar';

import { exists } from '../tools/fs';
import watchFolder from './watchFolder';
import getApiWatcherOptions from './getApiWatcherOptions';
import getModelWatcherOptions from './getModelWatcherOptions';

/**
 * Starts watchers
 * @param serverPath server main path (containing api and model)
 */
const initWatchers = async (serverPath: string, mainPath: string): Promise<chokidar.FSWatcher[]> => {
  const pathExists = await exists(serverPath);
  if (!pathExists) {
    throw new Error(`Provided server path doesn't exist`);
  }
  const apiWatcherOptions = getApiWatcherOptions(serverPath, mainPath);
  const modelWatcherOptions = getModelWatcherOptions(serverPath, mainPath);
  const apiWatcher = await watchFolder(apiWatcherOptions);
  const modelWatcher = await watchFolder(modelWatcherOptions);
  return [apiWatcher, modelWatcher];
};

export default initWatchers;
