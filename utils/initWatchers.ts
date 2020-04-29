// import path from 'path';

import { exists } from './fs';

/**
 * Starts watchers
 * @param serverPath Server main path (containing api and model)
 */
const initWatchers = async (serverPath: string): Promise<void> => {
  const pathExists = await exists(serverPath);
  if (!pathExists) {
    throw new Error(`Provided server path doesn't exist`);
  }
  // eslint-disable-next-line no-console
  console.log('Starting watchers');
  // const apiPath = path.resolve(serverPath, 'api');
  // const modelPath = path.resolve(serverPath, 'api');
};

export default initWatchers;
