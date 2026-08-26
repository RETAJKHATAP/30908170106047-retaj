import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { orderApi } from '../api/endpoints';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    orderApi
      .getById(id)
      .then((res) => setOrder(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner label="Loading order..." />;
  if (error) return <div className="mx-auto max-w-3xl px-4 py-10"><ErrorMessage message={error} /></div>;
  if (!order) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-2xl font-bold">Order #{order._id.slice(-8).toUpperCase()}</h1>
      <p className="mt-1 text-sm capitalize text-slate-500">Status: {order.status}</p>

      <div className="card mt-6 divide-y divide-slate-100">
        {order.items.map((item) => (
          <div key={item.product} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-slate-500">
                {item.quantity} &times; ${item.price.toFixed(2)}
              </p>
            </div>
            <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="card mt-6 space-y-2 p-6">
        <Row label="Items" value={order.itemsPrice} />
        <Row label="Shipping" value={order.shippingPrice} />
        <Row label="Tax" value={order.taxPrice} />
        <div className="flex justify-between border-t border-slate-200 pt-2 font-display font-bold">
          <span>Total</span>
          <span>${order.totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {order.shippingAddress && (
        <div className="card mt-6 p-6 text-sm text-slate-600">
          <h2 className="mb-2 font-display font-semibold text-ink">Shipping Address</h2>
          <p>{order.shippingAddress.street}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
          </p>
          <p>{order.shippingAddress.country}</p>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm text-slate-600">
      <span>{label}</span>
      <span>${value.toFixed(2)}</span>
    </div>
  );
}
