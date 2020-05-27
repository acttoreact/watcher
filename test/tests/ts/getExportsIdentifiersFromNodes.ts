import ts from 'typescript';
import path from 'path';
import { readFile } from '@a2r/fs';

import getExportsIdentifiersFromNodes from '../../../utils/getExportsIdentifiersFromNodes';

const modelSourcePath = path.resolve(__dirname, '../../mocks/server/model-imports/model');

test('Get exports identifiers', async (): Promise<void> => {
  const filePath = path.resolve(modelSourcePath, 'data.ts');
  const content = await readFile(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
  const fileNodes = sourceFile.getChildren();
  const identifiers = getExportsIdentifiersFromNodes(fileNodes);
  expect(identifiers.length).toBe(1);
  expect(identifiers).toContain('Data');
});