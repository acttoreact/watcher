import path from 'path';
import chokidar from 'chokidar';
import { out } from '@a2r/telemetry';
import { exists, emptyFolder } from '@a2r/fs';

import { WatcherOptions, OnReady } from '../model/watcher';

import { apiPath, modelPath, proxyPath, proxies } from '../settings';
import { fullPath } from '../tools/colors';
import watchFolder from './watchFolder';
import onError from './onError';
import Validator from './runtimeValidator';
import apiFileValidation from './apiFileValidation';
import onApiValidation from './onApiValidation';
import modelFileValidation from './modelFileValidation';
import onModelValidation from './onModelValidation';

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
    const error = `Provided server path doesn't exist: ${fullPath(serverPath)}`;
    out.error(error);
    throw new Error(error);
  }

  const proxyTargetPath = path.resolve(mainPath, proxyPath);

  const apiSourcePath = path.resolve(serverPath, apiPath);
  await Promise.all(
    proxies.map((proxy) =>
      emptyFolder(path.resolve(proxyTargetPath, proxy, apiPath)),
    ),
  );
  const onApiWatcherReady: OnReady = async (
    watcher,
    targetPath,
  ): Promise<void> => {
    out.info(`API watcher running at path: ${fullPath(apiSourcePath)}`);
    const validator = new Validator(
      apiFileValidation,
      onApiValidation,
      targetPath,
      proxyTargetPath,
    );
    watcher.on('all', (eventName, eventPath): void => {
      validator.addFileToQueue({ targetPath: eventPath, type: eventName });
    });
  };
  const apiWatcherOptions: WatcherOptions = {
    onError,
    targetPath: apiSourcePath,
    onReady: onApiWatcherReady,
  };
  const apiWatcher = await watchFolder(apiWatcherOptions);

  const modelSourcePath = path.resolve(serverPath, modelPath);
  await Promise.all(
    proxies.map((proxy) =>
      emptyFolder(path.resolve(proxyTargetPath, proxy, modelPath)),
    ),
  );
  const onModelWatcherReady: OnReady = async (
    watcher,
    targetPath,
  ): Promise<void> => {
    out.info(`Model watcher running at path: ${fullPath(proxyTargetPath)}`);
    const validator = new Validator(
      modelFileValidation,
      onModelValidation,
      targetPath,
      proxyTargetPath,
    );
    watcher.on('all', (eventName, eventPath): void => {
      validator.addFileToQueue({ targetPath: eventPath, type: eventName });
    });
  };
  const modelWatcherOptions: WatcherOptions = {
    onError,
    targetPath: modelSourcePath,
    onReady: onModelWatcherReady,
  };
  const modelWatcher = await watchFolder(modelWatcherOptions);

  return [apiWatcher, modelWatcher];
};

export default initWatchers;
