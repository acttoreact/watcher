import path from 'path';
import { readFile } from '@a2r/fs';

import getIsClientContent from '../../../utils/getIsClientContent';

const isClientPath = path.resolve(__dirname, '../../../tools/isClient.ts');

/**
 * isClient content should be the same as `isClient.ts` file
 */
test('isClient content', async (): Promise<void> => {
  const fileContent = await readFile(isClientPath, 'utf8');
  expect(getIsClientContent()).toBe(fileContent);
});