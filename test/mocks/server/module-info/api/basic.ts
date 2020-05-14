import Info, { Data, Source } from '../model/data';

/**
 * Method documentation
 */
const method = async (
  src: Source,
  data: Data = { info: 'default text' },
): Promise<Info> => {
  return {
    info: `${src.info} ${data.info}`,
  };
};

export default method;
