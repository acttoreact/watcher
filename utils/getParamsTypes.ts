import ts from 'typescript';

const getParamsTypes = (
  nodes: ts.Node[],
  sourceFile?: ts.SourceFile,
): string[] => {
  const res: string[] = [];
  for (let i = 0, l = nodes.length; i < l; i++) {
    const node = nodes[i];
    if (ts.isTypeReferenceNode(node) || ts.isUnionTypeNode(node)) {
      const children = node.getChildren(sourceFile);
      for (let j = 0, k = children.length; j < k; j += 1) {
        const child = children[j];
        if (ts.isIdentifier(child) || ts.isQualifiedName(child)) {
          res.push(child.getText().trim());
        } else if (child.kind === ts.SyntaxKind.SyntaxList) {
          const typeChildren = child.getChildren(sourceFile);
          if (typeChildren.length) {
            res.push(...getParamsTypes(typeChildren, sourceFile));
          }
        }
      }
    } else if (ts.isArrayTypeNode(node)) {
      res.push(...getParamsTypes(node.getChildren(sourceFile), sourceFile));
    }
  }
  return res;
};

export default getParamsTypes;
