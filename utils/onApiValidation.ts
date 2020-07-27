import path from 'path';
import { build } from './apiProxy';
import { isJest } from '../tools/isJest';

import { OnValidation } from '../model/watcher';

import { proxies, apiPath } from '../settings';

/**
 * Method executed when API is validated after changes are processed
 */
const onApiValidation: OnValidation = async (
  serverPath,
  targetPath,
): Promise<void> => {
  if (!isJest()) {
    await Promise.all(
      proxies.map((proxy) =>
        build(serverPath, path.resolve(targetPath, proxy, apiPath)),
      ),
    );
  }
};

export default onApiValidation;
