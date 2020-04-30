import { OnReady } from '../model/watcher';

/**
 * Handler called when watcher is ready
 * @param _watcher chokidar watcher instance
 * @param targetPath path that watcher was created for
 */
const onReady: OnReady = (_watcher, targetPath) => {
  // eslint-disable-next-line no-console
  console.log('Watcher ready at', targetPath);
};

export default onReady;
