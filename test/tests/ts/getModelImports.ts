import ts from 'typescript';
import path from 'path';

import { readFile, getFilesRecursively } from '../../../tools/fs';
import getModelImports from '../../../utils/getModelImports';
import getGroupedModelImports from '../../../utils/getGroupedModelImports';
import { ModelImport } from '../../../model/api';

const mainPath = path.resolve(__dirname, '../../mocks/server/model-imports');

/**
 * Method should return proper information about model imports on file
 */
test('Get model imports', async (): Promise<void> => {
  const filePath = path.resolve(mainPath, 'api', 'model-imports.ts');
  const content = await readFile(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS,
  );

  const children = sourceFile.getChildren(sourceFile);

  const imports = getModelImports(children, sourceFile);
  expect(imports.length).toBe(2);
});

/**
 * Should group model imports from same path
 */
test('Group model imports from same path', async (): Promise<void> => {
  const apiPath = path.resolve(mainPath, 'api');
  const files = await getFilesRecursively(apiPath, ['.ts']);
  const fileImports = await Promise.all(files.map(async (filePath): Promise<ModelImport[]> => {
    const content = await readFile(filePath, 'utf8');
    const sourceFile = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      false,
      ts.ScriptKind.TS,
    );
  
    const children = sourceFile.getChildren(sourceFile);
  
    return getModelImports(children, sourceFile);
  }));

  const imports = fileImports.reduce((t, i) => [...t, ...i], []);
  expect(imports.length).toBe(5);
  const groupedImports = getGroupedModelImports(imports);
  console.log(groupedImports);
  expect(groupedImports.length).toBe(3);
});