import path from 'path';
import chokidar from 'chokidar';

import handler from '../../../utils/handler';
import onError from '../../../utils/onError';
import watchFolder from '../../../utils/watchFolder';
import { WatcherOptions } from '../../../model/watcher';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type WatcherOptionsWithoutPath = Omit<WatcherOptions, 'targetPath'>;

const commonOptions: WatcherOptionsWithoutPath = {
  handler,
  onError,
}

test('Unexisting target path will throw exception', (): Promise<void> => {
  const wrongPath = '/wrong/path/to/server/api';
  const options: WatcherOptions = {
    ...commonOptions,
    targetPath: wrongPath,
  };
  expect.assertions(1);
  return expect(watchFolder(options)).rejects.toBeInstanceOf(Error);
});

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
