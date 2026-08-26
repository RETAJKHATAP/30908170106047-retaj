import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Store, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-brand-700">
          <Store size={22} strokeWidth={2.4} />
          Marketplace
        </Link>

        <nav className="flex items-center gap-1 sm:gap-3">
          <Link to="/products" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
            Products
          </Link>

          {isAuthenticated && (
            <Link to="/orders" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
              My Orders
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              <LayoutDashboard size={16} /> Admin
            </Link>
          )}

          <Link to="/cart" className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100" aria-label="Cart">
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 pl-2">
              <span className="hidden items-center gap-1 text-sm text-slate-600 sm:flex">
                <User size={16} /> {user.name.split(' ')[0]}
              </span>
              <button onClick={handleLogout} className="btn-secondary !px-3 !py-2 text-xs">
                <LogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2">
              <Link to="/login" className="btn-secondary !px-3 !py-2 text-xs">
                Login
              </Link>
              <Link to="/register" className="btn-primary !px-3 !py-2 text-xs">
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
