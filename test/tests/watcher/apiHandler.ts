import path from 'path';
import waitForExpect from 'wait-for-expect';

import { Omit } from '../../../@types';
import { runtimePath } from '../../../settings';
import {
  exists,
  emptyFolder,
  writeFile,
  ensureDir,
  unlink,
  rmDir,
} from '../../../tools/fs';
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

const apiPath = path.resolve(__dirname, '../../mocks/server/working-api');
const unlinkApiPath = path.resolve(__dirname, '../../mocks/server/unlink-api');
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
    await emptyFolder(unlinkApiPath);
    await emptyFolder(runtimeDestPath);
  },
);

/**
 * Handler should be a function
 */
test(`Handler should be a function`, async (): Promise<void> => {
  expect(handler).toBeInstanceOf(Function);
});

/**
 * Basic API Watcher should work
 */
test(`Basic API Watcher flow`, async (): Promise<void> => {
  const handlerFunction = jest.fn(handler);
  const setupFunction = jest.fn(setup);
  const validatedDestWorkingFile = path.resolve(apiPath, 'documented.ts');
  const validatedRuntimeDestFile = path.resolve(
    runtimeDestPath,
    'documented.ts',
  );
  const options: WatcherOptions = {
    ...commonOptions,
    targetPath: apiPath,
    handler: handlerFunction,
    onReady: async (_watcher, targetPath): Promise<void> => {
      setupFunction(targetPath, mainPath);
      await writeFile(validatedDestWorkingFile, validatedFileContent);
    },
  };
  const watcher = await watchFolder(options);
  await waitForExpect(
    async (): Promise<void> => {
      expect(setupFunction).toHaveBeenCalled();
      expect(await exists(validatedDestWorkingFile)).toBe(true);
      expect(handlerFunction).toHaveBeenCalled();
      expect(await exists(validatedRuntimeDestFile)).toBe(true);
    },
  );
  await watcher.close();
});

/**
 * Basic API Watcher unlink flow should cover unlink and unlinkDir event types
 */
test(`Basic API Watcher unlink flow`, async (): Promise<void> => {
  const handlerFunction = jest.fn(handler);
  const setupFunction = jest.fn(setup);
  const validatedDestWorkingPath = path.resolve(unlinkApiPath, 'test');
  const validatedDestWorkingFile = path.resolve(
    validatedDestWorkingPath,
    'documented.ts',
  );
  const options: WatcherOptions = {
    ...commonOptions,
    targetPath: unlinkApiPath,
    handler: handlerFunction,
    onReady: async (_watcher, targetPath): Promise<void> => {
      setupFunction(targetPath, mainPath);
    },
  };
  const watcher = await watchFolder(options);
  await ensureDir(validatedDestWorkingPath);
  await waitForExpect(
    async (): Promise<void> => {
      expect(await exists(validatedDestWorkingPath)).toBe(true);
    },
  );
  await writeFile(validatedDestWorkingFile, validatedFileContent);
  await waitForExpect(
    async (): Promise<void> => {
      expect(await exists(validatedDestWorkingFile)).toBe(true);
    },
  );
  await waitForExpect(
    async (): Promise<void> => {
      expect(setupFunction).toHaveBeenCalled();
      expect(handlerFunction).toHaveBeenLastCalledWith(
        'add',
        validatedDestWorkingFile,
        unlinkApiPath,
        undefined,
      );
      expect(await exists(validatedDestWorkingFile)).toBe(true);
    },
  );
  await unlink(validatedDestWorkingFile);
  await waitForExpect(
    async (): Promise<void> => {
      expect(handlerFunction).toHaveBeenLastCalledWith(
        'unlink',
        validatedDestWorkingFile,
        unlinkApiPath,
        undefined,
      );
      expect(await exists(validatedDestWorkingFile)).toBe(false);
    },
  );
  await rmDir(validatedDestWorkingPath);
  await waitForExpect(
    async (): Promise<void> => {
      expect(handlerFunction).toHaveBeenLastCalledWith(
        'unlinkDir',
        validatedDestWorkingPath,
        unlinkApiPath,
        undefined,
      );
      expect(await exists(validatedDestWorkingPath)).toBe(false);
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
