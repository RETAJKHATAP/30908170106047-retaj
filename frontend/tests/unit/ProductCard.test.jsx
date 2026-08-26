import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import ProductCard from '../../src/components/ProductCard';
import { renderWithProviders } from './testUtils';

const product = {
  _id: 'p1',
  name: 'Wireless Headphones',
  description: 'Great sound',
  price: 99.99,
  category: 'Electronics',
  brand: 'SoundWave',
  stock: 10,
  images: [],
  rating: 4.5,
  numReviews: 12,
};

describe('ProductCard', () => {
  test('renders the product name, price, and category', () => {
    render(renderWithProviders(<ProductCard product={product} />));

    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  test('shows "Out of stock" and disables the add button when stock is 0', () => {
    render(renderWithProviders(<ProductCard product={{ ...product, stock: 0 }} />));

    const button = screen.getByRole('button', { name: /add.*to cart/i });
    expect(button).toBeDisabled();
    expect(screen.getByText('Out of stock')).toBeInTheDocument();
  });

  test('links to the product detail page', () => {
    render(renderWithProviders(<ProductCard product={product} />));
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/products/p1');
  });
});
