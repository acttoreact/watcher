import fs from 'fs';
import util from 'util';

/**
 * Asynchronously tests whether or not the given path exists by checking with the file system.
 * @param path A path to a file or directory. If a URL is provided, it must use the `file:` protocol. URL support is experimental.
 */
const exists = (path): Promise<boolean> =>
  new Promise((resolve): void => {
    fs.access(path, fs.constants.F_OK, (err): void => {
      if (err) {
        return resolve(false);
      }
      return resolve(true);
    });
  });

/**
 * Asynchronous read a directory.
 * @param path A path to a file. If a URL is provided, it must use the file: protocol.
 * @param options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, 'utf8' is used
 */
export const readDir = util.promisify(fs.readdir);
