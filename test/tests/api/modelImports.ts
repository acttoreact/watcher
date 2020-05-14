import path from 'path';
import waitForExpect from 'wait-for-expect';

import { build } from '../../../utils/apiProxy';
import { emptyFolder, exists } from '../../../tools/fs';

const apiSourcePath = path.resolve(__dirname, '../../mocks/server/model-imports/api');
const proxyTargetPath = path.resolve(__dirname, '../../mocks/.a2r/model-imports/api');
const apiProxyIndexPath = path.resolve(proxyTargetPath, 'index.ts');
const socketProxyPath = path.resolve(proxyTargetPath, 'socket.ts');

beforeAll(async (): Promise<void> => {
  await emptyFolder(proxyTargetPath);
});

/**
 * Model imports should work properly with just default import, with just named imports and with both combined
 */
test('API Proxy build covering different model imports types', async (): Promise<void> => {
  await build(apiSourcePath, proxyTargetPath);
  await waitForExpect(async (): Promise<void> => {
    expect(await exists(socketProxyPath)).toBe(true);
    expect(await exists(apiProxyIndexPath)).toBe(true);
  });
});