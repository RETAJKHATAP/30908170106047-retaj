import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Cart() {
  const { items, total, loading, error, updateItem, removeItem } = useCart();
  const navigate = useNavigate();

  if (loading) return <LoadingSpinner label="Loading your cart..." />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-2xl font-bold">Your Cart</h1>
      {error && <div className="mt-4"><ErrorMessage message={error} /></div>}

      {items.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-slate-500">Your cart is empty.</p>
          <Link to="/products" className="btn-primary mt-4 inline-flex">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <ul className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <li key={item.product} className="card flex items-center gap-4 p-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  {item.image && (
                    <img
                      src={`${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '')}${item.image}`}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-slate-500">${item.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    aria-label="Decrease quantity"
                    onClick={() => updateItem(item.product, Math.max(1, item.quantity - 1))}
                    className="rounded-md border border-slate-300 p-1.5 hover:bg-slate-50"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    aria-label="Increase quantity"
                    onClick={() => updateItem(item.product, item.quantity + 1)}
                    className="rounded-md border border-slate-300 p-1.5 hover:bg-slate-50"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <p className="w-20 text-right font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                <button
                  aria-label={`Remove ${item.name}`}
                  onClick={() => removeItem(item.product)}
                  className="p-2 text-slate-400 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>

          <div className="card h-fit p-6">
            <h2 className="font-display text-lg font-semibold">Order Summary</h2>
            <div className="mt-4 flex justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">Shipping and tax are calculated at checkout.</p>
            <button onClick={() => navigate('/checkout')} className="btn-primary mt-6 w-full">
              Proceed to checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
