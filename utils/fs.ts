import fs from 'fs';
import util from 'util';
import originalRimraf from 'rimraf';

/**
 * The [UNIX command](http://en.wikipedia.org/wiki/Rm_(Unix)) `rm -rf` for node
 * @param {string} path Folder path to remove recursively
 * @param {originalRimraf.Options} options [`rimraf`](https://github.com/isaacs/rimraf#options) options
 */
export const rimraf = util.promisify(originalRimraf);

/**
 * Create a directory
 * @param {fs.PathLike} path A path to a file. If a URL is provided, it must use the `file:` protocol.
 * @param {fs.MakeDirectoryOptions & { recursive: true }} options Either the file mode, or an object optionally specifying the file mode and whether parent folders should be created. If a string is passed, it is parsed as an octal integer. If not specified, defaults to `0o777`.
 */
export const mkDir = util.promisify(fs.mkdir);

/**
 * Writes data to a file, replacing the file if it already exists.
 * @param {string | number | Buffer | URL} path A path to a file. If a URL is provided, it must use the `file:` protocol. URL support is experimental. If a file descriptor is provided, the underlying file will not be closed automatically.
 * @param {any} data The data to write. If something other than a Buffer or Uint8Array is provided, the value is coerced to a string.
 * @param {fs.WriteFileOptions} options Either the encoding for the file, or an object optionally specifying the encoding, file mode, and flag. If `encoding` is not supplied, the default of `'utf8'` is used. If `mode` is not supplied, the default of `0o666` is used. If `mode` is a string, it is parsed as an octal integer. If `flag` is not supplied, the default of `'w'` is used.
 */
export const writeFile = util.promisify(fs.writeFile);

/**
 * Test whether or not the given path exists by checking with the file system.
 * @param {fs.PathLike} path A path to a file or directory. If a URL is provided, it must use the `file:` protocol. URL support is experimental.
 */
export const exists = (path: fs.PathLike): Promise<boolean> =>
  new Promise((resolve): void => {
    fs.access(path, fs.constants.F_OK, (err): void => {
      if (err) {
        return resolve(false);
      }
      return resolve(true);
    });
  });

/**
 * Read a directory.
 * @param {fs.PathLike} path A path to a file. If a URL is provided, it must use the `file:` protocol.
 * @param {{ encoding: BufferEncoding; withFileTypes?: false; } | "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex"} options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, 'utf8' is used
 */
export const readDir = util.promisify(fs.readdir);

/**
 * Empties given folder by removing it and creating it again
 * @param {string} folderPath Folder path to be emptied
 */
export const emptyFolder = async (folderPath: string): Promise<void> => {
  const pathExists = await exists(folderPath);
  if (pathExists) {
    await rimraf(folderPath);
  }
  await mkDir(folderPath, { recursive: true });
};
