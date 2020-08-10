/* eslint-disable @typescript-eslint/no-explicit-any */
import ts from 'typescript';

/**
 * For typescript nodes casting as docs container purposes
 */
export interface JSDocContainer {
  /**
   * Optional JSDoc array
   * @type {ts.JSDoc[]}
   * @memberof JSDocContainer
   */
  jsDoc?: ts.JSDoc[];
}

/**
 * Information regarding the return type of a function extracted using AST
 */
export interface ReturnTypeInfo {
  /**
   * Return identifier
   * @type {string}
   * @memberof CompilerFileInfo
   */
  identifier: string;
  /**
   * Return type
   * @type {string}
   * @memberof CompilerFileInfo
   */
  type: string;
  /**
   * Return type
   * @type {string}
   * @memberof CompilerFileInfo
   */
  typeNode: ts.TypeNode | null;
}

/**
 * Model imports information
 */
export interface ImportClause {
  /**
   * Import clause
   */
  clause: ts.ImportClause;
  /**
   * Path to import from
   */
  path: string;
  /**
   * Related source file
   */
  sourceFile?: ts.SourceFile;
}

/**
 * Model imports information
 */
export interface GroupedImports {
  /**
   * Default import
   */
  def?: string;
  /**
   * Named imports
   */
  named?: string[];
  /**
   * Path to import from
   */
  path: string;
}

/**
 * API module info
 */
export interface ModuleInfo {
  /**
   * Main method node
   * @memberof ModuleInfo
   */
  mainMethodNode: ts.FunctionDeclaration | ts.ArrowFunction;
  /**
   * Main method name
   * @memberof ModuleInfo
   */
  mainMethodName: string;
  /**
   * Main method parameters nodes
   * @type {ts.ParameterDeclaration[]}
   * @memberof ModuleInfo
   */
  mainMethodParamNodes: ts.ParameterDeclaration[];
  /**
   * Main method JSDoc node
   * @type {JSDocContainer}
   * @memberof ModuleInfo
   */
  mainMethodDocs: JSDocContainer;
  /**
   * Main method return type info
   * @type {ReturnTypeInfo}
   * @memberof ModuleInfo
   */
  mainMethodReturnTypeInfo: Required<ReturnTypeInfo>;
  /**
   * Module model imports
   */
  modelImports: ImportClause[];
  /**
   * Keys based on file path (for proxy API object)
   */
  keys: string[];
}

/**
 * API Method in Client API structure
 */
export interface ApiMethod {
  /**
   * Property key
   * @type {string}
   * @memberof ApiMethod
   */
  key: string;
  /**
   * Method name
   * @type {string}
   * @memberof ApiMethod
   */
  methodName: string;
}

/**
 * API Namespace in proxy API structure
 */
export interface ApiNamespace {
  /**
   * Property key
   * @type {string}
   * @memberof ApiNamespace
   */
  key: string;
  /**
   * Namespaces for property (object sub-objects)
   * @type {ApiNamespace[]}
   * @memberof ApiNamespace
   */
  namespaces: ApiNamespace[];
  /**
   * Methods for property (object methods)
   * @type {ApiMethod[]}
   * @memberof ApiNamespace
   */
  methods: ApiMethod[];
}

/**
 * API module
 */
export interface APIModule {
  /**
   * Module default export. Must be a `function` and return a `Promise`. Should contain a method to be called from client
   * @memberof APIModule
   */
  default: (...args: any[]) => Promise<any>;
  /**
   * Module dispose method. Optional. Will be called when a module is disposed or updated.
   * @memberof APIModule
   */
  dispose?: () => Promise<void>;
}

/**
 * API levels structure
 */
export interface APIStructure {
  [id: string]: APIModule;
}