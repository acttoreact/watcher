import path from 'path';

import getModuleInfo from '../../../utils/getModuleInfo';
import getProxyMethod from '../../../utils/getProxyMethod';

const apiSourcePath = path.resolve(
  __dirname,
  '../../mocks/server/module-info/api',
);
const filePath = path.resolve(apiSourcePath, 'basic.ts');

const expected = `const method = (src: Source, data: Data = { info: 'default text' }): Promise<Info> => methodWrapper('basic', src, data);`;

/**
 * Proxy method should be build as expected
 */
test('Basic proxy method', async (): Promise<void> => {
  const {
    keys,
    mainMethodName,
    mainMethodParamNodes,
    mainMethodReturnTypeInfo,
  } = await getModuleInfo(filePath, apiSourcePath);

  const method = getProxyMethod(
    keys.join('.'),
    mainMethodName,
    mainMethodParamNodes,
    mainMethodReturnTypeInfo,
  );
  expect(method).toBe(expected);
});
