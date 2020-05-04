import path from 'path';

import { ensureDir, mkDir, exists, rmDir } from '../../../tools/fs';

const ensurePath = path.resolve(__dirname, '../../mocks/ensure');
const pathToEnsure = path.resolve(ensurePath, 'fail');

/**
 * Function should fail when being asked to ensure a folder whose parent doesn't exists with `recursive` set to `false`
 */
test('Ensure dir should fail', async (): Promise<void> => {
  expect(ensureDir(pathToEnsure, {}, false)).rejects.toThrow();
  expect(ensureDir(pathToEnsure, {}, false)).rejects.toHaveProperty('code');
  expect(ensureDir(pathToEnsure, {}, false)).rejects.not.toHaveProperty('code', 'EEXIST');
  await mkDir(ensurePath, { mode: 0o000 });
  expect(await exists(ensurePath)).toBe(true);
  expect(ensureDir(pathToEnsure, {}, false)).rejects.not.toHaveProperty('code', 'EEXIST');
});

afterAll(async (): Promise<void> => {
  await rmDir(ensurePath);
});