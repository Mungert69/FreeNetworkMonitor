import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ChartTimeRange from '../ChartTimeRange';
describe('ChartTimeRange', () => {
  it('selects a UTC window and leaves custom drafts unapplied until Apply', () => {
    const onSelect = vi.fn();
    render(<ChartTimeRange onSelect={onSelect} />);
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Time range' }));
    fireEvent.click(screen.getByRole('option', { name: 'Last 24 hours' }));
    const range = onSelect.mock.calls[0][0];
    expect(range.mode).toBe('day');
    expect(Date.parse(range.end) - Date.parse(range.start)).toBeCloseTo(86400000, -2);
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Time range' }));
    fireEvent.click(screen.getByRole('option', { name: 'Custom range' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    fireEvent.change(screen.getByLabelText('From'), { target: { value: '2026-10-05T12:00' } });
    fireEvent.change(screen.getByLabelText('To'), { target: { value: '2026-10-05T11:00' } });
    expect(screen.getByRole('button', { name: 'Apply range' })).toBeDisabled();
    fireEvent.change(screen.getByLabelText('To'), { target: { value: '2026-10-05T13:00' } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply range' }));
    expect(onSelect.mock.calls[1][0].start).toMatch(/Z$/);
    expect(onSelect.mock.calls[1][0].end).toMatch(/Z$/);
  });
});
