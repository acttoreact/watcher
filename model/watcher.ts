import fs from 'fs';
import chokidar from 'chokidar';

/**
 * Watcher events handler
 */
export type Handler = (
  /**
   * Event name
   */
  eventName: 'add' |  'addDir' |  'change' |  'unlink' |  'unlinkDir',
  /**
   * Event path origin
   */
  eventPath: string,
  /**
   * Path that was passed to watcher as `targetPath`
   */
  targetPath: string,
  /**
   * Path stats (if requested)
   */
  stats?: fs.Stats | undefined,
) => Promise<void> | void;

/**
 * Watcher error handler
 */
export type OnError = (
  /**
   * Watcher error
   */
  error: Error,
  /**
   * Chokidar watcher instance
   */
  watcher?: chokidar.FSWatcher,
  /**
   * Target path used to initialize watcher
   */
  targetPath?: string,
) => void;

/**
 * Watcher ready event handler
 */
export type OnReady = (
  /**
   * Chokidar watcher instance
   */
  watcher: chokidar.FSWatcher,
  /**
   * Target path used to initialize watcher
   */
  targetPath: string,
) => void | Promise<void>;

/**
 * On Validation method
 */
export type OnValidation = (
  /**
   * Server path
   */
  serverPath?: string,
  /**
   * Target path
   */
  targetPath?: string,
) => Promise<void> | void;

/**
 * Watcher options
 */
export interface WatcherOptions {
  /**
   * Path that should be watched for changes
   * @memberof WatcherOptions
   */
  targetPath: string;
  /**
   * Errors handler
   * @memberof WatcherOptions
   */
  onError: OnError;
  /**
   * Method called once internal watcher (chokidar) is ready
   * @memberof WatcherOptions
   */
  onReady?: OnReady;
  /**
   * Internal watcher options:
   * WatchOptions from [chokidar](https://github.com/paulmillr/chokidar#api)
   * @memberof WatcherOptions
   */
  options?: chokidar.WatchOptions;
}

/**
 * Process info resulting from watcher event
 */
export interface ProcessInfo {
  /**
   * Event type
   * @memberof ProcessInfo
   */
  type: 'add' |  'addDir' |  'change' |  'unlink' |  'unlinkDir';
  /**
   * Target path
   * @memberof ProcessInfo
   */
  targetPath: string;
}