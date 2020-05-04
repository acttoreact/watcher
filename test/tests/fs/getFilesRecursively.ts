import path from 'path';

import { getFilesRecursively } from '../../../tools/fs';

const recursivePath = path.resolve(__dirname, '../../mocks/fs/recursive');

/**
 * Function should return all files recursively from path
 */
test('Get files recursively', async (): Promise<void> => {
  const files = await getFilesRecursively(recursivePath);
  const file1 = path.resolve(recursivePath, 'path-1', 'file-1.txt');
  const file2 = path.resolve(recursivePath, 'path-2', 'file-2.txt');
  expect(files.length).toBe(2);
  expect(files).toContain(file1);
  expect(files).toContain(file2);
});