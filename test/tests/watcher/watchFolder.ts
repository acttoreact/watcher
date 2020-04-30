import path from 'path';
import chokidar from 'chokidar';

import handler from '../../../utils/handler';
import onError from '../../../utils/onError';
import watchFolder from '../../../utils/watchFolder';
import { WatcherOptions } from '../../../model/watcher';

/**
 * Type used to omit props from interface
 */
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * WathcerOptions without `targetPath` property for testing purposes
 */
type WatcherOptionsWithoutPath = Omit<WatcherOptions, 'targetPath'>;

/**
 * Common watcher options
 */
const commonOptions: WatcherOptionsWithoutPath = {
  handler,
  onError,
}

/**
 * Creating watcher for an unexisting folder will throw exception
 */
test('Unexisting target path will throw exception', (): Promise<void> => {
  const wrongPath = '/wrong/path/to/server/api';
  const options: WatcherOptions = {
    ...commonOptions,
    targetPath: wrongPath,
  };
  expect.assertions(1);
  return expect(watchFolder(options)).rejects.toBeInstanceOf(Error);
});

/**
 * Creating watcher for an existing folder will work as expected and return a watcher instance
 */
test(`Existing target path won't throw exception`, (): Promise<void> => {
  const rightPath = path.resolve(__dirname, '../../mocks/server/api');
  const options: WatcherOptions = {
    ...commonOptions,
    targetPath: rightPath,
    onReady: (watcher, targetPath): void => {
      expect(watcher).toBeInstanceOf(chokidar.FSWatcher);
      expect(watcher).toHaveProperty('close');
      expect(watcher.close()).resolves.toBe(undefined);
      expect(targetPath).toEqual(rightPath);
    },
  };
  expect.assertions(5);
  return expect(watchFolder(options)).resolves.toBeInstanceOf(chokidar.FSWatcher);
});

/**
 * Checking `onReady` option can be optional
 */
test(`onReady param is optional`, (): Promise<void> => {
  const rightPath = path.resolve(__dirname, '../../mocks/server/api');
  const options: WatcherOptions = {
    ...commonOptions,
    targetPath: rightPath,
  };
  expect.assertions(3);
  return watchFolder(options).then((watcher): void => {
    expect(watcher).toBeInstanceOf(chokidar.FSWatcher);
    expect(watcher).toHaveProperty('close');
    expect(watcher.close()).resolves.toBe(undefined);
  });
});
