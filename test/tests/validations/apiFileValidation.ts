import path from 'path';

import apiFileValidation from '../../../utils/apiFileValidation';

const apiPath = path.resolve(__dirname, '../../mocks/server/api');

/**
 * An empty file shouldn't pass validation
 */
test(`Empty API file shouldn't pass validation`, async (): Promise<void> => {
  const emptyFile = path.resolve(apiPath, 'empty.ts');
  const validate = await apiFileValidation(emptyFile);
  expect(validate).toBe(false);
});

/**
 * An undocumented (main) method shouldn't pass validation
 */
test(`Undocumented method shouldn't pass validation`, async (): Promise<void> => {
  const emptyFile = path.resolve(apiPath, 'undocumented.ts');
  const validate = await apiFileValidation(emptyFile);
  expect(validate).toBe(false);
});

/**
 * A documented (main) method should pass validation
 */
test(`Documented method should pass validation`, async (): Promise<void> => {
  const emptyFile = path.resolve(apiPath, 'documented.ts');
  const validate = await apiFileValidation(emptyFile);
  expect(validate).toBe(true);
});
