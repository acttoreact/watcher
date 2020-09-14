import ts from 'typescript';

const getParamsTypes = (
  nodes: ts.Node[],
  sourceFile?: ts.SourceFile,
): string[] => {
  const res: string[] = [];
  for (let i = 0, l = nodes.length; i < l; i++) {
    const node = nodes[i];
    console.log(node.getText());
    if (ts.isTypeReferenceNode(node) || ts.isUnionTypeNode(node)) {
      console.log('if');
      const children = node.getChildren(sourceFile);
      for (let j = 0, k = children.length; j < k; j += 1) {
        const child = children[j];
        console.log('child', child.getText(), ts.SyntaxKind[child.kind]);
        if (ts.isIdentifier(child) || ts.isQualifiedName(child)) {
          res.push(child.getText().trim());
        } else if (child.kind === ts.SyntaxKind.SyntaxList) {
          const typeChildren = child.getChildren(sourceFile);
          console.log(child.getText(), typeChildren.length);
          if (typeChildren.length) {
            res.push(...getParamsTypes(typeChildren, sourceFile));
          }
        }
      }
    } else if (ts.isArrayTypeNode(node)) {
      console.log('else if');
      res.push(...getParamsTypes(node.getChildren(sourceFile), sourceFile));
    } else {
      console.log('else', ts.SyntaxKind[node.kind]);
    }
  }
  return res;
};

export default getParamsTypes;
