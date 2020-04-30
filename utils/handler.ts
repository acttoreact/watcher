import { Handler } from '../model/watcher';

/**
 * Main handler for watcher events
 * @param targetPath main path containing both `api` and `model` folders
 * @param eventName event type
 * @param eventPath specific event path (absolute)
 */
const handler: Handler = async (targetPath, eventName, eventPath): Promise<void> => {
  // eslint-disable-next-line no-console
  console.log('Handler', targetPath, eventName, eventPath);
};

export default handler;