let forceServerSimulation = false;

/**
 * Allows you to disable client detection
 * @param {boolean} value True to force Server Side Simulation
 */
export const setForceServerSimulation = (value: boolean): void => {
  forceServerSimulation = value;
};

/**
 * Checks if the script is running on the client side
 */
const isClient = (): boolean => {
  if (forceServerSimulation) {
    return false;
  }
  return typeof window === 'object';
};

export default isClient;