import cleanText from '../../../tools/cleanText';

/**
 * Clean text method should work as expected
 */
test('Clean text', (): void => {
  expect(cleanText('Adiós')).toBe('Adios');
  expect(cleanText('Adiós', true)).toBe('adios');
  expect(cleanText('Adiós?', false, true)).toBe('Adios');
  expect(cleanText('Adiós?', true, true)).toBe('adios');
  expect(cleanText('Hello Adiós', false, false, true)).toBe('HelloAdios');
  expect(cleanText('Hello Adiós', true, false, true)).toBe('helloadios');
  expect(cleanText('Hello? Adiós', true, false, true)).toBe('hello?adios');
  expect(cleanText('Hello? Adiós', true, true, true)).toBe('helloadios');
  expect(cleanText('Hello? Adiós', false, true, true, true)).toBe('helloAdios');
  expect(cleanText('Hello? Adiós', true, true, true, false, '-')).toBe('hello-adios');
  expect(cleanText('')).toBe('');
  expect(cleanText('€')).toBe('€');
});