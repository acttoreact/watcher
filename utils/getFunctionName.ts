import ts from 'typescript';

import out from '../tools/out';
import { method } from '../tools/colors';

const getArrowFunctionName = (
  node: ts.FunctionDeclaration | ts.ArrowFunction,
): string => {
  if (ts.isArrowFunction(node)) {
    const { parent } = node;
    if (parent && ts.isVariableDeclaration(parent) && parent.name) {
      return parent.name.getText();
    }
  } else if (ts.isFunctionDeclaration(node)) {
    if (node.name) {
      return node.name.getText();;
    }
  } else {
    out.error(`Node provided to ${method('getArrowFunctionName')} is not a function`);
    return null;
  }
  return 'Anonymous function';
};

export default getArrowFunctionName;
