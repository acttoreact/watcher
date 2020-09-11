import ts from 'typescript';
import path from 'path';
import { readFile } from '@a2r/fs';

import { ModuleInfo } from '../model/api';

import getMainMethodName from './getMainMethodName';
import getMainMethodNode from './getMainMethodNode';
import getFunctionDocContainer from './getFunctionDocContainer';
import getFunctionReturnTypeInfo from './getFunctionReturnTypeInfo';
import getModelImports from './getModelImports';
import getParamsTypes from './getParamsTypes';

/**
 * Gets module info from a file
 * @param filePath Module file path
 * @param apiSourcePath API source path (used for relative path)
 */
const getModuleInfo = async (filePath: string, apiSourcePath: string): Promise<ModuleInfo> => {
  const content = await readFile(filePath, 'utf8');
  const mainMethodParamNodes: ts.ParameterDeclaration[] = [];
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
  );
  const fileNodes = sourceFile.getChildren();
  const mainMethodName = getMainMethodName(fileNodes);
  const mainMethodNode = getMainMethodNode(fileNodes, mainMethodName);
  mainMethodNode.forEachChild((child): void => {
    if (ts.isParameter(child)) {
      mainMethodParamNodes.push(child);
    }
  });
  const mainMethodDocs = getFunctionDocContainer(mainMethodNode);
  const mainMethodReturnTypeInfo = getFunctionReturnTypeInfo(mainMethodNode);
  const usedTypes = mainMethodParamNodes.reduce(
    (t, n) => [...t, ...getParamsTypes(n.getChildren(sourceFile), sourceFile)],
    [],
  );
  usedTypes.push(...getParamsTypes([mainMethodReturnTypeInfo.typeNode]));
  const modelImports = getModelImports(fileNodes, usedTypes, sourceFile);
  const keys = path
    .relative(apiSourcePath, filePath)
    .replace(/\.ts$/, '')
    .split(path.sep);
  return {
    mainMethodDocs,
    mainMethodName,
    mainMethodNode,
    mainMethodParamNodes,
    mainMethodReturnTypeInfo,
    modelImports,
    usedTypes,
    keys,
  };
};

export default getModuleInfo;
