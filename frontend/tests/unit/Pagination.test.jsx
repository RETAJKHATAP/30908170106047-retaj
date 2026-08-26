import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import Pagination from '../../src/components/Pagination';

describe('Pagination', () => {
  test('renders nothing when there is only one page', () => {
    const { container } = render(<Pagination page={1} pages={1} onPageChange={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('renders page numbers and highlights the current page', () => {
    render(<Pagination page={2} pages={3} onPageChange={() => {}} />);
    const current = screen.getByRole('button', { name: '2' });
    expect(current).toHaveAttribute('aria-current', 'page');
  });

  test('calls onPageChange with the next page number', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={1} pages={3} onPageChange={onPageChange} />);

    await user.click(screen.getByRole('button', { name: /next page/i }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  test('disables the previous button on the first page', () => {
    render(<Pagination page={1} pages={3} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: /previous page/i })).toBeDisabled();
  });
});
