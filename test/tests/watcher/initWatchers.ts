import path from 'path';
import chokidar from 'chokidar';

import { targetPath } from '../../../settings';
import initWatchers from '../../../utils/initWatchers';

/**
 * Unexisting server path will throw exception
 */
test('Unexisting server path will throw exception', (): Promise<void> => {
  const wrongPath = '/wrong/path/to/server';
  expect.assertions(1);
  return expect(initWatchers(wrongPath, wrongPath)).rejects.toBeInstanceOf(Error);
});

/**
 * Server path must exist
 */
test(`Existing server path won't throw exception`, async (): Promise<void> => {
  const mainPath = path.resolve(__dirname, '../../mocks');
  const rightPath = path.resolve(mainPath, targetPath);
  const watchers = await initWatchers(rightPath, mainPath);
  watchers.map((res) => expect(res).toBeInstanceOf(chokidar.FSWatcher));
  expect(watchers.length).toBe(2);
  await Promise.all(watchers.map(async (watcher) => {
    await watcher.close();
  }));
});
