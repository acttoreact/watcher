import ts from 'typescript';

import { ReturnTypeInfo } from '../model/api';

const getProxyMethod = (
  key: string,
  methodName: string,
  paramNodes: ts.ParameterDeclaration[],
  returnTypeInfo: ReturnTypeInfo,
): string => {
  const params = [
    ...paramNodes.map((n) => n.getFullText().trim()),
    'ctx?: GetServerSidePropsContext',
  ];
  const wrapperParams = [
    ...paramNodes.map((n) => n.getChildAt(0).getFullText().trim()),
    'ctx',
  ];
  return `const ${methodName} = (${params.join(', ')}): Promise<${
    returnTypeInfo.type
  }> => methodWrapper('${key}', ${wrapperParams.join(', ')});`;
};

export default getProxyMethod;
