import chokidar from 'chokidar';

import { exists } from './fs';
import watchFolder from './watchFolder';
import getApiWatcherOptions from './getApiWatcherOptions';
import getModelWatcherOptions from './getModelWatcherOptions';

/**
 * Starts watchers
 * @param serverPath Server main path (containing api and model)
 */
const initWatchers = async (serverPath: string): Promise<chokidar.FSWatcher[]> => {
  const pathExists = await exists(serverPath);
  if (!pathExists) {
    throw new Error(`Provided server path doesn't exist`);
  }
  // eslint-disable-next-line no-console
  console.log('Starting watchers');
  const apiWatcherOptions = getApiWatcherOptions(serverPath);
  const modelWatcherOptions = getModelWatcherOptions(serverPath);
  const apiWatcher = await watchFolder(apiWatcherOptions);
  const modelWatcher = await watchFolder(modelWatcherOptions);
  return [apiWatcher, modelWatcher];
};

export default initWatchers;
