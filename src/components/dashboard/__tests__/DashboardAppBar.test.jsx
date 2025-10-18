import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DashboardAppBar from '../DashboardAppBar';

const fadeWrapperMock = vi.fn(({ children, toggle }) => (
  <div data-testid="fade-wrapper" data-toggle={String(!!toggle)}>
    {children}
  </div>
));

const miniProfileMock = vi.fn(({ apiUser }) => (
  <div data-testid="mini-profile">{apiUser?.name ?? 'anonymous'}</div>
));

const authNavMock = vi.fn(({ openInNewTab }) => (
  <div data-testid="auth-nav">{openInNewTab ? 'open-in-new-tab' : 'same-tab'}</div>
));

vi.mock('../FadeWrapper', () => ({
  __esModule: true,
  default: (props) => fadeWrapperMock(props),
}));

vi.mock('../MiniProfile', () => ({
  __esModule: true,
  default: (props) => miniProfileMock(props),
}));

vi.mock('../../auth-nav', () => ({
  __esModule: true,
  default: (props) => authNavMock(props),
}));

vi.mock('../../main/LogoLink', () => ({
  __esModule: true,
  default: () => <div data-testid="logo-link">logo</div>,
}));

const classes = {
  appBar: 'appBar',
  appBarShift: 'appBarShift',
  toolbar: 'toolbar',
  menuButton: 'menuButton',
  menuButtonHidden: 'menuButtonHidden',
  title: 'title',
  chatToggle: 'chatToggle',
  chatToggleShift: 'chatToggleShift',
};

const theme = createTheme();

const renderAppBar = (overrideProps = {}) => {
  const defaultProps = {
    classes,
    open: false,
    handleDrawerOpen: vi.fn(),
    isMediumOrLarger: true,
    isLoggedIn: true,
    toggleTable: true,
    listDataLength: 0,
    hostListIconText: 'Edit hosts',
    editIconClick: vi.fn(),
    toggleChatView: vi.fn(),
    isChatOpen: false,
    openInNewTab: true,
    alertCount: 7,
    apiUser: { name: 'Alice' },
    siteId: 5,
    initViewSub: false,
    setInitViewSub: vi.fn(),
    getUserInfo: vi.fn(),
    showLoading: false,
    loadingProps: { message: 'Loading data…' },
  };

  const props = { ...defaultProps, ...overrideProps };

  const view = render(
    <ThemeProvider theme={theme}>
      <DashboardAppBar {...props} />
    </ThemeProvider>,
  );

  return { ...props, ...view };
};

describe('DashboardAppBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders primary controls, honours handlers, and displays user context when logged in', () => {
    const { handleDrawerOpen, toggleChatView, editIconClick, hostListIconText } = renderAppBar();

    expect(screen.getByText('Network Monitor Dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('logo-link')).toBeInTheDocument();
    expect(authNavMock).toHaveBeenCalledWith(expect.objectContaining({ openInNewTab: true }));

    const drawerButton = screen.getByRole('button', { name: /open drawer/i });
    fireEvent.click(drawerButton);
    expect(handleDrawerOpen).toHaveBeenCalledTimes(1);

    expect(fadeWrapperMock).toHaveBeenCalledWith(expect.objectContaining({ toggle: true }));

    const editIcon = screen.getByTestId('EditIcon');
    fireEvent.click(editIcon);
    expect(editIconClick).toHaveBeenCalledTimes(1);

    const chatButton = screen.getByTestId('ChatIcon').closest('button');
    expect(chatButton).toBeTruthy();
    fireEvent.click(chatButton);
    expect(toggleChatView).toHaveBeenCalledTimes(1);

    expect(screen.getByText(/open-in-new-tab/i)).toBeInTheDocument();
    expect(screen.getByTestId('mini-profile')).toHaveTextContent('Alice');

    const alertBadge = screen.getByText('7');
    expect(alertBadge).toBeInTheDocument();

    expect(hostListIconText).toBe('Edit hosts');
  });

  it('hides edit and profile controls when logged out and can hide loading', () => {
    renderAppBar({
      isLoggedIn: false,
      toggleTable: false,
      listDataLength: 3,
      showLoading: false,
    });

    expect(screen.queryByTestId('EditIcon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mini-profile')).not.toBeInTheDocument();
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
  });
});
