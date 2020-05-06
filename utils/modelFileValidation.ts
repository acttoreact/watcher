import { out } from '@a2r/telemetry';

import { readFile } from '../tools/fs';
import { fullPath } from '../tools/colors';

const fileValidation = async (filePath: string): Promise<boolean> => {
  const content = await readFile(filePath, 'utf8');
  if (!content) {
    out.error(`File ${fullPath(filePath)} is empty`);
    return false;
  }
  return true;
};

export default fileValidation;
