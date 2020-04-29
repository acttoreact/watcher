import path from 'path';
import chokidar from 'chokidar';

import { exists } from './fs';
import { WatcherOptions } from '../model/watcher';

/**
 * Watch project API folder recursively for files changes
 *
 * @param {WatcherOptions} watcherOptions
 */
const watchFolder = async (watcherOptions: WatcherOptions): Promise<chokidar.FSWatcher> =>
  new Promise(
    (resolve, reject): void => {
      const { targetPath, handler, onReady, onError, options } = watcherOptions;
      const normalizedTargetPath = path.normalize(targetPath);
      exists(normalizedTargetPath).then((pathExists): void => {
        if (pathExists) {
          const watcher = chokidar.watch(normalizedTargetPath, options);
          watcher.on('all', (eventName, eventPath, stats): void => {
            handler(normalizedTargetPath, eventName, eventPath, stats);
          });
          watcher.on('error', onError);
          watcher.on('ready', (): void => {
            if (onReady) {
              onReady(normalizedTargetPath, watcher);
            }
            resolve(watcher);
          });  
        } else {
          reject(new Error(`Provided target path doesn't exist`));
        }
      });
    },
  );

  export default watchFolder;
