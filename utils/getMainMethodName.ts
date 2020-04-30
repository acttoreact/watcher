import ts from 'typescript';

const getMainMethodName = (nodes: ts.Node[]): string => {
  let name = '';
  for (let i = 0, l = nodes.length; i < l && !name; i += 1) {
    const node = nodes[i];
    if (ts.isExportAssignment(node)) {
      const exportAssignment = node as ts.ExportAssignment;
      name = exportAssignment.expression.getText().trim();
    } else {
      name = getMainMethodName(node.getChildren());
    }
  }
  return name;
};

export default getMainMethodName;
