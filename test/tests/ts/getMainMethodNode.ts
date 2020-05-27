import ts from 'typescript';
import path from 'path';
import { readFile } from '@a2r/fs';

import getMainMethodNode from '../../../utils/getMainMethodNode';

const apiPath = path.resolve(__dirname, '../../mocks/server/api');

/**
 * Should return null if main method name is not provided
 */
test('Should return null if main method name is not provided', async (): Promise<void> => {
  const filePath = path.resolve(apiPath, 'documented.ts');
  const content = await readFile(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
  );
  const fileNodes = sourceFile.getChildren();
  const mainMethodName = '';
  expect(getMainMethodNode(fileNodes, mainMethodName)).toBe(null);
});

/**
 * Should return null if method name doesn't match real method name
 */
test('If method name is not provided should return null', async (): Promise<void> => {
  const filePath = path.resolve(apiPath, 'documented.ts');
  const content = await readFile(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
  );
  const fileNodes = sourceFile.getChildren();
  expect(getMainMethodNode(fileNodes, 'otherName')).toBe(null);
});