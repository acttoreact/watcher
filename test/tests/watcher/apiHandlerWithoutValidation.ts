import path from 'path';
import waitForExpect from 'wait-for-expect';

import { Omit } from '../../../@types';
import { runtimePath } from '../../../settings';
import { exists, emptyFolder, writeFile } from '../../../tools/fs';
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

const apiPath = path.resolve(__dirname, '../../mocks/server/undocumented-api');
const unlinkApiPath = path.resolve(
  __dirname,
  '../../mocks/server/unlink-undocumented-api',
);
const mainPath = path.resolve(__dirname, '../../mocks');
const runtimeDestPath = path.resolve(mainPath, runtimePath);

const notValidatedFileContent = `const method = (): void => {
 // Do stuff
};

export default method;`;

beforeAll(
  async (): Promise<void> => {
    await emptyFolder(apiPath);
    await emptyFolder(unlinkApiPath);
    await emptyFolder(runtimeDestPath);
  },
);

/**
 * Processing not validated content should avoid copying contents to runtime
 */
test('API Watcher avoids copying when not validating', async (): Promise<
  void
> => {
  const handlerFunction = jest.fn(handler);
  const notValidatedDestWorkingFile = path.resolve(apiPath, 'undocumented.ts');
  const notValidatedRuntimeDestFile = path.resolve(
    runtimeDestPath,
    'undocumented.ts',
  );
  const options: WatcherOptions = {
    ...commonOptions,
    targetPath: apiPath,
    handler: handlerFunction,
    onReady: async (_watcher, targetPath): Promise<void> => {
      setup(targetPath, mainPath);
      await writeFile(notValidatedDestWorkingFile, notValidatedFileContent);
    },
  };
  const watcher = await watchFolder(options);
  await waitForExpect(
    async (): Promise<void> => {
      expect(handlerFunction).toHaveBeenLastCalledWith(
        'add',
        notValidatedDestWorkingFile,
        apiPath,
        undefined,
      );
      expect(await exists(notValidatedDestWorkingFile)).toBe(true);
    },
  );
  await writeFile(notValidatedDestWorkingFile, `${notValidatedFileContent}\n`);
  await waitForExpect(
    async (): Promise<void> => {
      expect(handlerFunction).toHaveBeenLastCalledWith(
        'change',
        notValidatedDestWorkingFile,
        apiPath,
        undefined,
      );
      expect(await exists(notValidatedRuntimeDestFile)).toBe(false);
    },
  );
  await watcher.close();
});

afterAll(
  async (): Promise<void> => {
    await emptyFolder(apiPath);
    await emptyFolder(unlinkApiPath);
    await emptyFolder(runtimeDestPath);
  },
);
