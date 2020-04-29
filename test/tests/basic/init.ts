test('API Watcher starts without crashing', async (): Promise<void> => {
  const load = await import('../../../index');
  expect(load).toEqual({});
});