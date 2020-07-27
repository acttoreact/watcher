import path from 'path';

import getModuleInfo from '../../../utils/getModuleInfo';

const apiSourcePath = path.resolve(__dirname, '../../mocks/server/module-info/api');
const filePath = path.resolve(apiSourcePath, 'basic.ts');
const camelCaseFilePath = path.resolve(apiSourcePath, 'camelCase.ts');

/**
 * Module info should contain expected data
 */
test('Module info', async (): Promise<void> => {
  const moduleInfo = await getModuleInfo(filePath, apiSourcePath);
  expect(moduleInfo).not.toBe(undefined);
  expect(moduleInfo.mainMethodName).toBe('method');
  expect(moduleInfo.keys).toEqual(['basic']);
  expect(moduleInfo.modelImports.length).toBe(1);
  expect(moduleInfo.mainMethodDocs).not.toBe(undefined);
  expect(moduleInfo.mainMethodNode).not.toBe(undefined);
  expect(moduleInfo.mainMethodParamNodes.length).toBe(2);
  expect(moduleInfo.mainMethodReturnTypeInfo).not.toBe(undefined);
  expect(moduleInfo.mainMethodReturnTypeInfo.identifier).toBe('Promise');
  expect(moduleInfo.mainMethodReturnTypeInfo.type).toBe('Info');
});


/**
 * Module info should keep camelCase
 */
test('Module info', async (): Promise<void> => {
  const moduleInfo = await getModuleInfo(camelCaseFilePath, apiSourcePath);
  expect(moduleInfo).not.toBe(undefined);
  expect(moduleInfo.mainMethodName).toBe('camelCase');
  expect(moduleInfo.keys).toEqual(['camelCase']);
});