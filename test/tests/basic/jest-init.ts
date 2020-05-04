import waitForExpect from 'wait-for-expect';

import { setForceDisableJestDetection } from '../../../tools/isJest';

test('Should init when jest forced disabled', async (): Promise<void> => {
  setForceDisableJestDetection(true);
  const index = await import('../../../index');
  await waitForExpect(async (): Promise<void> => {
    expect(index.activeWatchers.length).toBe(2);
  });
  await index.stop();
  expect(index.activeWatchers.length).toBe(0);
});