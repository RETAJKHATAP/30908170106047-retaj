import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, ArrowLeft } from 'lucide-react';
import { productApi, reviewApi } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450"><rect width="100%" height="100%" fill="#e2e8f0"/><text x="50%" y="50%" font-family="sans-serif" font-size="18" fill="#94a3b8" text-anchor="middle" dy=".3em">No image</text></svg>`
  );
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    setLoading(true);
    productApi
      .getById(id)
      .then((res) => setProduct(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    loadReviews();
  }, [id]);

  const loadReviews = () => {
    setReviewsLoading(true);
    reviewApi
      .list(id)
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]))
      .finally(() => setReviewsLoading(false));
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setSubmittingReview(true);
    try {
      await reviewApi.add(id, reviewText.trim());
      setReviewText('');
      loadReviews();
    } catch (err) {
      setMessage(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const result = await addItem(product._id, quantity);
    setMessage(result.success ? 'Added to cart!' : result.message);
  };

  if (loading) return <LoadingSpinner label="Loading product..." />;
  if (error) return <div className="mx-auto max-w-3xl px-4 py-10"><ErrorMessage message={error} /></div>;
  if (!product) return null;

  const imageSrc = product.images?.[0] ? `${API_ORIGIN}${product.images[0]}` : FALLBACK_IMAGE;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1 text-sm text-slate-500 hover:text-ink">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-xl bg-slate-100">
          <img src={imageSrc} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">{product.category}</span>
          <h1 className="mt-1 font-display text-3xl font-bold">{product.name}</h1>
          <div className="mt-2 flex items-center gap-1 text-sm text-slate-500">
            <Star size={16} className="fill-amber-400 text-amber-400" />
            {product.rating} ({product.numReviews} reviews) &middot; Brand: {product.brand}
          </div>

          <p className="mt-4 text-slate-600">{product.description}</p>

          <div className="mt-6 font-display text-3xl font-bold">${product.price.toFixed(2)}</div>
          <p className={`mt-1 text-sm ${product.stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          {message && <p className="mt-3 text-sm font-medium text-brand-700">{message}</p>}

          <div className="mt-6 flex items-center gap-4">
            <label htmlFor="quantity" className="sr-only">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              min={1}
              max={product.stock || 1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="input-field w-20"
              disabled={product.stock === 0}
            />
            <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn-primary">
              <ShoppingCart size={16} /> Add to cart
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-slate-200 pt-8">
        <h2 className="font-display text-xl font-bold">Reviews</h2>

        {reviewsLoading ? (
          <p className="mt-3 text-sm text-slate-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No reviews yet. Be the first to review this product.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {reviews.map((r) => (
              <li key={r.id} className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                {r.text}
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleAddReview} className="mt-5 flex gap-3">
          <input
            type="text"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write a review..."
            className="input-field flex-1"
          />
          <button type="submit" disabled={submittingReview} className="btn-primary">
            {submittingReview ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}
