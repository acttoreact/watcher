import { out } from '@a2r/telemetry';
import { getFilesRecursively } from '@a2r/fs';

import { ProcessInfo, OnValidation } from '../model/watcher';

/**
 * Will handle files changes and validate them before
 */
class RuntimeValidator {
  constructor(
    fileValidator: (filePath: string) => Promise<boolean>,
    onValidation: OnValidation,
    sourcePath: string,
    targetPath?: string,
  ) {
    this.filesToProcess = new Array<string>();
    this.failingFiles = new Map<string, boolean>();
    this.validator = fileValidator;
    this.onValidation = onValidation;
    this.sourcePath = sourcePath;
    this.targetPath = targetPath;

    this.processing = true;
    getFilesRecursively(sourcePath, ['.ts']).then((files) => {
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
  private onValidation: OnValidation;

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
  public failingFiles: Map<string, boolean>;

  /**
   * Source path
   */
  public sourcePath: string;

  /**
   * Target path
   */
  public targetPath?: string;

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
          out.warn(`Validation KO for file ${filePath}`);
        }
        this.processing = false;
        await this.processQueue();
      } else {
        if (!this.failingFiles.size) {
          await this.onValidation(this.sourcePath, this.targetPath);
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
