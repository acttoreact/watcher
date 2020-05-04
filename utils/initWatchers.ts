import path from 'path';
import chokidar from 'chokidar';

import { WatcherOptions } from '../model/watcher';

import { apiPath, modelPath, runtimePath } from '../settings';
import { exists, emptyFolder } from '../tools/fs';
import watchFolder from './watchFolder';
import onError from './onError';
import getOnApiWatcherReady from './getOnApiWatcherReady';

/**
 * Starts watchers
 * @param serverPath server main path (containing api and model)
 */
const initWatchers = async (
  serverPath: string,
  mainPath: string,
): Promise<chokidar.FSWatcher[]> => {
  const pathExists = await exists(serverPath);
  if (!pathExists) {
    throw new Error(`Provided server path doesn't exist`);
  }

  const apiTargetPath = path.resolve(serverPath, apiPath);
  const apiRuntimePath = path.resolve(mainPath, runtimePath, apiPath);
  await emptyFolder(apiRuntimePath);
  const onApiWatcherReady = getOnApiWatcherReady(apiRuntimePath);
  const apiWatcherOptions: WatcherOptions = {
    onError,
    targetPath: apiTargetPath,
    onReady: onApiWatcherReady,
  };
  const apiWatcher = await watchFolder(apiWatcherOptions);

  const modelTargetPath = path.resolve(serverPath, modelPath);
  const modelRuntimePath = path.resolve(mainPath, runtimePath, modelPath);
  await emptyFolder(modelRuntimePath);
  const onModelWatcherReady = getOnApiWatcherReady(modelRuntimePath);
  const modelWatcherOptions: WatcherOptions = {
    onError,
    targetPath: modelTargetPath,
    onReady: onModelWatcherReady,
  };
  const modelWatcher = await watchFolder(modelWatcherOptions);

  return [apiWatcher, modelWatcher];
};

export default initWatchers;
