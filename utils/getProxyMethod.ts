import ts from 'typescript';

import { ReturnTypeInfo } from '../model/api';

const getProxyMethod = (
  key: string,
  methodName: string,
  paramNodes: ts.ParameterDeclaration[],
  returnTypeInfo: ReturnTypeInfo,
): string => {
  return `const ${methodName} = (${paramNodes
    .map(n => n.getFullText().trim())
    .join(', ')}): Promise<${returnTypeInfo.type}> => methodWrapper('${key}'${
    paramNodes.length
      ? `, ${paramNodes
          .map(n =>
            n
              .getChildAt(0)
              .getFullText()
              .trim(),
          )
          .join(', ')}`
      : ''
  });`;
};

export default getProxyMethod;
