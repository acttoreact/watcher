import path from 'path';
import waitForExpect from 'wait-for-expect';

import { apiPath } from '../../../settings';
import onError from '../../../utils/onError';
import watchFolder from '../../../utils/watchFolder';
import getOnApiWatcherReady from '../../../utils/getOnApiWatcherReady';
import { exists, rimraf, emptyFolder, writeFile, unlink, ensureDir } from '../../../tools/fs';

const runtimePath = '.a2r-unlink/runtime';

const mainPath = path.resolve(__dirname, '../../mocks');
const targetPath = path.resolve(__dirname, '../../mocks/server/unlink-api');
const subFolderPath = path.resolve(targetPath, 'folder');
const fileName = 'unlink-documented.ts';
const documentedFilePath = path.resolve(targetPath, fileName);
const subFolderDocumentedFilePath = path.resolve(subFolderPath, fileName);
const runtimeDestPath = path.resolve(mainPath, runtimePath);
const runtimeApiDestPath = path.resolve(runtimeDestPath, apiPath);
const expectedApiFilePath = path.resolve(runtimeApiDestPath, fileName);
const expectedApiSubFolderFilePath = path.resolve(runtimeApiDestPath, 'folder', fileName);

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
 * Basic API Watcher unlink flow should cover unlink and unlinkDir event types
 */
test(`Basic API Watcher unlink flow`, async (): Promise<void> => {
  await rimraf(runtimeDestPath);
  const onApiWatcherReady = getOnApiWatcherReady(runtimeApiDestPath);
  const jestOnReady = jest.fn(onApiWatcherReady);
  await writeFile(documentedFilePath, validatedFileContent);
  await ensureDir(subFolderPath);
  await writeFile(subFolderDocumentedFilePath, validatedFileContent);
  const watcher = await watchFolder({
    onError,
    targetPath,
    onReady: jestOnReady,
  });
  await waitForExpect(
    async (): Promise<void> => {
      expect(jestOnReady).toHaveBeenCalled();
      expect(await exists(expectedApiFilePath)).toBe(true);
      expect(await exists(expectedApiSubFolderFilePath)).toBe(true);
    },
  );
  setTimeout(async (): Promise<void> => {
    await unlink(documentedFilePath);
    await rimraf(subFolderPath);
  }, 1000);
  await waitForExpect(
    async (): Promise<void> => {
      expect(await exists(documentedFilePath)).toBe(false);
      expect(await exists(subFolderPath)).toBe(false);
      expect(await exists(expectedApiFilePath)).toBe(false);
      expect(await exists(expectedApiSubFolderFilePath)).toBe(false);
    },
  );
  await watcher.close();
});

afterAll(async (): Promise<void> => {
  await emptyFolder(targetPath);
  await emptyFolder(runtimeApiDestPath);
});
