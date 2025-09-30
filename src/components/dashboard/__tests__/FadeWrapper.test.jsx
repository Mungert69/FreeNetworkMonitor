import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import FadeWrapper from '../FadeWrapper';

describe('FadeWrapper', () => {
  it('renders its children when toggle is false', () => {
    render(
      <FadeWrapper toggle={false}>
        <span>content</span>
      </FadeWrapper>,
    );

    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('starts and clears interval when toggle is true', () => {
    vi.useFakeTimers();
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');

    const { unmount } = render(
      <FadeWrapper toggle>
        <span>timed</span>
      </FadeWrapper>,
    );

    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 1000);

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();

    setIntervalSpy.mockRestore();
    clearIntervalSpy.mockRestore();
    vi.useRealTimers();
  });
});
