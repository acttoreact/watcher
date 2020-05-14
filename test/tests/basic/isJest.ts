import { isJest, setForceDisableJestDetection } from '../../../tools/isJest';

/**
 * Method `isJest` should return `true` at startup and then `false` after being forced
 */
test('Method isJest basic flow', (): void => {
  expect(isJest()).toBe(true);
  setForceDisableJestDetection(true);
  expect(isJest()).toBe(false);
  setForceDisableJestDetection(false);
});
