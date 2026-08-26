import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderApi } from '../api/endpoints';
import ErrorMessage from '../components/ErrorMessage';

export default function Checkout() {
  const { items, total, refreshCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ street: '', city: '', state: '', postalCode: '', country: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await orderApi.checkout(address);
      await refreshCart();
      navigate(`/orders/${res.data._id}`, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-slate-500">Your cart is empty, nothing to check out.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-2xl font-bold">Checkout</h1>

      <form onSubmit={handleSubmit} className="card mt-6 space-y-4 p-6">
        {error && <ErrorMessage message={error} />}

        <div>
          <label htmlFor="street" className="mb-1 block text-sm font-medium">
            Street address
          </label>
          <input
            id="street"
            required
            className="input-field"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="mb-1 block text-sm font-medium">
              City
            </label>
            <input
              id="city"
              required
              className="input-field"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="state" className="mb-1 block text-sm font-medium">
              State / Province
            </label>
            <input
              id="state"
              className="input-field"
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="postalCode" className="mb-1 block text-sm font-medium">
              Postal code
            </label>
            <input
              id="postalCode"
              className="input-field"
              value={address.postalCode}
              onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="country" className="mb-1 block text-sm font-medium">
              Country
            </label>
            <input
              id="country"
              required
              className="input-field"
              value={address.country}
              onChange={(e) => setAddress({ ...address, country: e.target.value })}
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <span className="text-sm text-slate-500">Subtotal</span>
          <span className="font-display text-lg font-bold">${total.toFixed(2)}</span>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Placing order...' : 'Place order'}
        </button>
      </form>
    </div>
  );
}
