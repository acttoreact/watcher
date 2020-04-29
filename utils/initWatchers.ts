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
<<<<<<< HEAD
  // eslint-disable-next-line no-console
  console.log('Starting watchers');
=======
  // console.log('Starting watchers');
>>>>>>> d3e25896e4f123289bc8321bc005521e9098426a

  // const apiPath = path.resolve(serverPath, 'api');
  // const modelPath = path.resolve(serverPath, 'api');
};

export default initWatchers;
