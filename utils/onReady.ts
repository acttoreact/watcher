import { OnReady } from '../model/watcher';

const onReady: OnReady = (_watcher, targetPath) => {
  // eslint-disable-next-line no-console
  console.log('Watcher ready at', targetPath);
};

export default onReady;
