/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import ts from 'typescript';
import { Data } from '../model/data';
import Data2, { Juan } from '../model/data2';

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

interface ComplexData {
  info: string;
  moreInfo: string;
}

interface Data3 {
  info: string;
}

interface Data4 {
  info: string;
}

interface CommonResponse {
  ok: boolean;
  error?: string;
}

interface CustomResponse<T> extends CommonResponse {
  data?: T;
}

interface MoreComplex<T> {
  data?: T;
}

interface SearchResponse {
  took: number;
  timed_out: boolean;
  hits: {
    total: {
      value: number;
      relation: 'eq' | 'gte';
    };
    max_score: number;
  };
}

/**
 * Gets data from server
 * @returns {Promise<model.Data>}
 */
const getData = async (
  data: Data2,
  promise: Promise<Data2>,
  optionalMore: WithOptional<ComplexData, 'moreInfo'>,
  dataArray: Data3[],
  dataOr: Data4 | null,
  edgeCaseMiEureka: Promise<CustomResponse<MoreComplex<SearchResponse>>>,
  pathLike?: ts.TransformationResult<ts.DeclarationStatement>,
): Promise<Data> => {
  const res = await promise;
  const juan: Juan = { info: 'blas' };
  console.log('data server method!', data, juan, res, optionalMore, pathLike, dataArray, dataOr, edgeCaseMiEureka);
  return {
    info: 'Data from API',
  };
};

export default getData;
