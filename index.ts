import path from 'path';

import initWatchers from './utils/initWatchers';

const activeWatchers = [];
const serverPath = path.resolve(__dirname, './server');

initWatchers(serverPath);

export const start = () => {
  
};

export const stop = () => {

};

start();
