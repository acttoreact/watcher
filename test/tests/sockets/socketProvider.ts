import getSocketProvider from '../../../utils/getSocketProvider';

import { socketPort, socketPath } from '../../../settings';

/**
 * Socket provider should return expected content
 */
test('Socket provider should build interfaces and client socket', (): void => {
  const url = `http://localhost:${socketPort}`;
  const expected = `import io from "socket.io-client";

/**
 * Socket method call
 */
export interface MethodCall extends SocketCall {
  /**
   * API Method name corresponding to complete key (like 'users.login')
   * @memberof MethodCall
   */
  method: string;
  /**
   * Params for API Method
   * @memberof MethodCall
   */
  params: any[];
};

/**
 * Socket standard response
 */
export interface SocketMessage {
  /**
   * Operation was ok (0) or not (1)
   * @memberof SocketMessage
   */
  o: number;
  /**
   * Operation error (if any)
   * @memberof SocketMessage
   */
  e?: string;
  /**
   * Operation stack (if error)
   * @memberof SocketMessage
   */
  s?: string;
  /**
   * Operation return data
   * @memberof SocketMessage
   */
  d: any;
};

const socket = io(${url}, {
  autoConnect: !!process.browser,
  path: "${socketPath}",
});

export default socket;`

  const socketProvider = getSocketProvider();
  expect(socketProvider).toBe(expected);
});