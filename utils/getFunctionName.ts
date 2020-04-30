import ts from 'typescript';
import chalk from 'chalk';

const getArrowFunctionName = (
  node: ts.FunctionDeclaration | ts.ArrowFunction,
): string => {
  if (ts.isArrowFunction(node)) {
    const { parent } = node;
    if (parent && ts.isVariableDeclaration(parent) && parent.name) {
      return parent.name.getText();
    }
  } else if (ts.isFunctionDeclaration(node) && node.name) {
    return node.name.getText();
  }
  return chalk.italic('Anonymous function');
};

export default getArrowFunctionName;
