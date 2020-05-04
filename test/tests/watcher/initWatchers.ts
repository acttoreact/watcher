import path from 'path';
import waitForExpect from 'wait-for-expect';

import { runtimePath, apiPath, modelPath } from '../../../settings';
import initWatchers from '../../../utils/initWatchers';
import { exists, rimraf } from '../../../tools/fs';

const mainPath = path.resolve(__dirname, '../../mocks');

/**
 * Unexisting server path will throw exception
 */
test('Unexisting server path will throw exception', (): Promise<void> => {
  const wrongPath = '/wrong/path/to/server';
  expect.assertions(1);
  return expect(initWatchers(wrongPath, wrongPath)).rejects.toBeInstanceOf(
    Error,
  );
});

/**
 * Server path must exist and watcher should process existing files
 */
test(`Watchers should work for existing server path and process existing files when starting`, async (): Promise<
  void
> => {
  const workingPath = path.resolve(mainPath, 'working-server');
  const runtimeDestPath = path.resolve(mainPath, runtimePath);
  const expectedApiFilePath = path.resolve(
    runtimeDestPath,
    apiPath,
    'documented.ts',
  );
  const expectedModelFilePath = path.resolve(
    runtimeDestPath,
    modelPath,
    'documented.ts',
  );
  await rimraf(runtimeDestPath);
  const watchers = await initWatchers(workingPath, mainPath);
  await waitForExpect(
    async (): Promise<void> => {
      expect(await exists(expectedApiFilePath)).toBe(true);
      expect(await exists(expectedModelFilePath)).toBe(true);
    },
  );
  await Promise.all(
    watchers.map(async watcher => {
      await watcher.close();
    }),
  );
});
