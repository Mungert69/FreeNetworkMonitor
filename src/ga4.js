import ReactGA4 from 'react-ga4';

export function sendGA4Event(event) {
  const isDevServerLabel = window?.serverLabel?.serverLabel === 'dev';
  if (!isDevServerLabel) {
    ReactGA4.send(event);
  }
}

export function ga4Event(event) {
  const isDevServerLabel = window?.serverLabel?.serverLabel === 'dev';
  if (!isDevServerLabel) {
    ReactGA4.event(event);
  }
}
