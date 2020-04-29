import path from 'path';

import initWatchers from '../../../utils/initWatchers';

test('Unexisting server path will throw exception', (): Promise<void> => {
  const wrongPath = '/wrong/path/to/server';
  expect.assertions(1);
  return expect(initWatchers(wrongPath)).rejects.toEqual(
    new Error(`Provided server path doesn't exist`),
  );
});

test(`Existing server path won't throw exception`, (): Promise<void> => {
  const rightPath = path.resolve(__dirname, '../../mocks/server');
  expect.assertions(1);
  return expect(initWatchers(rightPath)).resolves.toBe(undefined);
});
