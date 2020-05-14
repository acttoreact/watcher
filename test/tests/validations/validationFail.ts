import path from 'path';
import waitForExpect from 'wait-for-expect';

import { WatcherOptions, OnReady } from '../../../model/watcher';

import onError from '../../../utils/onError';
import Validator from '../../../utils/runtimeValidator';
import watchFolder from '../../../utils/watchFolder';
import fileValidation from '../../../utils/apiFileValidation';

const serverPath = path.resolve(__dirname, '../../mocks/server/validation-fail');

/**
 * When validator processes a not validating file, it should be added to `failingFiles` map
 */
test('Failing file should be processed properly', async (): Promise<void> => {
  const onValidation = (): void => {
    // Empty validation handler for testing purposes
  };
  let validator: Validator = null;
  const onReady: OnReady = async (watcher, targetPath): Promise<void> => {
    validator = new Validator(fileValidation, onValidation, targetPath);
    const onEvent = jest.fn((eventName, eventPath): void => {
      validator.addFileToQueue({ targetPath: eventPath, type: eventName });
    });
    watcher.on('all', onEvent);
  };
  const watcherOptions: WatcherOptions = {
    onError,
    onReady,
    targetPath: serverPath,
  };
  const watcher = await watchFolder(watcherOptions);

  await waitForExpect(async (): Promise<void> => {
    expect(validator).not.toBe(null);
    expect(validator.failingFiles.size).toBe(1);
  });

  await watcher.close();
});