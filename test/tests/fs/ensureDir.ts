import path from 'path';

import { ensureDir } from '../../../tools/fs';

/**
 * Function should fail when being asked to ensure a folder whose parent doesn't exists with `recursive` set to `false`
 */
test('Ensure dir should fail', (): void => {
  const pathToEnsure = path.resolve(__dirname, '../../mocks/ensure/fail');
  expect(ensureDir(pathToEnsure, {}, false)).rejects.toHaveProperty('code');
  expect(ensureDir(pathToEnsure, {}, false)).rejects.not.toHaveProperty('code', 'EEXIST');
});