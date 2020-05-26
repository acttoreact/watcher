import fs from 'fs';
import util from 'util';
import path from 'path';
import originalRimraf from 'rimraf';

/**
 * Create a directory
 */
export const mkDir = util.promisify(fs.mkdir);

/**
 * Delete a directory.
 */
export const rmDir = util.promisify(fs.rmdir);

/**
 * The [UNIX command](http://en.wikipedia.org/wiki/Rm_(Unix)) `rm -rf` for node
 */
export const rimraf = util.promisify(originalRimraf);

/**
 * Writes data to a file, replacing the file if it already exists.
 */
export const writeFile = util.promisify(fs.writeFile);

/**
 * Read a directory.
 */
export const readDir = util.promisify(fs.readdir);

/**
 * Reads the entire contents of a file.
 */
export const readFile = util.promisify(fs.readFile);

/**
 * Copies `src` to `dest`. By default, dest is overwritten if it already exists. No arguments other than a possible exception are given to the callback function. Node.js makes no guarantees about the atomicity of the copy operation. If an error occurs after the destination file has been opened for writing, Node.js will attempt to remove the destination.
 */
export const copyFile = util.promisify(fs.copyFile);

/**
 * Deletes a name and possibly the file it refers to.
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
export const getFilesRecursively = async (
  folderPath: string,
  extName?: string[],
): Promise<string[]> => {
  const contents = await readDir(folderPath, {
    encoding: 'utf8',
    withFileTypes: true,
  });
  const files = await Promise.all(
    contents.map(
      async (content): Promise<string[]> => {
        if (content.isDirectory()) {
          const folderFiles = await getFilesRecursively(
            path.resolve(folderPath, content.name),
            extName,
          );
          return folderFiles;
        }
        const ext = path.extname(content.name);
        if (!extName || !extName.length || extName.indexOf(ext) !== -1) {
          return [path.resolve(folderPath, content.name)];
        }
        return [];
      },
    ),
  );
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
