import ts from 'typescript';

import { ModelImport } from '../model/api';

const getModelImports = (fileNodes: ts.Node[], sourceFile?: ts.SourceFile): ModelImport[] => {
  const res: ModelImport[] = [];
  for (let i = 0, l = fileNodes.length; i < l; i++) {
    const node = fileNodes[i];
    const children = node.getChildren(sourceFile);
    if (ts.isImportDeclaration(node)) {
      let clause: ts.ImportClause = null;
      let path: string = null;
      for (let j = 0, k = children.length; j < k && (!clause || !path); j++) {
        const child = children[j];
        if (ts.isImportClause(child)) {
          clause = child;
        }
        if (ts.isStringLiteral(child)) {
          path = child.getFullText(sourceFile);
        }
      }
      res.push({ clause, path, sourceFile });
    } else if (children.length) {
      res.push(...getModelImports(children, sourceFile));
    }
  }
  return res;
};

export default getModelImports;
