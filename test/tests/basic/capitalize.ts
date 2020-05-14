import capitalize from '../../../tools/capitalize';

test('Capitalize', (): void => {
  expect(capitalize('hello')).toBe('Hello');
})