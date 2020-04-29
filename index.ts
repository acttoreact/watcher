import path from 'path';

import initWatchers from './utils/initWatchers';

const serverPath = path.resolve(__dirname, './server');
initWatchers(serverPath);