import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import Products from '../../src/pages/Products';
import { renderWithProviders } from './testUtils';

describe('Products page', () => {
  test('renders products returned from the (mocked) API', async () => {
    render(renderWithProviders(<Products />));

    expect(await screen.findByText('Wireless Headphones')).toBeInTheDocument();
    expect(screen.getByText('Running Shoes')).toBeInTheDocument();
  });

  test('renders the search input and sort/category controls', async () => {
    render(renderWithProviders(<Products />));

    expect(screen.getByPlaceholderText(/search products/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sort products/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/filter by category/i)).toBeInTheDocument();
    expect(await screen.findByText('Wireless Headphones')).toBeInTheDocument();
  });
});
