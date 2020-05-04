import path from 'path';
import waitForExpect from 'wait-for-expect';

import { Omit } from '../../../@types';
import { runtimePath } from '../../../settings';
import { emptyFolder, writeFile, ensureDir, exists } from '../../../tools/fs';
import { handler, setup } from '../../../utils/apiHandler';
import { WatcherOptions } from '../../../model/watcher';
import watchFolder from '../../../utils/watchFolder';
import onError from '../../../utils/onError';

/**
 * WatcherOptions without `targetPath` property for testing purposes
 */
type WatcherOptionsWithoutPath = Omit<WatcherOptions, 'targetPath' | 'handler'>;

/**
 * Common watcher options
 */
const commonOptions: WatcherOptionsWithoutPath = {
  mainPath: path.resolve(__dirname, '../../..'),
  onError,
};

const apiPath = path.resolve(__dirname, '../../mocks/server/stressing-api');
const mainPath = path.resolve(__dirname, '../../mocks');
const runtimeDestPath = path.resolve(mainPath, runtimePath);

const validatedFileContent = `/**
 * Method documentation
 */
const method = (): void => {
  // Do stuff
};

export default method;`;

beforeAll(
  async (): Promise<void> => {
    await emptyFolder(apiPath);
    await emptyFolder(runtimeDestPath);
  },
);

const writeAndChangeFiles = async (nFiles = 5): Promise<void> => {
  const files = new Array(nFiles)
    .fill(null)
    .map((_val, i) => path.resolve(apiPath, `validated-${i}.ts`));
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
  const handlerFunction = jest.fn(handler);
  const setupFunction = jest.fn(setup);
  const options: WatcherOptions = {
    ...commonOptions,
    targetPath: apiPath,
    handler: handlerFunction,
    onReady: async (_watcher, targetPath): Promise<void> => {
      setupFunction(targetPath, mainPath);
    },
  };
  const nFiles = 5;
  const files = new Array(nFiles)
    .fill(null)
    .map((_val, i) => path.resolve(apiPath, `validated-${i}.ts`));

  const watcher = await watchFolder(options);
  await waitForExpect(
    async (): Promise<void> => {
      expect(setupFunction).toHaveBeenCalled();
    },
  );
  await ensureDir(apiPath);
  await waitForExpect(
    async (): Promise<void> => {
      expect(await exists(apiPath)).toBe(true);
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
  setTimeout(async (): Promise<void> => {
    await writeAndChangeFiles(nFiles);
  }, 2000);
  await Promise.all(
    files.map((file) =>
      waitForExpect(async (): Promise<void> => {
        expect(handlerFunction).toHaveBeenCalledWith(
          'change',
          file,
          apiPath,
          undefined,
        );
      }, 20000),
    ),
  );
  await watcher.close();
}, 25000);

afterAll(
  async (): Promise<void> => {
    await emptyFolder(apiPath);
    await emptyFolder(runtimeDestPath);
  },
);
