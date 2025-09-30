import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoadingCircle } from './loading-circle';

describe('LoadingCircle', () => {
  it('renders a circular progress indicator', () => {
    render(<LoadingCircle thickness={4} indicatorSize={80} />);

    const loader = screen.getByRole('progressbar');
    expect(loader).toBeInTheDocument();
  });
});
