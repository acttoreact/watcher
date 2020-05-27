import ts from 'typescript';
import path from 'path';
import { readFile } from '@a2r/fs';

import getFunctionReturnTypeInfo from '../../../utils/getFunctionReturnTypeInfo';
import getMainMethodName from '../../../utils/getMainMethodName';
import getMainMethodNode from '../../../utils/getMainMethodNode';

const filePath = path.resolve(__dirname, '../../mocks/server/no-return/no-return.ts');

test('Get function return type info should return null if no return is defined', async () => {
  const content = await readFile(filePath, 'utf8');
  const mainMethodParamNodes: ts.ParameterDeclaration[] = [];
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
  );
  const fileNodes = sourceFile.getChildren();
  const mainMethodName = getMainMethodName(fileNodes);
  const mainMethodNode = getMainMethodNode(fileNodes, mainMethodName);
  mainMethodNode.forEachChild((child): void => {
    if (ts.isParameter(child)) {
      mainMethodParamNodes.push(child);
    }
  });
  const mainMethodReturnTypeInfo = getFunctionReturnTypeInfo(mainMethodNode);
  expect(mainMethodReturnTypeInfo).toBe(null);
});