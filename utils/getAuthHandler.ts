import { userTokenKey } from '../settings';

const getAuthHandler = (): string => `import Cookies from 'universal-cookie';
import generateId from 'shortid';

import api from './index';
import socket from './socket';

/**
 * Login client method response
 */
interface LoginResponse {
  ok: boolean;
  error?: string;
}

/**
 * Login method
 * @param email User email
 * @param password User password (non encrypted)
 */
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.user.login(email, password);
  const { ok, error, userTokenInfo } = response;
  if (!ok) {
    return { ok, error };
  }

  return new Promise((resolve) => {
    const id = generateId();
    socket.on(id, (userToken: string): void => {
      socket.off(id);
      const cookies = new Cookies();
      cookies.set('${userTokenKey}', userToken, { path: '/' });
      resolve({ ok: true });
    });
    
    socket.emit('a2r_login', id, userTokenInfo);
  });
};

/**
 * Logout method
 */
export const logout = async (): Promise<void> =>
  new Promise((resolve) => {
    const cookies = new Cookies();
    const id = generateId();
    socket.on(id, (userToken: string): void => {
      socket.off(id);
      cookies.remove('${userTokenKey}', { path: '/' });
      resolve();
    });

    const token = cookies.get('${userTokenKey}');
    socket.emit('a2r_logout', id, token);
  });
`;

export default getAuthHandler;
