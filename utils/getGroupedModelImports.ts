import ts from 'typescript';

import { ModelImport, GroupedModelImports } from '../model/api';

const getNamedImports = (nodes: ts.Node[], sourceFile?: ts.SourceFile): string[] => {
  const res: string[] = [];
  for (let i = 0, l = nodes.length; i < l; i++) {
    const node = nodes[i];
    if (ts.isIdentifier(node)) {
      res.push(node.getFullText(sourceFile));
    } else {
      const children = node.getChildren(sourceFile);
      if (children.length) {
        res.push(...getNamedImports(children, sourceFile));
      }
    }
  }
  return res;
};

const getGroupedModelImports = (imports: ModelImport[]): GroupedModelImports[] => {
  const res: GroupedModelImports[] = [];
  for (let i = 0, l = imports.length; i < l; i++) {
    const { clause, path, sourceFile } = imports[i];
    const pathForProxy = path.replace(/([./]+)\/model/, '../model');
    let grouped = res.find(g => g.path === pathForProxy);
    if (!grouped) {
      grouped = {
        path: pathForProxy,
      };
      res.push(grouped);
    }
    const children = clause.getChildren(sourceFile);
    for (let j = 0, k = children.length; j < k; j++) {
      const child = children[j];
      if (ts.isIdentifier(child)) {
        grouped.def = child.getFullText(sourceFile);
      }
      if (ts.isNamedImports(child)) {
        grouped.named = Array.from(
          new Set([
            ...(grouped.named || []),
            ...getNamedImports(child.getChildren(sourceFile), sourceFile),
          ]),
        );
      }
    }
  }
  return res;
};

export default getGroupedModelImports;
