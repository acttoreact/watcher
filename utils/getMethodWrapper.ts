import { defaultPort } from '../settings';

const getMethodWrapper = (port = defaultPort): string => {
  return `const methodWrapper = (method: string, ...args: any[]): Promise<any> => {
  console.log('methodWrapper', method, [...args]);
  if (!isClient()) {
    const apiPath = method.split('.').join('/');
    console.log('on server side, calling REST API method', apiPath);
    return new Promise<any>((resolve, reject): void => {
      axios.post('http://localhost:${port}/api/\${apiPath}, { params: args })
        .then(resolve)
        .catch(reject);
    });
  }
  return new Promise<any>((resolve, reject): void => {
    console.log('socket connected?', socket && socket.connected);
    if (socket) {
      if (socket.disconnected) {
        console.log('socket disconnected, connecting');
        socket.connect();
      }
      const id = generateId();
      console.log('id', id);
      socket.on(id, (res: SocketMessage): void => {
        socket.off(id);
        if (res.o) {
          resolve(res.d);
        } else {
          const error = new Error(res.e);
          error.stack = res.s;
          reject(error);
        }
      });

      const call: MethodCall = {
        method,
        id,
        params: args,
      };
      
      console.log('before emit, call:', call);
      socket.emit('*', call);
    } else {
      console.error('No client socket available!');
      reject(new Error('No client socket available!'));
    }
  });
};`;
};

export default getMethodWrapper;
