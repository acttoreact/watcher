import { start, stop } from '../../../index';

test('API Watcher starts without crashing', async (): Promise<void> => {
  const watchers = await start();
  expect(watchers.length).toBe(2);
  await stop();
});

// test('API Watcher restarts without crashing', async (): Promise<void> => {
//   await start();
//   const watchers = await restart();
//   expect(watchers.length).toBe(2);
//   await stop();
// });

// test('There are no active watchers after stop', async (): Promise<void> => {
//   await start();
//   await stop();
//   expect(activeWatchers.length).toBe(0);
// });