import fs from 'fs';
import util from 'util';

const exists = util.promisify(fs.exists);

export default {
  exists,
};