import ts from 'typescript';
import path from 'path';
import { readFile } from '@a2r/fs';

// import getModelImports from '../../../utils/getModelImports';
import getMainMethodName from '../../../utils/getMainMethodName';
import getMainMethodNode from '../../../utils/getMainMethodNode';
import getFunctionReturnTypeInfo from '../../../utils/getFunctionReturnTypeInfo';
import getParamsTypes from '../../../utils/getParamsTypes';

const mainPath = path.resolve(__dirname, '../../mocks/server/model-imports');

/**
 * Method should return proper information about model imports on file
 */
// test('Get model imports', async (): Promise<void> => {
//   const filePath = path.resolve(mainPath, 'api', 'model-imports.ts');
//   const content = await readFile(filePath, 'utf8');
//   const sourceFile = ts.createSourceFile(
//     filePath,
//     content,
//     ts.ScriptTarget.Latest,
//     false,
//     ts.ScriptKind.TS,
//   );

//   const children = sourceFile.getChildren(sourceFile);

//   const imports = getModelImports(children, sourceFile);
//   expect(imports.length).toBe(2);
// });

/**
 * Needed imports are only the ones used on method params and method return type
 */
test('Filter needed imports', async (): Promise<void> => {
  const filePath = path.resolve(mainPath, 'api', 'model-imports.ts');
  const content = await readFile(filePath, 'utf8');
  const mainMethodParamNodes: ts.ParameterDeclaration[] = [];
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
  );
  const fileNodes = sourceFile.getChildren();
  const mainMethodName = getMainMethodName(fileNodes);
  const mainMethodNode = getMainMethodNode(fileNodes, mainMethodName);
  mainMethodNode.forEachChild((child): void => {
    if (ts.isParameter(child)) {
      mainMethodParamNodes.push(child);
    }
  });
  const mainMethodReturnTypeInfo = getFunctionReturnTypeInfo(mainMethodNode);
  const paramsTypeInfo = mainMethodParamNodes.reduce(
    (t, n) => [...t, ...getParamsTypes(n.getChildren(sourceFile), sourceFile)],
    [],
  );
  paramsTypeInfo.push(...getParamsTypes([mainMethodReturnTypeInfo.typeNode]));
  expect(paramsTypeInfo).toContain('Data');
  expect(paramsTypeInfo).toContain('Data2');
  expect(paramsTypeInfo).toContain('Data3');
  expect(paramsTypeInfo).toContain('Data4');
  expect(paramsTypeInfo).toContain('WithOptional');
  expect(paramsTypeInfo).toContain('ComplexData');
  expect(paramsTypeInfo).toContain('ts.TransformationResult');
});

/**
 * Should group model imports from same path
 */
// test('Group model imports from same path', async (): Promise<void> => {
//   const apiPath = path.resolve(mainPath, 'api');
//   const files = await getFilesRecursively(apiPath, ['.ts']);
//   const fileImports: ModelImport[][] = await Promise.all(
//     files.map(
//       async (filePath): Promise<ModelImport[]> => {
//         const content = await readFile(filePath, 'utf8');
//         const sourceFile = ts.createSourceFile(
//           filePath,
//           content,
//           ts.ScriptTarget.Latest,
//           false,
//           ts.ScriptKind.TS,
//         );

//         const children = sourceFile.getChildren(sourceFile);

//         return getModelImports(children, sourceFile);
//       },
//     ),
//   );

//   const imports = fileImports.reduce((t, i) => [...t, ...i], []);
//   expect(imports.length).toBe(5);
//   const groupedImports = getGroupedModelImports(imports);
//   expect(groupedImports.length).toBe(3);
// });
