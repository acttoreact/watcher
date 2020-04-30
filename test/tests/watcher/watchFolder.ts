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
test('Unexisting target path will throw exception', (): void => {
  const wrongPath = '/wrong/path/to/server/api';
  const options: WatcherOptions = {
    ...commonOptions,
    targetPath: wrongPath,
  };
  expect(watchFolder(options)).rejects.toBeInstanceOf(Error);
});

/**
 * Creating watcher for an existing folder will work as expected and return a watcher instance
 */
test(`Existing target path won't throw exception`, async (): Promise<void> => {
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
  const watcher = await watchFolder(options);
  expect(watcher).toBeInstanceOf(chokidar.FSWatcher);
});

/**
 * Checking `onReady` option can be optional
 */
test(`onReady param is optional`, async (): Promise<void> => {
  const rightPath = path.resolve(__dirname, '../../mocks/server/api');
  const options: WatcherOptions = {
    ...commonOptions,
    targetPath: rightPath,
  };
  const watcher = await watchFolder(options);
  expect(watcher).toBeInstanceOf(chokidar.FSWatcher);
  expect(watcher).toHaveProperty('close');
  expect(watcher.close()).resolves.toBe(undefined);
});

/**
 * Watcher error handler shouldn't throw error
 */
test(`onError doesn't throw error`, async (): Promise<void> => {
  expect(onError).toBeInstanceOf(Function);
  expect(() => {
    onError(new Error('Test error'));
  }).not.toThrowError();
});
