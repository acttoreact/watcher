import { out } from '@a2r/telemetry';

import { ProcessInfo } from '../model/watcher';

import { getFilesRecursively } from '../tools/fs';

/**
 * Will handle files changes and validate them before
 */
class RuntimeValidator {
  constructor(
    targetPath: string,
    fileValidator: (filePath: string) => Promise<boolean>,
    onSuccess: () => void | Promise<void>,
  ) {
    this.filesToProcess = new Array<string>();
    this.failingFiles = new Map<string, boolean>();
    this.validator = fileValidator;
    this.onSuccess = onSuccess;

    this.processing = true;
    getFilesRecursively(targetPath, ['.ts']).then((files) => {
      this.filesToProcess.push(...files);
      this.processing = false;
      this.processQueue();
    });
  }

  /**
   * Function to validate files
   */
  private validator: (filePath: string) => Promise<boolean>;

  /**
   * Function to be executed if there are no failing files after all files are processed
   */
  private onSuccess: () => void | Promise<void>;

  /**
   * Indicates whether the validator is processing a file or not
   */
  private processing: boolean;

  /**
   * Pending files to process
   */
  private filesToProcess: string[];

  /**
   * Files that didn't pass validation
   */
  private failingFiles: Map<string, boolean>;

  /**
   * Processes pending files (from `filesToProcess`)
   */
  private async processQueue(): Promise<void> {
    if (!this.processing) {
      this.processing = true;
      const filePath = this.filesToProcess.shift();
      if (filePath) {
        const validation = await this.validator(filePath);
        if (validation) {
          this.failingFiles.delete(filePath);
          out.verbose(`Validation OK for file ${filePath}`);
        } else {
          this.failingFiles.set(filePath, true);
          out.verbose(`Validation KO for file ${filePath}`);
        }
        this.processing = false;
        await this.processQueue();
      } else {
        if (!this.failingFiles.size) {
          await this.onSuccess();
        }
        this.processing = false;
      }
    }
  }

  /**
   * Add file to pending files queue
   * @param processInfo Process info from watcher event
   */
  public async addFileToQueue(processInfo: ProcessInfo): Promise<void> {
    const { type, targetPath } = processInfo;
    let newFiles = this.filesToProcess.slice();
    if (type === 'unlink') {
      this.failingFiles.delete(targetPath);
    }
    if (type === 'add' || type === 'change') {
      newFiles = newFiles.filter(p => p !== targetPath);
      newFiles.push(targetPath);
      this.filesToProcess = newFiles;
    }
    if (type !== 'addDir') {
      await this.processQueue();
    }
  }
}

export default RuntimeValidator;
