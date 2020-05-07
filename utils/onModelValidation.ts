import path from 'path';

import { copyContents, emptyFolder } from '../tools/fs';
import { isJest } from '../tools/isJest';

import { targetPath, proxyPath, modelPath } from '../settings';

const modelSourcePath = path.resolve(process.cwd(), targetPath, modelPath);
const proxyTargetPath = path.resolve(process.cwd(), proxyPath, modelPath);

const onModelValidation = async (): Promise<void> => {
  if (!isJest()) {
    await emptyFolder(proxyTargetPath);
    await copyContents(modelSourcePath, proxyTargetPath);
  }
};

export default onModelValidation;
