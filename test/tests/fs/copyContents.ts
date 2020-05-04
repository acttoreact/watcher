import path from 'path';

import { copyContents, exists, emptyFolder, rmDir } from '../../../tools/fs';

const src = path.resolve(__dirname, '../../mocks/server');
const dest = path.resolve(__dirname, '../../mocks/server-copy');
const insideFolder = path.resolve(dest, 'api');

/**
 * Method should copy folders and files recursively
 */
test('Copy contents should copy folders recursively', async (): Promise<void> => {
  expect(await exists(dest)).toBe(false);
  await copyContents(src, dest);
  expect(await exists(dest)).toBe(true);
  expect(await exists(insideFolder)).toBe(true);
});

/**
 * Method should copy folders and files recursively
 */
test('Copy contents should avoid copying existing', async (): Promise<void> => {
  await copyContents(src, dest);
  await copyContents(src, dest, false);
});

afterAll(async (): Promise<void> => {
  await emptyFolder(dest);
  await rmDir(dest);
});