import { ApiNamespace } from '../../../model/api';

import updateApiObject from '../../../utils/updateApiObject';

/**
 * Method should build API object properly
 */
test('Update API object', () => {
  let apiObject: ApiNamespace = {
    key: 'api',
    namespaces: [],
    methods: [],
  };
  apiObject = updateApiObject(apiObject, ['data', 'users', 'list'], 'list');
  apiObject = updateApiObject(apiObject, ['data', 'users', 'add'], 'add');
  apiObject = updateApiObject(apiObject, ['data', 'items', 'list'], 'list');
  apiObject = updateApiObject(apiObject, ['data', 'items', 'add'], 'add');
  apiObject = updateApiObject(apiObject, ['whatever', 'import'], 'import');
  apiObject = updateApiObject(apiObject, ['whatever', 'export'], 'export');
  apiObject = updateApiObject(apiObject, ['ping'], 'ping');
  expect(apiObject.key).toBe('api');
  expect(apiObject.namespaces.length).toBe(2);
  expect(apiObject.methods.length).toBe(1);
  const dataNamespace = apiObject.namespaces.find(n => n.key === 'data');
  expect(dataNamespace).toBeTruthy();
  const usersNamespace = dataNamespace.namespaces.find(n => n.key === 'users');
  expect(usersNamespace).toBeTruthy();
  const addUserMethod = usersNamespace.methods.find(m => m.key === 'add');
  expect(addUserMethod).toBeTruthy();
});