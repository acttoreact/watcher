import ts from 'typescript';
import path from 'path';

import { readFile } from '../../../tools/fs';
import getMainMethodName from '../../../utils/getMainMethodName';

const apiPath = path.resolve(__dirname, '../../mocks/server/api');

/**
 * Should return empty name if there is no default export
 */
test('Should return empty name if there is no default export', async (): Promise<void> => {
  const filePath = path.resolve(apiPath, 'no-default-export.ts');
  const content = await readFile(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
  );
  const fileNodes = sourceFile.getChildren();
  expect(getMainMethodName(fileNodes)).toBe('');
});