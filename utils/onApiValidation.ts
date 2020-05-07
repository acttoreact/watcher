import { build } from './apiProxy';
import { isJest } from '../tools/isJest';

const onApiValidation = async (): Promise<void> => {
  if (!isJest()) {
    // TODO: Call to main A2R instance to restart API Runtime
    await build();
  }
};

export default onApiValidation;
