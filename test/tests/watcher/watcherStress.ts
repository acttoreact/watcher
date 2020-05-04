import path from 'path';
import waitForExpect from 'wait-for-expect';

import { apiPath } from '../../../settings';
import { emptyFolder, writeFile, exists, rimraf } from '../../../tools/fs';
import getOnApiWatcherReady from '../../../utils/getOnApiWatcherReady';
import watchFolder from '../../../utils/watchFolder';
import onError from '../../../utils/onError';

const runtimePath = '.a2r-stress/runtime';

const targetPath = path.resolve(__dirname, '../../mocks/server/stressing-api');
const mainPath = path.resolve(__dirname, '../../mocks');
const runtimeDestPath = path.resolve(mainPath, runtimePath, apiPath);

const lastFileName = 'validated-final.ts';
const lastFilePath = path.resolve(targetPath, lastFileName);
const lastFileDestPath = path.resolve(mainPath, runtimePath, apiPath, lastFileName);

const validatedFileContent = `/**
 * Method documentation
 */
const method = (): void => {
  // Do stuff
};

export default method;`;

beforeAll(
  async (): Promise<void> => {
    await emptyFolder(targetPath);
    await emptyFolder(runtimeDestPath);
  },
);

const writeAndChangeFiles = async (nFiles = 5): Promise<void> => {
  const files = new Array(nFiles)
    .fill(null)
    .map((_val, i) => path.resolve(targetPath, `validated-${i}.ts`));
  await Promise.all(
    files.map((file) =>
      writeFile(
        file,
        `${validatedFileContent}${Math.random() < 0.5 ? '\n' : '\n\n'}`,
      ),
    ),
  );
};

/**
 * Basic API Watcher should work
 */
test(`API should work fine with multiple file changes`, async (): Promise<
  void
> => {
  await rimraf(runtimeDestPath);
  const onApiWatcherReady = getOnApiWatcherReady(runtimeDestPath);
  const jestOnReady = jest.fn(onApiWatcherReady);
  const nFiles = 5;
  const files = new Array(nFiles)
    .fill(null)
    .map((_val, i) => path.resolve(targetPath, `validated-${i}.ts`));

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
  await Promise.all(files.map((file) => writeFile(file, validatedFileContent)));
  await Promise.all(
    files.map((file) =>
      waitForExpect(
        async (): Promise<void> => {
          expect(await exists(file)).toBe(true);
        },
      ),
    ),
  );
  setTimeout(async function writeFiles(): Promise<void> {
    await writeAndChangeFiles(nFiles);
    setTimeout(async function closeWatcher(): Promise<void> {
      writeFile(lastFilePath, validatedFileContent)
    }, 2000);
  }, 2000);
  await waitForExpect(
    async (): Promise<void> => {
      expect(await exists(lastFilePath)).toBe(true);
      expect(await exists(lastFileDestPath)).toBe(true);
    },
    15000,
  );
  await watcher.close();
}, 25000);

afterAll(
  async (): Promise<void> => {
    await emptyFolder(targetPath);
    await emptyFolder(runtimeDestPath);
  },
);
