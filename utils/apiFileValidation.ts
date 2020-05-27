import ts from 'typescript';
import { out } from '@a2r/telemetry';
import { readFile } from '@a2r/fs';

import { fullPath, method } from '../tools/colors';
import getMainMethodName from './getMainMethodName';
import getMainMethodNode from './getMainMethodNode';
import getFunctionDocContainer from './getFunctionDocContainer';

const fileValidation = async (filePath: string): Promise<boolean> => {
  const content = await readFile(filePath, 'utf8');
  if (content) {
    const sourceFile = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true,
    );
    const fileNodes = sourceFile.getChildren();
    const mainMethodName = getMainMethodName(fileNodes);
    const mainMethodNode = getMainMethodNode(fileNodes, mainMethodName);
    const mainMethodDocs = getFunctionDocContainer(mainMethodNode);
    if (!mainMethodDocs || !mainMethodDocs.jsDoc) {
      out.error(
        `Method ${method(mainMethodName)} at file ${fullPath(
          filePath,
        )} must be documented`,
      );
      return false;
    }
    return true;
  }
  out.error(`File ${fullPath(filePath)} is empty`);
  return false;
};

export default fileValidation;
