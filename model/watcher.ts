import fs from 'fs';
import chokidar from 'chokidar';

/**
 * Watcher options
 */
export interface WatcherOptions {
  /**
   * Path that should be watched for changes
   * @type {string}
   * @memberof WatcherOptions
   */
  targetPath: string;
  /**
   * Detected changes handler
   * @memberof WatcherOptions
   */
  handler: (
    /**
     * Path that was passed to watcher as `targetPath`
     */
    targetPath: string,
    /**
     * Event name
     */
    eventName: 'add' |  'addDir' |  'change' |  'unlink' |  'unlinkDir',
    /**
     * Event path origin
     */
    eventPath: string,
    /**
     * Path stats (if requested)
     */
    stats?: fs.Stats | undefined,
  ) => void;
  /**
   * Errors handler
   * @memberof WatcherOptions
   */
  onError: (er: Error) => void | Promise<void>;
  /**
   * Method called once internal watcher (chokidar) is ready
   * @memberof WatcherOptions
   */
  onReady?: (
    targetPath: string,
    watcher: chokidar.FSWatcher,
  ) => void | Promise<void>;
  /**
   * Internal watcher options:
   * WatchOptions from [chokidar](https://github.com/paulmillr/chokidar#api)
   * @type {chokidar.WatchOptions}
   * @memberof WatcherOptions
   */
  options?: chokidar.WatchOptions;
}