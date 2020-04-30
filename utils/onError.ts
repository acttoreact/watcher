import { OnError } from '../model/watcher';

const onError: OnError = (error): void => {
  // eslint-disable-next-line no-console
  console.log('Watcher Error', error.toString());
};

export default onError;
