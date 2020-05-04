import path from 'path';
import waitForExpect from 'wait-for-expect';

import { apiPath } from '../../../settings';
import onError from '../../../utils/onError';
import watchFolder from '../../../utils/watchFolder';
import getOnApiWatcherReady from '../../../utils/getOnApiWatcherReady';
import { exists, rimraf, emptyFolder, writeFile } from '../../../tools/fs';

const runtimePath = '.a2r-add/runtime';

const mainPath = path.resolve(__dirname, '../../mocks');
const targetPath = path.resolve(__dirname, '../../mocks/server/right');
const fileName = 'documented.ts';
const documentedFilePath = path.resolve(targetPath, fileName);
const runtimeDestPath = path.resolve(mainPath, runtimePath);
const runtimeApiDestPath = path.resolve(runtimeDestPath, apiPath);
const expectedApiFilePath = path.resolve(runtimeApiDestPath, fileName);

const validatedFileContent = `/**
 * Method documentation
 */
const method = (): void => {
  // Do stuff
};

export default method;`;

beforeAll(async (): Promise<void> => {
  await emptyFolder(targetPath);
  await emptyFolder(runtimeApiDestPath);
});

/**
 * Once watcher is ready and a new file is added, it should be processed
 */
test(`Watcher should process a file when added`, async (): Promise<
  void
> => {
  await rimraf(runtimeDestPath);
  const onApiWatcherReady = getOnApiWatcherReady(runtimeApiDestPath);
  const jestOnReady = jest.fn(onApiWatcherReady);
  const watcher = await watchFolder({
    onError,
    targetPath,
    onReady: jestOnReady,
  });
  await waitForExpect(
    async (): Promise<void> => {
      expect(jestOnReady).toHaveBeenCalled();
    },
  );
  setTimeout(async (): Promise<void> => {
    await writeFile(documentedFilePath, validatedFileContent);
  }, 1000);
  await waitForExpect(
    async (): Promise<void> => {
      expect(await exists(documentedFilePath)).toBe(true);
      expect(await exists(expectedApiFilePath)).toBe(true);
    },
  );
  await watcher.close();
});

afterAll(async (): Promise<void> => {
  await emptyFolder(targetPath);
  await emptyFolder(runtimeApiDestPath);
});

