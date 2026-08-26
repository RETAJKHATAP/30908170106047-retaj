import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#e2e8f0"/><text x="50%" y="50%" font-family="sans-serif" font-size="16" fill="#94a3b8" text-anchor="middle" dy=".3em">No image</text></svg>`
  );

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');

export default function ProductCard({ product }) {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  const imageSrc = product.images?.[0] ? `${API_ORIGIN}${product.images[0]}` : FALLBACK_IMAGE;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    await addItem(product._id, 1);
  };

  return (
    <Link to={`/products/${product._id}`} className="card group flex flex-col overflow-hidden transition hover:shadow-md">
      <div className="aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={imageSrc}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-brand-600">{product.category}</span>
        <h3 className="line-clamp-2 font-display text-base font-semibold text-ink">{product.name}</h3>
        <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
          <Star size={14} className="fill-amber-400 text-amber-400" />
          {product.rating?.toFixed ? product.rating.toFixed(1) : product.rating} ({product.numReviews} reviews)
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display text-lg font-bold text-ink">${product.price.toFixed(2)}</span>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="btn-primary !px-3 !py-2 text-xs"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={14} />
            {product.stock === 0 ? 'Out of stock' : 'Add'}
          </button>
        </div>
      </div>
    </Link>
  );
}
