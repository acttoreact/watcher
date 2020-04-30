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
}

const apiPath = path.resolve(__dirname, '../../mocks/server/working-api');
const mainPath = path.resolve(__dirname, '../../mocks');
const runtimeDestPath = path.resolve(mainPath, runtimePath);

beforeAll(async (): Promise<void> => {
  await emptyFolder(apiPath);
  await emptyFolder(runtimeDestPath);
});

/**
 * Handler should be a function
 */
test(`Handler should be a function`, async (): Promise<void> => {
  expect(handler).toBeInstanceOf(Function);
});

const fileContent = `/**
 * Method documentation
 */
const method = (): void => {
  // Do stuff
};

export default method;`;

/**
 * Basic API Watcher should work
 */
test(`Basic API Watcher flow`, async (): Promise<void> => {
  const handlerFunction = jest.fn(handler);
  const setupFunction = jest.fn(setup);
  const destWorkingFile = path.resolve(apiPath, 'documented.ts');
  const runtimeDestFile = path.resolve(runtimeDestPath, 'documented.ts');
  const options: WatcherOptions = {
    ...commonOptions,
    targetPath: apiPath,
    handler: handlerFunction,
    onReady: async (_watcher, targetPath): Promise<void> => {
      console.log('onReady function called');
      setupFunction(targetPath, mainPath);
      await writeFile(destWorkingFile, fileContent);
    }
  };
  const watcher = await watchFolder(options);
  await waitForExpect(async (): Promise<void> => {
    expect(setupFunction).toHaveBeenCalled();
    expect(await exists(destWorkingFile)).toBe(true);
    expect(handlerFunction).toHaveBeenCalled();
    expect(await exists(runtimeDestFile)).toBe(true);
  });
  await watcher.close();
});

// afterAll(async (): Promise<void> => {
//   await emptyFolder(apiPath);
//   await emptyFolder(runtimeDestPath);
// });