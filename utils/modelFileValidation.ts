import ts from 'typescript';
import { out } from '@a2r/telemetry';
import chalk from 'chalk';

import { readFile } from '../tools/fs';
import { fullPath } from '../tools/colors';
import getExportsIdentifiersFromNodes from './getExportsIdentifiersFromNodes';

const modelKeys = new Map<string, string>();

const fileValidation = async (filePath: string): Promise<boolean> => {
  const content = await readFile(filePath, 'utf8');
  if (content) {
    const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
    const fileNodes = sourceFile.getChildren();
    const identifiers = getExportsIdentifiersFromNodes(fileNodes);
    let validated = true;
    for (let i = 0, l = identifiers.length; i < l && validated; i += 1) {
      const identifier = identifiers[i];
      const keyPath = modelKeys.get(identifier);
      if (keyPath) {
        validated = false;
        out.error(`There is already a type, interface or enum called ${chalk.bold(
          identifier,
        )} on file ${fullPath(keyPath)}`);
      }
    }
    if (validated) {
      identifiers.forEach((k) => {
        modelKeys.set(k, filePath);
      });
    }
    return validated;
  }
  out.error(`File ${fullPath(filePath)} is empty`);
  return false;
};

export default fileValidation;
