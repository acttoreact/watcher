import path from 'path';
import chokidar from 'chokidar';

import fs from './fs';
import { WatcherOptions } from '../model/watcher';

/**
 * Watch project API folder recursively for files changes
 *
 * @param {WatcherOptions} watcherOptions
 */
const watchFolder = async (watcherOptions: WatcherOptions): Promise<void> =>
  new Promise(
    (resolve): void => {
      const { targetPath, handler, onReady, onError, options } = watcherOptions;
      const normalizedTargetPath = path.normalize(targetPath);
      fs.exists(normalizedTargetPath).then((exists): void => {
        if (!exists) {
          throw new Error(`Provided target path doesn't exist`);
        }

        const watcher = chokidar.watch(normalizedTargetPath, options);
        watcher.on('all', (eventName, eventPath, stats): void => {
          handler(normalizedTargetPath, eventName, eventPath, stats);
        });
        watcher.on('error', onError);
        watcher.on('ready', (): void => {
          if (onReady) {
            onReady(normalizedTargetPath);
          }
          resolve();
        });
      });
    },
  );

  export default watchFolder;
