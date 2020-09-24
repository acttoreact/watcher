import { CustomResponse, RedisDictionaries } from '../../model/commonTypes';
import { License } from '../../model/drm';
import { getDictionaryField } from '../../utils/redisManager';
import getLicenses from '../../utils/drm/getLicenses';

/**
 * DRM to check access for a book
 *
 * @param {string} book - Book id
 * @param {string} user - User id, optional
 */
const checkLicense = async (
  book: string,
  user?: string,
): Promise<CustomResponse<License>> => {
  const userId = user || undefined;

  const ip = '2.136.101.9';

  const referred = 'https://my-referred-ip/mieureka/referred/login';

  const licenses = await getLicenses({
    books: [book],
    user: userId,
    ip,
    referred,
  });

  if (!licenses || !licenses.length) {
    return {
      ok: false,
      error: 'No license found',
    };
  }

  const filteredLicenses: License[] = [];

  for (let i = 0; i < licenses.length; i++) {
    const lic = licenses[i];
    if (!lic.concurrency) {
      filteredLicenses.push(lic);
    } else {
      // eslint-disable-next-line no-await-in-loop
      const concurrentUses = await getDictionaryField<number>(
        RedisDictionaries.licenses,
        book,
      );
      if (!concurrentUses || concurrentUses < lic.concurrency) {
        filteredLicenses.push(lic);
      }
    }
  }
  if (!filteredLicenses || !filteredLicenses.length) {
    return {
      ok: false,
      error: 'No license found',
    };
  }

  return {
    ok: true,
    data: filteredLicenses[0],
  };
};

export default checkLicense;
