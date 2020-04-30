import path from 'path';
import chokidar from 'chokidar';

import { targetPath } from './settings';
import initWatchers from './utils/initWatchers';

export const activeWatchers: chokidar.FSWatcher[] = [];

const serverPath = path.resolve(__dirname, targetPath);
interface Process {
  type: 'start' | 'stop';
  callback: (watchers: chokidar.FSWatcher[]) => void;
}
const pendingProcesses: Process[] = [];

let runningProcess: 'start' | 'stop' = null;

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
        const watchers = await initWatchers(serverPath);
        activeWatchers.push(...watchers);
      }
      callback(activeWatchers);
      runningProcess = null;
      executeProcess();
    }
  }
};

const addProcessToQueue = (
  type: 'start' | 'stop',
  callback?: (watchers: chokidar.FSWatcher[]) => void,
): void => {
  pendingProcesses.push({ type, callback });
  executeProcess();
};

export const stop = (): Promise<void> =>
  new Promise((resolve) => {
    addProcessToQueue('stop', () => {
      resolve();
    });
  });

export const start = async (): Promise<chokidar.FSWatcher[]> =>
  new Promise((resolve) => {
    addProcessToQueue('start', (watchers) => {
      resolve(watchers);
    });
  });

export const restart = async (): Promise<chokidar.FSWatcher[]> => start();

start();
