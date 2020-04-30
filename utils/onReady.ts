import chalk from 'chalk';

import { OnReady } from '../model/watcher';
import out from '../tools/out';
import { fullPath } from '../tools/colors';

/**
 * Handler called when watcher is ready
 * @param _watcher chokidar watcher instance
 * @param targetPath path that watcher was created for
 */
const onReady: OnReady = (_watcher, targetPath): void => {
  out.info(`Watcher ${chalk.green('ready')} at ${fullPath(targetPath)}`);
};

export default onReady;
