import isJest, { setForceDisableJestDetection } from '../../../tools/isJest';

/**
 * Method `isJest` should return true
 */
test('Method isJest should return true', async () => {
  expect(isJest()).toBe(true);
});

/**
 * After using `setForceDisableJestDetection` method `isJset` should return `false`
 */
test('Method isJest should return false after using setForceDisableJestDetection', async () => {
  setForceDisableJestDetection(true);
  expect(isJest()).toBe(false);
  setForceDisableJestDetection(false);
});