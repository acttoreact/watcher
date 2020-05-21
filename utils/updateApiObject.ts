import { ApiNamespace } from '../model/api';

import cleanText from '../tools/cleanText';

const updateApiObject = (
  structure: ApiNamespace,
  keys: string[],
  methodName: string,
): ApiNamespace => {
  const newApiObject: ApiNamespace = { ...structure };
  const lastIndex = keys.length - 1;
  return keys.reduce(
    (t: ApiNamespace, key: string, i: number): ApiNamespace => {
      const cleanKey = cleanText(key, false, true, true, true, '-');
      if (i === lastIndex) {
        t.methods.push({
          key: cleanKey,
          methodName,
        });
        return newApiObject;
      }
      let namespace = t.namespaces.find((n): boolean => n.key === cleanKey);
      if (!namespace) {
        namespace = {
          key: cleanKey,
          namespaces: [],
          methods: [],
        };
        t.namespaces.push(namespace);
      }
      return namespace;
    },
    newApiObject,
  );
};

export default updateApiObject;
