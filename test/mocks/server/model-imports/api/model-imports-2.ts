import { Data } from '../model/data';
import Data2, { Blas } from '../model/data2';

/**
 * Gets data from server
 * @returns {Promise<model.Data>}
 */
const getData = async (data: Data2, blas: Blas): Promise<Data> => {
  console.log('data server method!', data, blas);
  return {
    info: 'Data from API',
  };
};

export default getData;