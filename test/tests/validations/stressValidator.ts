import path from 'path';
import waitForExpect from 'wait-for-expect';
import { mkDir, emptyFolder, exists, writeFile } from '@a2r/fs';

import { WatcherOptions, OnReady } from '../../../model/watcher';

import onError from '../../../utils/onError';
import Validator from '../../../utils/runtimeValidator';
import watchFolder from '../../../utils/watchFolder';
import fileValidation from '../../../utils/modelFileValidation';

const serverPath = path.resolve(
  __dirname,
  '../../mocks/server/stress-validator',
);

beforeAll(async () => {
  await emptyFolder(serverPath);
});

const writeSeveralFiles = async (
  filePath: string,
  nFiles = 5,
): Promise<void> => {
  const files = new Array(nFiles)
    .fill(true)
    .map((_val, i) => path.resolve(filePath, `file-${i}.ts`));
  await Promise.all(files.map(file => writeFile(file, '// test file')));
};

/**
 * Validator should process several files. Method `processQueue` should be called when already processing and `filesToProcess` array should be filtered when adding new files
 */
test('Stress validator by writing several files at once', async (): Promise<
  void
> => {
  const onValidation = (): void => {
    // Empty validation handler for testing purposes
  };
  let onEvent: (
    eventName: 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir',
    eventPath: string,
  ) => void = null;
  const onReady: OnReady = async (watcher, targetPath): Promise<void> => {
    const validator = new Validator(fileValidation, onValidation, targetPath);
    onEvent = jest.fn((eventName, eventPath): void => {
      validator.addFileToQueue({ targetPath: eventPath, type: eventName });
    });
    watcher.on('all', (eventName, eventPath): void => {
      onEvent(eventName, eventPath);
    });
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
      expect(onEvent).toHaveBeenCalledWith('add', filePath);
    },
  );

  const lastFilePath = path.resolve(folderPath, 'last-file.ts');
  setTimeout(async function writeFiles(): Promise<void> {
    await writeSeveralFiles(folderPath);
    setTimeout(async function writeLastFile(): Promise<void> {
      await writeFile(lastFilePath, '// test file');
    }, 2000);
  }, 2000);
  
  await waitForExpect(
    async (): Promise<void> => {
      expect(await exists(lastFilePath)).toBe(true);
      expect(onEvent).toHaveBeenCalledWith('add', lastFilePath);
    },
  );

  await watcher.close();
});
