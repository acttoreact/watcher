import ts from 'typescript';
import path from 'path';
import { readFile } from '@a2r/fs';

import getMainMethodName from '../../../utils/getMainMethodName';
import getMainMethodNode from '../../../utils/getMainMethodNode';
import getFunctionName from '../../../utils/getFunctionName';

const apiPath = path.resolve(__dirname, '../../mocks/server/api');

/**
 * Should get name from non-arrow functions
 */
test('Should get name from non-arrow functions', async (): Promise<void> => {
  const filePath = path.resolve(apiPath, 'no-arrow-function.ts');
  const content = await readFile(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
  );
  const fileNodes = sourceFile.getChildren();
  const mainMethName = getMainMethodName(fileNodes);
  expect(mainMethName).toBe('method');
  expect(getMainMethodNode(fileNodes, mainMethName)).not.toBe(null);
});

/**
 * Function without name should return "Anonymous function" as function name
 */
test('Function without name should return "Anonymous function" as function name', async (): Promise<
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
  const nodes = fileNodes[0].getChildren();
  let methodName = '';
  for (let i = 0, l = nodes.length; i < l && !methodName; i += 1) {
    const node = nodes[i];
    if (ts.isFunctionDeclaration(node) || ts.isArrowFunction(node)) {
      methodName = getFunctionName(node);
    }
  }
  expect(methodName).toBe('Anonymous function');
});

/**
 * If node is not a function should return null
 */
test('Node that is not a function node should return null as function name', async (): Promise<
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
  expect(getFunctionName(fileNodes[0] as ts.FunctionDeclaration)).toBe(null);
});

/**
 * Arrow function not inside variable declaration should return "Anonymous function"
 */
test('Arrow function not inside variable declaration should return "Anonymous function"', async (): Promise<
  void
> => {
  const getArrowFunction = (nodes): ts.ArrowFunction => {
    let arrow = null;
    for (let i = 0, l = nodes.length; i < l && !arrow; i += 1) {
      const node = nodes[i];
      if (ts.isArrowFunction(node)) {
        arrow = node;
      } else {
        const children = node.getChildren();
        if (children && children.length) {
          arrow = getArrowFunction(children);
        }
      }
    }
    return arrow;
  };

  const filePath = path.resolve(apiPath, 'arrow-not-in-declaration.ts');
  const content = await readFile(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
  );
  const fileNodes = sourceFile.getChildren();
  const arrowFunction = getArrowFunction(fileNodes);
  expect(getFunctionName(arrowFunction)).toBe('Anonymous function');
});
