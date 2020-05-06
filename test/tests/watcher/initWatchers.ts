import path from 'path';
import waitForExpect from 'wait-for-expect';

import { apiPath, modelPath } from '../../../settings';
import { emptyFolder, ensureDir, writeFile, exists } from '../../../tools/fs';
import initWatchers from '../../../utils/initWatchers';

const serverPath = path.resolve(__dirname, '../../mocks/server/init-ok');
const serverApiPath = path.resolve(serverPath, apiPath);
const serverModelPath = path.resolve(serverPath, modelPath);
const mainPath = path.resolve(__dirname, '../../mocks');

beforeAll(async () => {
  await emptyFolder(serverPath);
  await ensureDir(serverApiPath);
  await ensureDir(serverModelPath);
});

const validatedContent = `/**
 * Method documentation
 */
const method = (): void => {
  // Do stuff
};

export default method;
`;

/**
 * Unexisting server path will throw exception
 */
test('Unexisting server path will throw exception', async (): Promise<void> => {
  const wrongPath = '/wrong/path/to/server';
  await waitForExpect(async (): Promise<void> => {
    expect(initWatchers(wrongPath, wrongPath)).rejects.toBeInstanceOf(Error);
  });
});

/**
 * Should work with existing server path and process files when added
 */
test('Basic watchers flow', async (): Promise<void> => {
  const watchers = await initWatchers(serverPath, mainPath);
  const handler = jest.fn((eventName, eventPath): void => {
    console.log(eventName, eventPath);
    // Empty function to check event handler
  });
  watchers.forEach((watcher): void => {
    watcher.on('all', handler);
  });
  const fileName = 'ok.ts';
  const serverApiFilePath = path.resolve(serverApiPath, fileName);
  const serverModelFilePath = path.resolve(serverModelPath, fileName);
  await writeFile(serverApiFilePath, validatedContent);
  await writeFile(serverModelFilePath, validatedContent);
  await waitForExpect(async (): Promise<void> => {
    expect(await exists(serverApiFilePath)).toBe(true);
    expect(await exists(serverModelFilePath)).toBe(true);
    expect(handler).toHaveBeenCalledWith(
      'add',
      serverApiFilePath,
    );
    expect(handler).toHaveBeenCalledWith(
      'add',
      serverModelFilePath,
    );
  });

  await Promise.all(watchers.map(w => w.close()));
});
