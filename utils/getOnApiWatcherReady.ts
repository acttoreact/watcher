import { OnReady } from '../model/watcher';

import Validator from './runtimeValidator';
import apiFileValidation from './apiFileValidation';
import { copyContents, emptyFolder } from '../tools/fs';

const getOnApiWatcherReady = (apiRuntimePath: string): OnReady => async (
  watcher,
  targetPath,
): Promise<void> => {
  const validator = new Validator(
    targetPath,
    apiFileValidation,
    async (): Promise<void> => {
      await emptyFolder(apiRuntimePath);
      await copyContents(targetPath, apiRuntimePath);
      // Generate proxy
    },
  );
  watcher.on('all', (eventName, eventPath): void => {
    validator.addFileToQueue({ targetPath: eventPath, type: eventName });
  });
};

export default getOnApiWatcherReady;
