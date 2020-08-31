import { cookieKey, userTokenKey } from '../settings';

const getHeadersProvider = (): string => `import { GetServerSidePropsContext } from 'next';
import Cookies from 'universal-cookie';

const getHeaders = (ctx?: GetServerSidePropsContext): { Cookie?: string } => {
  if (!ctx || !ctx.req || !ctx.res) {
    console.error('Next.js Context not provided when using A2R API on server side.');
    return {};
  }
  const header = ctx?.req?.headers?.cookie;
  if (!header) {
    console.warn('No cookie header found in request');
    return {};
  }
  const cookies = new Cookies(header);
  const sessionId = cookies.get('${cookieKey}');
  let cookie = \`${cookieKey}=\${sessionId}\`;
  const userToken = cookies.get('${userTokenKey}');
  if (userToken) {
    cookie = \`\${cookie}; ${userTokenKey}=\${userToken}\`;
  }
  return { 'Cookie': cookie };
};

export default getHeaders;`;

export default getHeadersProvider;
