import ts from 'typescript';
import path from 'path';

import {
  APIStructure,
  ModuleInfo,
  ApiNamespace,
  GroupedModelImports,
} from '../model/api';

import { targetPath, apiPath, proxyPath } from '../settings';
import { getFilesRecursively, writeFile } from '../tools/fs';
import getModuleInfo from './getModuleInfo';
import getGroupedModelImports from './getGroupedModelImports';
import getProxyMethod from './getProxyMethod';
import updateApiObject from './updateApiObject';
import getApiObjectText from './getApiObject';
import getMethodWrapper from './getMethodWrapper';
import getSocketProvider from './getSocketProvider';

export const api: APIStructure = {};

const apiSourcePath = path.resolve(process.cwd(), targetPath, apiPath);
const proxyTargetPath = path.resolve(process.cwd(), proxyPath, apiPath);

const getExternalImports = (): string =>
  [`import generateId from 'shortid';`].join('\n');

const getInternalImports = (): string =>
  [`import socket, { MethodCall, SocketMessage } from './socket';`].join('\n');

const getInternalModelImports = (
  groupedModelImports: GroupedModelImports[],
): string =>
  groupedModelImports
    .map(
      ({ def, named, path: fromPath }) =>
        `import ${def ? `${def}${named && named.length ? ', ' : ''}` : ''}${
          named && named.length ? `{ ${named.join(', ')} }` : ''
        } from ${fromPath};`,
    )
    .join('\n');

const getDocs = (jsDoc: ts.JSDoc[]): string => {
  return jsDoc[0].getFullText();
};

export const build = async (): Promise<void> => {
  const proxyIndexPath = path.resolve(proxyTargetPath, 'index.ts');
  const socketFilePath = path.resolve(proxyTargetPath, 'socket.ts');
  const files = await getFilesRecursively(apiSourcePath, ['.ts']);

  const proxySourceFile = ts.createSourceFile(
    proxyIndexPath,
    '',
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS,
  );
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  const modulesInfo: ModuleInfo[] = await Promise.all(
    files.map(file => getModuleInfo(file, apiSourcePath)),
  );

  let apiObject: ApiNamespace = {
    key: 'api',
    namespaces: [],
    methods: [],
  };

  const imports = [];
  const methods = [];

  for (let i = 0, l = modulesInfo.length; i < l; i++) {
    const {
      mainMethodDocs,
      mainMethodName,
      mainMethodParamNodes,
      mainMethodReturnTypeInfo,
      modelImports,
      keys,
    } = modulesInfo[i];
    const doc = getDocs(mainMethodDocs.jsDoc as ts.JSDoc[]);
    const method = getProxyMethod(
      printer,
      proxySourceFile,
      keys.join('.'),
      mainMethodName,
      mainMethodParamNodes,
      mainMethodReturnTypeInfo,
    );
    imports.push(...modelImports);
    methods.push([doc, method].join('\n'));
    apiObject = updateApiObject(apiObject, keys, mainMethodName);
  }

  const groupedImports = getGroupedModelImports(imports);

  await writeFile(socketFilePath, getSocketProvider());
  await writeFile(
    proxyIndexPath,
    [
      getExternalImports(),
      getInternalImports(),
      getInternalModelImports(groupedImports),
      getMethodWrapper(),
      ...methods,
      getApiObjectText(apiObject),
      'export default api;\n',
    ].join('\n\n'),
  );
};
