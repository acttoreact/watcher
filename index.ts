import path from 'path';
import chokidar from 'chokidar';

import initWatchers from './utils/initWatchers';

const serverPath = path.resolve(__dirname, './server');
export const activeWatchers: chokidar.FSWatcher[] = [];
// const activePromises = [];

export const stop = async (): Promise<void> => {
  await Promise.all(activeWatchers.slice().map(async (watcher, i) => {
    await watcher.close();
    activeWatchers.splice(i, 1);
  }));
};

export const start = async (): Promise<chokidar.FSWatcher[]> => {
  if (activeWatchers.length) {
    await stop();
  }
  const watchers = await initWatchers(serverPath);
  activeWatchers.push(...watchers);
  return activeWatchers;
};

export const restart = async (): Promise<chokidar.FSWatcher[]> => {
  await stop();
  return start();
};

start();
