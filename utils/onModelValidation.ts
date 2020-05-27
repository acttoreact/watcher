import { copyContents, emptyFolder } from '@a2r/fs';

import { OnValidation } from '../model/watcher';

import { isJest } from '../tools/isJest';

/**
 * Method executed when API is validated after changes are processed
 */
const onModelValidation: OnValidation = async (
  serverPath: string,
  targetPath: string,
): Promise<void> => {
  if (!isJest()) {
    // TODO: Call to main A2R instance to restart API Runtime
    await emptyFolder(targetPath);
    await copyContents(serverPath, targetPath);
  }
};

export default onModelValidation;
