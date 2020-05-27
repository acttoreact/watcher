import path from 'path';
import chokidar from 'chokidar';
import { ensureDir } from '@a2r/fs';

import { targetPath, proxyPath } from './settings';
import initWatchers from './utils/initWatchers';
import { isJest } from './tools/isJest';

/**
 * API Watcher process
 */
interface Process {
  type: 'start' | 'stop';
  callback: (watchers: chokidar.FSWatcher[]) => void;
}

const pendingProcesses: Process[] = [];
const serverPath = path.resolve(__dirname, targetPath);
const proxyDestPath = path.resolve(__dirname, proxyPath);

let runningProcess: 'start' | 'stop' = null;

/**
 * Current active watchers
 */
export const activeWatchers: chokidar.FSWatcher[] = [];

/**
 * Executes pending processes
 */
const executeProcess = async (): Promise<void> => {
  if (!runningProcess) {
    const pendingProcess = pendingProcesses.shift();
    if (pendingProcess) {
      const { type, callback } = pendingProcess;
      runningProcess = type;
      if (activeWatchers.length) {
        await Promise.all(
          activeWatchers.map(async (watcher) => {
            await watcher.close();
          }),
        );
        activeWatchers.splice(0, activeWatchers.length);
      }
      if (type === 'start') {
        const watchers = await initWatchers(serverPath, __dirname);
        activeWatchers.push(...watchers);
      }
      callback(activeWatchers);
      runningProcess = null;
      executeProcess();
    }
  }
};

/**
 * Adds a new process to queue
 */
const addProcessToQueue = (
  type: 'start' | 'stop',
  callback?: (watchers: chokidar.FSWatcher[]) => void,
): void => {
  pendingProcesses.push({ type, callback });
  executeProcess();
};

/**
 * Stops watchers
 */
export const stop = (): Promise<void> =>
  new Promise((resolve) => {
    addProcessToQueue('stop', () => {
      resolve();
    });
  });

/**
 * Starts watchers
 */
export const start = async (): Promise<chokidar.FSWatcher[]> =>
  new Promise((resolve) => {
    addProcessToQueue('start', (watchers) => {
      resolve(watchers);
    });
  });

/**
 * Restarts watchers
 */
export const restart = start;

/**
 * Inits watchers by ensuring destination path and running start process
 */
const init = async (): Promise<void> => {
  await ensureDir(proxyDestPath);
  await start();
};

if (!isJest()) {
  init();
}
