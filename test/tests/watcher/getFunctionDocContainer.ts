import ts from 'typescript';
import path from 'path';

import { readFile } from '../../../tools/fs';
import getMainMethodName from '../../../utils/getMainMethodName';
import getMainMethodNode from '../../../utils/getMainMethodNode';
import getFunctionDocContainer from '../../../utils/getFunctionDocContainer';

const apiPath = path.resolve(__dirname, '../../mocks/server/api');

/**
 * Should get doc container from non-arrow functions
 */
test('Gets doc container from non arrow function', async (): Promise<void> => {
  const filePath = path.resolve(apiPath, 'no-arrow-function.ts');
  const content = await readFile(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
  );
  const fileNodes = sourceFile.getChildren();
  const mainMethodName = getMainMethodName(fileNodes);
  const mainMethodNode = getMainMethodNode(fileNodes, mainMethodName);
  expect(getFunctionDocContainer(mainMethodNode)).not.toBe(null);
});

/**
 * If node is not a function should return null
 */
test('Should return null for a node that is not a function node', async (): Promise<
  void
> => {
  const filePath = path.resolve(apiPath, 'anonymous-function.ts');
  const content = await readFile(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
  );
  const fileNodes = sourceFile.getChildren();
  expect(getFunctionDocContainer(fileNodes[0] as ts.FunctionDeclaration)).toBe(null);
});