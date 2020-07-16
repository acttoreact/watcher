import { socketPath, defaultPort } from '../settings';

const getSocketProvider = (port = defaultPort): string => {
  const url = `http://localhost:${port}`;

  return `import io from "socket.io-client";

import isClient from './isClient';

/**
 * Socket basic call
 */
export interface SocketCall {
  /**
   * Unique ID for socket transmission
   * @type {string}
   * @memberof MethodCall
   */
  id: string;
}

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

/**
 * A2R Socket
 */
export interface A2RSocket extends io.Socket {
  sessionId: string;
};

const socket = io('${url}', {
  autoConnect: isClient(),
  path: '${socketPath}',
});

export default socket as A2RSocket;`;
};

export default getSocketProvider;