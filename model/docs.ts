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
