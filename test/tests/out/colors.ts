import { fileName, fullPath, method } from '../../../tools/colors';

/**
 * File name should be displayed as expected
 */
test('File name is displayed as expected', (): void => {
  const expected = '\u001b[34mfile.ts\u001b[39m';
  expect(fileName('file.ts')).toEqual(expected);
});

/**
 * Full path should be displayed as expected
 */
test('Full path is displayed as expected', (): void => {
  const expected = '\u001b[36m/full/path/to/a/file.ts\u001b[39m';
  expect(fullPath('/full/path/to/a/file.ts')).toEqual(expected);
});

/**
 * Method name should be displayed as expected
 */
test('Method name is displayed as expected', (): void => {
  const expected = '\u001b[35mmethod\u001b[39m';
  expect(method('method')).toEqual(expected);
});