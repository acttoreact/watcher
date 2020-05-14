import ts from 'typescript';
import { out } from '@a2r/telemetry';

import { ReturnTypeInfo } from '../model/api';

const getTypeReference = (
  node: ts.Node,
): ts.TypeReferenceNode | null => {
  let typeReference: ts.TypeReferenceNode | null = null;
  const children = node.getChildren();
  for (let i = 0, l = children.length; i < l && !typeReference; i += 1) {
    const child = children[i];
    if (ts.isTypeReferenceNode(child)) {
      typeReference = child;
    }
  }
  return typeReference;
};

const getFunctionReturnTypeInfo = (
  node: ts.FunctionDeclaration | ts.ArrowFunction,
): ReturnTypeInfo | null => {
  let returnTypeInfo: ReturnTypeInfo | null = null;
  const typeReference = getTypeReference(node);
  if (typeReference) {
    const children = typeReference.getChildren();
    let identifier = '';
    let type = '';
    let typeNode: ts.TypeNode | null = null;
    for (let i = 0, l = children.length; i < l; i += 1) {
      const child = children[i];
      if (ts.isIdentifier(child)) {
        identifier = child.getText().trim();
      } else if (child.kind === ts.SyntaxKind.SyntaxList) {
        typeNode = child.getChildAt(0) as ts.TypeNode;
        type = typeNode.getText().trim();
      }
    }
    returnTypeInfo = {
      identifier,
      type,
      typeNode,
    };
  } else {
    out.error(`No return type provided for method:\n${node.getFullText()}`);
  }
  return returnTypeInfo;
};

export default getFunctionReturnTypeInfo;
