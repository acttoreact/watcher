import Data3 from '../model/data3';

/**
 * Gets data from server
 * @returns {Promise<model.Data>}
 */
const getData = async (): Promise<Data3> => {
  return {
    info: 'Data from API',
  };
};

export default getData;