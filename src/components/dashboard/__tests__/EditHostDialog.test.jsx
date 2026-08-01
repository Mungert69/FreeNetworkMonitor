import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import EditHostDialog from '../EditHostDialog';

const host = {
  id: 1,
  address: 'example.com',
  endPointType: 'http',
  timeout: 1000,
  port: 80,
  enabled: true,
  appID: 'agent-1',
  skipCycles: 3,
};

describe('EditHostDialog', () => {
  it('sends null when Skip cycles is cleared so the endpoint default is restored', () => {
    const onSave = vi.fn();

    render(
      <EditHostDialog
        open
        onClose={vi.fn()}
        host={host}
        endpointTypes={[{ internalType: 'http', name: 'HTTP' }]}
        processorList={[{ appID: 'agent-1', location: 'Agent 1' }]}
        onSave={onSave}
      />,
    );

    const skipCycles = screen.getByLabelText('Skip cycles');
    expect(skipCycles).toHaveValue(3);

    fireEvent.change(skipCycles, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ skipCycles: null }));
  });
});
