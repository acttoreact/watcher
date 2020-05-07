import ts from 'typescript';

const getIdentifier = (nodes: ts.Node[]): string => {
  let res = '';
  for (let i = 0, l = nodes.length; i < l && !res; i += 1) {
    const node = nodes[i];
    if (ts.isIdentifier(node)) {
      res = node.getText().trim();
    }
  }
  return res;
};

const getExportsIdentifiersFromNodes = (
  nodes: ts.Node[],
  keys: string[] = new Array<string>(),
): string[] => {
  const res = [...keys];
  for (let i = 0, l = nodes.length; i < l; i += 1) {
    const node = nodes[i];
    const children = node.getChildren();
    if (
      ts.isInterfaceDeclaration(node) ||
      ts.isEnumDeclaration(node) ||
      ts.isTypeAliasDeclaration(node)
    ) {
      const identifier = getIdentifier(children);
      if (!identifier) {
        throw Error(`Couldn't find identifier for export declaration:\n${node.getText()}`);
      }
      res.push(identifier);
    } else if (children.length) {
      res.push(...getExportsIdentifiersFromNodes(children));
    }
  }
  return res;
};

export default getExportsIdentifiersFromNodes;
