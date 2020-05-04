let forceDisableJestDetection = false;

/**
 * Allows you to disable Jest detection
 * @param {boolean} value True to disable Jest detection
 */
export const setForceDisableJestDetection = (value: boolean): void => {
  forceDisableJestDetection = value;
};

/**
 * Checks if the script is running using Jest test engine
 */
const isJest = (): boolean => {
  if (forceDisableJestDetection) {
    return false;
  }
  return typeof jest !== 'undefined';
};

export default isJest;