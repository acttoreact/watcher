import { out } from '@a2r/telemetry';

import { OnError } from '../model/watcher';

/**
 * Watcher error handler
 * @param error error information
 */
const onError: OnError = (error): void => {
  out.error(`Watcher error: ${error.message}\n${error.stack}`, error);
};

export default onError;
