import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from './app';
//import ReactGA4 from 'react-ga4';

const createMockComponent = (text) => () => <div>{text}</div>;

vi.mock('./components/dashboard/Dashboard', () => ({
  default: createMockComponent('Dashboard Mock'),
}));

vi.mock('./components/main/Pricing', () => ({
  default: createMockComponent('Pricing Mock'),
}));

vi.mock('./components/main/Faq', () => ({
  default: createMockComponent('FAQ Mock'),
}));

vi.mock('./components/main/ProductDetail', () => ({
  default: createMockComponent('Product Detail Mock'),
}));

vi.mock('./components/main/Download', () => ({
  default: createMockComponent('Download Mock'),
}));

vi.mock('./components/start-login-proxy', () => ({
  default: createMockComponent('Start Login Proxy Mock'),
}));

/*vi.mock('react-ga4', () => {
  const initialize = vi.fn();
  const send = vi.fn();
  const event = vi.fn();

  return {
    default: { initialize, send, event },
    initialize,
    send,
    event,
  };
});*/

vi.mock('./components/help/NotFound', () => ({ default: () => <h1>Page not found</h1> }));

describe('App', () => {
  beforeEach(() => {
    window.serverLabel = { serverLabel: 'prod' };
    if (!window.gtag) {
      window.gtag = vi.fn();
    }
    window.gtag.mockClear();
  });

  it('keeps an unknown route on a not-found view instead of redirecting home', async () => {
    render(<MemoryRouter initialEntries={['/no-such-page']}><App /></MemoryRouter>);
    expect(await screen.findByRole('heading', {name: 'Page not found'})).toBeInTheDocument();
    expect(screen.queryByText('Product Detail Mock')).not.toBeInTheDocument();
  });

  it('renders the product detail route and accepts cookie consent', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await screen.findByText('Product Detail Mock');

    expect(
      screen.getByText(/This website uses cookies to enhance the user experience/i)
    ).toBeInTheDocument();

    await user.click(screen.getByText('Agree'));

   /* await waitFor(() => {
      expect(ReactGA4.send).toHaveBeenCalledWith(
        expect.objectContaining({ hitType: 'pageview' })
      );
    });*/

    expect(window.gtag).toHaveBeenCalledWith(
      'consent',
      'update',
      expect.objectContaining({ analytics_storage: 'granted' })
    );
  });
});
