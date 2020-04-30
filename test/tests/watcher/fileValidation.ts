import path from 'path';

import fileValidation from '../../../utils/fileValidation';

const apiPath = path.resolve(__dirname, '../../mocks/server/api');

/**
 * An empty file shouldn't pass validation
 */
test(`Empty fail shouldn't pass validation`, async (): Promise<void> => {
  const emptyFile = path.resolve(apiPath, 'empty.ts');
  const validate = await fileValidation(emptyFile);
  expect(validate).toBe(false);
});

/**
 * An undocumented (main) method shouldn't pass validation
 */
test(`Undocumented method shouldn't pass validation`, async (): Promise<void> => {
  const emptyFile = path.resolve(apiPath, 'undocumented.ts');
  const validate = await fileValidation(emptyFile);
  expect(validate).toBe(false);
});

/**
 * A documented (main) method should pass validation
 */
test(`Documented method should pass validation`, async (): Promise<void> => {
  const emptyFile = path.resolve(apiPath, 'documented.ts');
  const validate = await fileValidation(emptyFile);
  expect(validate).toBe(true);
});
