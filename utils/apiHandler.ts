import path from 'path';
import chalk from 'chalk';

import { Handler, ProcessInfo } from '../model/watcher';

import { runtimePath } from '../settings';
import out from '../tools/out';
import { copyContents } from '../tools/fs';
import { fullPath } from '../tools/colors';
import fileValidation from './fileValidation';

let watcherTargetPath = '';
let appMainPath = '';
let filesToProcess: string[] = [];
let processing = false;
const failingFiles = new Map<string, boolean>();

const checkAndCopy = async (): Promise<void> => {
  const runtimePathDest = path.resolve(appMainPath, runtimePath);
  if (!failingFiles.size) {
    out.verbose('Copying contents');
    await copyContents(watcherTargetPath, runtimePathDest);
  }
}

const processQueue = async (): Promise<void> => {
  if (!processing) {
    processing = true;
    const filePath = filesToProcess.shift();
    if (filePath) {
      const validation = await fileValidation(filePath);
      if (validation) {
        failingFiles.delete(filePath);
        out.verbose(`Validation OK for file ${filePath}`);
      } else {
        failingFiles.set(filePath, true);
        out.verbose(`Validation KO for file ${filePath}`);
      }
      processing = false;
      await processQueue();
    } else {
      processing = false;
      await checkAndCopy();
    }
  }
};

const addFileToQueue = async (processInfo: ProcessInfo): Promise<void> => {
  const { type, targetPath } = processInfo;
  let newFiles = filesToProcess.slice();
  if (type === 'unlink') {
    failingFiles.delete(targetPath);
  }
  if (type === 'add' || type === 'change') {
    newFiles = newFiles.filter(p => p !== targetPath);
    newFiles.push(targetPath);
    filesToProcess = newFiles;
  }
  if (type !== 'addDir') {
    await processQueue();
  }
};

/**
 * Main handler for watcher events
 * @param targetPath main path containing both `api` and `model` folders
 * @param eventName event type
 * @param eventPath specific event path (absolute)
 */
export const handler: Handler = async (eventName, eventPath): Promise<void> => {
  out.verbose(`Watcher handler. Event ${chalk.italic(eventName)} on file ${fullPath(eventPath)}`);
  await addFileToQueue({ targetPath: eventPath, type: eventName });
};

export const setup = (targetPath: string, mainPath: string): void => {
  out.verbose('API Handler setup');
  failingFiles.clear();
  watcherTargetPath = targetPath;
  appMainPath = mainPath;
};
