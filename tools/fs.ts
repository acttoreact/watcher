import fs from 'fs';
import util from 'util';
import path from 'path';
import originalRimraf from 'rimraf';

/**
 * Create a directory
 * @param {fs.PathLike} path A path to a file. If a URL is provided, it must use the `file:` protocol.
 * @param {fs.MakeDirectoryOptions & { recursive: true }} options Either the file mode, or an object optionally specifying the file mode and whether parent folders should be created. If a string is passed, it is parsed as an octal integer. If not specified, defaults to `0o777`.
 */
export const mkDir = util.promisify(fs.mkdir);

/**
 * Delete a directory.
 * @param {fs.PathLike} path A path to a file. If a URL is provided, it must use the `file:` protocol.
 */
export const rmDir = util.promisify(fs.rmdir);

/**
 * The [UNIX command](http://en.wikipedia.org/wiki/Rm_(Unix)) `rm -rf` for node
 * @param {string} path Folder path to remove recursively
 * @param {originalRimraf.Options} options [`rimraf`](https://github.com/isaacs/rimraf#options) options
 */
export const rimraf = util.promisify(originalRimraf);

/**
 * Writes data to a file, replacing the file if it already exists.
 * @param {string | number | Buffer | URL} path A path to a file. If a URL is provided, it must use the `file:` protocol. URL support is experimental. If a file descriptor is provided, the underlying file will not be closed automatically.
 * @param {any} data The data to write. If something other than a Buffer or Uint8Array is provided, the value is coerced to a string.
 * @param {fs.WriteFileOptions} options Either the encoding for the file, or an object optionally specifying the encoding, file mode, and flag. If `encoding` is not supplied, the default of `'utf8'` is used. If `mode` is not supplied, the default of `0o666` is used. If `mode` is a string, it is parsed as an octal integer. If `flag` is not supplied, the default of `'w'` is used.
 */
export const writeFile = util.promisify(fs.writeFile);

/**
 * Read a directory.
 * @param {fs.PathLike} path A path to a file. If a URL is provided, it must use the `file:` protocol.
 * @param {{ encoding: BufferEncoding; withFileTypes?: false; } | "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex"} options The encoding (or an object specifying the encoding), used as the encoding of the result. If not provided, 'utf8' is used
 */
export const readDir = util.promisify(fs.readdir);

/**
 * Reads the entire contents of a file.
 * @param {string | number | Buffer | URL} path A path to a file. If a URL is provided, it must use the `file:` protocol. If a file descriptor is provided, the underlying file will not be closed automatically.
 * @param {string | { encoding?: null; flag?: string; }} options An object that may contain an optional flag. If a flag is not provided, it defaults to `'r'`.
 */
export const readFile = util.promisify(fs.readFile);

/**
 * Copies `src` to `dest`. By default, dest is overwritten if it already exists. No arguments other than a possible exception are given to the callback function. Node.js makes no guarantees about the atomicity of the copy operation. If an error occurs after the destination file has been opened for writing, Node.js will attempt to remove the destination.
 * @param {fs.PathLike} src A path to the source file.
 * @param {fs.PathLike} dest A path to the destination file.
 */
export const copyFile = util.promisify(fs.copyFile);

/**
 * Deletes a name and possibly the file it refers to.
 * @param {fs.PathLike} path A path to a file. If a URL is provided, it must use the `file:` protocol.
 */
export const unlink = util.promisify(fs.unlink);

/**
 * Test whether or not the given path exists by checking with the file system.
 * @param {fs.PathLike} pathToCheck A path to a file or directory. If a URL is provided, it must use the `file:` protocol. URL support is experimental.
 */
export const exists = (pathToCheck: fs.PathLike): Promise<boolean> =>
  new Promise((resolve): void => {
    fs.access(pathToCheck, fs.constants.F_OK, (err): void => {
      if (err) {
        return resolve(false);
      }
      return resolve(true);
    });
  });

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

/**
 * Ensures that given dir path exists
 * @param {string} folderPath Path to ensure
 * @param {fs.MakeDirectoryOptions} options Options
 */
export const ensureDir = async (
  folderPath: string,
  options?: fs.MakeDirectoryOptions,
  recursive = true,
): Promise<void> => {
  await new Promise((resolve, reject): void => {
    fs.mkdir(
      folderPath,
      { ...(options || {}), recursive },
      (err: NodeJS.ErrnoException | null): void => {
        if (err && err.code !== 'EEXIST') {
          reject(err);
        } else {
          resolve();
        }
      },
    );
  });
};

/**
 * Gets files recursively
 * @param folderPath Path to get files from
 */
export const getFilesRecursively = async (folderPath: string): Promise<string[]> => {
  const contents = await readDir(folderPath, { encoding: 'utf8', withFileTypes: true });
  const files = await Promise.all(contents.map(async (content): Promise<string[]> => {
    if (content.isDirectory()) {
      const folderFiles = await getFilesRecursively(path.resolve(folderPath, content.name));
      return folderFiles;
    }
    return [path.resolve(folderPath, content.name)];
  }));
  return files.reduce((t, f) => [...t, ...f], []);
};

/**
 * Copies contents recursively from `fromPath` to `destPath`
 * @param {string} fromPath Source path
 * @param {string} destPath Destination path
 * @param {string} [relativePath=''] Relative path
 */
export const copyContents = async (
  fromPath: string,
  destPath: string,
  hard = true,
  relativePath = '',
): Promise<void> => {
  const contentsPath = path.resolve(fromPath, relativePath);
  await ensureDir(destPath);
  const contents = await readDir(contentsPath, { withFileTypes: true });
  await Promise.all(
    contents.map(
      async (pathInfo: fs.Dirent): Promise<void> => {
        const { name: relPath } = pathInfo;
        const fullRelPath = path.join(relativePath, relPath);
        const sourcePath = path.resolve(fromPath, fullRelPath);
        const targetPath = path.resolve(destPath, fullRelPath);

        if (pathInfo.isDirectory()) {
          await ensureDir(targetPath);
          await copyContents(fromPath, destPath, hard, fullRelPath);
        } else {
          const write = hard || !(await exists(targetPath));
          if (write) {
            await copyFile(sourcePath, targetPath);
          }
        }
      },
    ),
  );
};
