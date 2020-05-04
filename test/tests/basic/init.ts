import waitForExpect from 'wait-for-expect';

import { start, stop, restart, activeWatchers } from '../../../index';

/**
 * Project must be able to start without crashing
 */
test('API Watcher starts without crashing', async (): Promise<void> => {
  const watchers = await start();
  expect(watchers.length).toBe(2);
  await stop();
});

/**
 * Project must be able to restart without crashing
 */
test('API Watcher restarts without crashing', async (): Promise<void> => {
  await start();
  const watchers = await restart();
  expect(watchers.length).toBe(2);
  await stop();
});

/**
 * Project must be able to stop without crashing and closing every running watcher
 */
test('There are no active watchers after stop', async (): Promise<void> => {
  await start();
  await stop();
  expect(activeWatchers.length).toBe(0);
});

/**
 * Stressing index queue with several process at once
 */
test('Forcing multiple commands at a time to stress queue', async (): Promise<
  void
> => {
  start();
  stop();
  start();
  start();
  start();
  stop();
  stop();
  start();
  stop();
  stop();
  start();
  stop();
  waitForExpect(async (): Promise<void> => {
    expect(activeWatchers.length).toBe(0);
  });
});
