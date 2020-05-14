import { Data } from '../model/data';
import Data2, { Juan } from '../model/data2';

/**
 * Gets data from server
 * @returns {Promise<model.Data>}
 */
const getData = async (data: Data2, juan: Juan): Promise<Data> => {
  console.log('data server method!', data, juan);
  return {
    info: 'Data from API',
  };
};

export default getData;