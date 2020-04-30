import { OnError } from '../model/watcher';

/**
 * Watcher error handler
 * @param error error information
 */
const onError: OnError = (error): void => {
  // eslint-disable-next-line no-console
  console.log('Watcher Error', error.toString());
};

export default onError;
