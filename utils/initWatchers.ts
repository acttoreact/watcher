import path from 'path';
import chokidar from 'chokidar';
import { out } from '@a2r/telemetry';

import { WatcherOptions, OnReady } from '../model/watcher';

import { apiPath, modelPath, proxyPath } from '../settings';
import { exists, emptyFolder } from '../tools/fs';
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
  const apiProxyPath = path.resolve(proxyTargetPath, apiPath);
  await emptyFolder(apiProxyPath);
  const onApiWatcherReady: OnReady = async (
    watcher,
    targetPath,
  ): Promise<void> => {
    out.verbose(`API proxy path: ${fullPath(apiProxyPath)}`);
    const validator = new Validator(
      apiFileValidation,
      onApiValidation,
      targetPath,
      apiProxyPath,
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
  const modelProxyPath = path.resolve(proxyTargetPath, modelPath);
  await emptyFolder(modelProxyPath);
  const onModelWatcherReady: OnReady = async (
    watcher,
    targetPath,
  ): Promise<void> => {
    out.verbose(`Model proxy path: ${fullPath(modelProxyPath)}`);
    const validator = new Validator(
      modelFileValidation,
      onModelValidation,
      targetPath,
      modelProxyPath,
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
