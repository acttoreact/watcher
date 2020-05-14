import { ApiNamespace } from '../model/api';

const updateApiObject = (
  structure: ApiNamespace,
  keys: string[],
  methodName: string,
): ApiNamespace => {
  const newApiObject: ApiNamespace = { ...structure };
  const lastIndex = keys.length - 1;
  return keys.reduce(
    (t: ApiNamespace, key: string, i: number): ApiNamespace => {
      if (i === lastIndex) {
        t.methods.push({
          key,
          methodName,
        });
        return newApiObject;
      }
      let namespace = t.namespaces.find((n): boolean => n.key === key);
      if (!namespace) {
        namespace = {
          key,
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
