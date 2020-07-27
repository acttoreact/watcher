import Info, { Data, Source } from '../model/data';

/**
 * Method with camelCase name
 */
const camelCase = async (
  src: Source,
  data: Data = { info: 'default text' },
): Promise<Info> => {
  return {
    info: `${src.info} ${data.info}`,
  };
};

export default camelCase;
