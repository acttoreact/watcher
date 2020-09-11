import path from 'path';
import { copyContents, emptyFolder } from '@a2r/fs';

import { isJest } from '../tools/isJest';

import { OnValidation } from '../model/watcher';

import { proxies, modelPath } from '../settings';

/**
 * Method executed when API is validated after changes are processed
 */
const onModelValidation: OnValidation = async (
  serverPath: string,
  targetPath: string,
): Promise<void> => {
  if (!isJest()) {
    await Promise.all(
      proxies.map((proxy) =>
        emptyFolder(path.resolve(targetPath, proxy, modelPath)),
      ),
    );
    await Promise.all(
      proxies.map((proxy) =>
        copyContents(serverPath, path.resolve(targetPath, proxy, modelPath)),
      ),
    );
  }
};

export default onModelValidation;
