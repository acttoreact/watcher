import ts from 'typescript';
import { Data } from '../model/data';
import Data2, { Juan } from '../model/data2';

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

interface ComplexData {
  info: string;
  moreInfo: string;
}

/**
 * Gets data from server
 * @returns {Promise<model.Data>}
 */
const getData = async (
  data: Data2,
  promise: Promise<Data2>,
  optionalMore: WithOptional<ComplexData, 'moreInfo'>,
  pathLike?: ts.TransformationResult<ts.DeclarationStatement>,
): Promise<Data> => {
  const res = await promise;
  const juan: Juan = { info: 'blas' };
  console.log('data server method!', data, juan, res, optionalMore, pathLike);
  return {
    info: 'Data from API',
  };
};

export default getData;
