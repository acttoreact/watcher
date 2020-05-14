import isClient, { setForceServerSimulation } from '../../../tools/isClient';

/**
 * Method `isClient` should return `true` at startup and then `false` after being forced
 */
test('Method isClient basic flow', (): void => {
  expect(isClient()).toBe(true);
  setForceServerSimulation(true);
  expect(isClient()).toBe(false);
  setForceServerSimulation(false);
});
