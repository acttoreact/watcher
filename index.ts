import initWatchers from './utils/initWatchers';

if (initWatchers('./test/mocks/server')) {
  // eslint-disable-next-line no-console
  console.log('Watchers ready and listening');;  
} else {
  // eslint-disable-next-line no-console
  console.log('Watchers ready and listening');;
}