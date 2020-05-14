import { build } from './apiProxy';
import { isJest } from '../tools/isJest';

import { OnValidation } from '../model/watcher';

/**
 * Method executed when API is validated after changes are processed
 */
const onApiValidation: OnValidation = async (
  serverPath,
  targetPath,
): Promise<void> => {
  if (!isJest()) {
    // TODO: Call to main A2R instance to restart API Runtime
    await build(serverPath, targetPath);
  }
};

export default onApiValidation;
