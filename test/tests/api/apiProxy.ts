import path from 'path';
import waitForExpect from 'wait-for-expect';

import { build } from '../../../utils/apiProxy';
import { emptyFolder, exists } from '../../../tools/fs';

const apiSourcePath = path.resolve(__dirname, '../../mocks/server/module-info/api');
const proxyTargetPath = path.resolve(__dirname, '../../mocks/.a2r/api-proxy/api');
const apiProxyIndexPath = path.resolve(proxyTargetPath, 'index.ts');
const socketProxyPath = path.resolve(proxyTargetPath, 'socket.ts');

beforeAll(async (): Promise<void> => {
  emptyFolder(proxyTargetPath);
});

/**
 * API Proxy should build expected content
 */
test('API Proxy build', async (): Promise<void> => {
  await build(apiSourcePath, proxyTargetPath);
  await waitForExpect(async (): Promise<void> => {
    expect(await exists(socketProxyPath)).toBe(true);
    expect(await exists(apiProxyIndexPath)).toBe(true);
  });
}, 10000);
