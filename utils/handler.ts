import { Handler } from '../model/watcher';

const handler: Handler = async (targetPath, eventName, eventPath): Promise<void> => {
  // eslint-disable-next-line no-console
  console.log('Handler', targetPath, eventName, eventPath);
};

export default handler;