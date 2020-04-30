import out from '../../../tools/out';

/**
 * Sets log level to verbose and calls every log level handler to test all of them
 */
test('Check set level and set it to verbose so all log levels show', (): void => {
  expect(out.setLevel('verbose')).toBe(undefined);
  const alertLogger = jest.fn(out.alert);
  const errorLogger = jest.fn(out.error);
  const infoLogger = jest.fn(out.info);
  const verboseLogger = jest.fn(out.verbose);
  const warnLogger = jest.fn(out.warn);
  expect(alertLogger('alert')).toBe(undefined);
  expect(errorLogger('error')).toBe(undefined);
  expect(infoLogger('info')).toBe(undefined);
  expect(verboseLogger('verbose')).toBe(undefined);
  expect(warnLogger('warning')).toBe(undefined);
  expect(alertLogger).toHaveBeenCalled();
  expect(errorLogger).toHaveBeenCalled();
  expect(infoLogger).toHaveBeenCalled();
  expect(verboseLogger).toHaveBeenCalled();
  expect(warnLogger).toHaveBeenCalled();
});
