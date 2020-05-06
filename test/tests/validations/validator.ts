import path from 'path';
import waitForExpect from 'wait-for-expect';

import { WatcherOptions, OnReady } from '../../../model/watcher';

import onError from '../../../utils/onError';
import Validator from '../../../utils/runtimeValidator';
import watchFolder from '../../../utils/watchFolder';
import fileValidation from '../../../utils/modelFileValidation';
import {
  mkDir,
  emptyFolder,
  exists,
  writeFile,
  unlink,
  rmDir,
} from '../../../tools/fs';

const serverPath = path.resolve(__dirname, '../../mocks/server/validator');

beforeAll(async () => {
  await emptyFolder(serverPath);
});

/**
 * Validator should handle basic event types properly
 */
test('Basic validator flow', async (): Promise<void> => {
  const onValidation = (): void => {
    // Empty validation handler for testing purposes
  };
  let onEvent: (
    eventName: 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir',
    eventPath: string,
  ) => void = null;
  const onReady: OnReady = async (watcher, targetPath): Promise<void> => {
    const validator = new Validator(targetPath, fileValidation, onValidation);
    onEvent = jest.fn((eventName, eventPath): void => {
      validator.addFileToQueue({ targetPath: eventPath, type: eventName });
    });
    watcher.on('all', onEvent);
  };
  const jestOnReady = jest.fn(onReady);
  const watcherOptions: WatcherOptions = {
    onError,
    onReady: jestOnReady,
    targetPath: serverPath,
  };

  const watcher = await watchFolder(watcherOptions);
  await waitForExpect(
    async (): Promise<void> => {
      expect(jestOnReady).toHaveBeenCalled();
    },
  );

  const folderPath = path.resolve(serverPath, 'folder');
  await mkDir(folderPath);
  await waitForExpect(
    async (): Promise<void> => {
      expect(await exists(folderPath)).toBe(true);
    },
  );

  const filePath = path.resolve(folderPath, 'file.ts');
  await writeFile(filePath, '// test file');
  await waitForExpect(
    async (): Promise<void> => {
      expect(await exists(filePath)).toBe(true);
      expect(onEvent).toHaveBeenCalledWith(
        'add',
        filePath,
      );
    },
  );

  await writeFile(filePath, '// test file changed');
  await waitForExpect(async (): Promise<void> => {
    expect(onEvent).toHaveBeenCalledWith(
      'change',
      filePath,
    );
  });

  await unlink(filePath);
  await waitForExpect(
    async (): Promise<void> => {
      expect(await exists(filePath)).toBe(false);
      expect(onEvent).toHaveBeenCalledWith(
        'unlink',
        filePath,
      );
    },
  );

  await rmDir(folderPath);
  await waitForExpect(async (): Promise<void> => {
    expect(await exists(folderPath)).toBe(false);
    expect(onEvent).toHaveBeenCalledWith(
      'unlinkDir',
      folderPath,
    );
  });

  await watcher.close();
});