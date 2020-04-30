import path from 'path';

import { emptyFolder, exists } from '../../../tools/fs';

const mocksPath = path.resolve(__dirname, '../../mocks/fs');

beforeAll(async (): Promise<void> => {
  await emptyFolder(mocksPath);
});

/**
 * Empty folder should work even if path doesn't exist
 */
test(`Empty folder should work even if path doesn't exist`, async (): Promise<void> => {
  const newFolder = path.resolve(mocksPath, 'empty-new');
  expect(await exists(newFolder)).toBe(false);
  await emptyFolder(newFolder);
  expect(await exists(newFolder)).toBe(true);
});

afterAll(async (): Promise<void> => {
  await emptyFolder(mocksPath);
});