import path from 'path';
import chokidar from 'chokidar';

test('Chokidar closing properly', async (): Promise<void> => {
  const targetPath = path.resolve(__dirname, '../../mocks/server/api');
  const watcher = chokidar.watch(targetPath);
  await watcher.close();
});