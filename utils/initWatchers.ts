// import path from 'path';

import fs from './fs';

/**
 * Starts watchers
 * @param serverPath Server main path (containing api and model)
 */
const initWatchers = async (serverPath: string): Promise<void> => {
  const exists = await fs.exists(serverPath);
  if (!exists) {
    throw new Error(`Provided server path doesn't exist`);
  }
  console.log('Starting watchers');

  // const apiPath = path.resolve(serverPath, 'api');
  // const modelPath = path.resolve(serverPath, 'api');
};

export default initWatchers;
