import path from 'path';

import modelFileValidation from '../../../utils/modelFileValidation';

const modelPath = path.resolve(__dirname, '../../mocks/server/model-validation');

/**
 * An empty model file shouldn't pass validation
 */
test(`Empty model file shouldn't pass validation`, async (): Promise<void> => {
  const emptyFile = path.resolve(modelPath, 'empty.ts');
  expect(await modelFileValidation(emptyFile)).toBe(false);
});

/**
 * Model validation shouldn't allow duplicated keys
 */
test('Not allowing duplicated model keys', async (): Promise<void> => {
  const data1Path = path.resolve(modelPath, 'data1.ts');
  expect(await modelFileValidation(data1Path)).toBe(true);
  const data2Path = path.resolve(modelPath, 'data2.ts');
  expect(await modelFileValidation(data2Path)).toBe(false);
});

