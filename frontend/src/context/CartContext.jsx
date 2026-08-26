import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { cartApi } from '../api/endpoints';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await cartApi.get();
      setItems(res.data.items);
      setTotal(res.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = useCallback(async (productId, quantity = 1) => {
    setError(null);
    try {
      const res = await cartApi.add(productId, quantity);
      setItems(res.data.items);
      setTotal(res.total);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  }, []);

  const updateItem = useCallback(async (productId, quantity) => {
    setError(null);
    try {
      const res = await cartApi.update(productId, quantity);
      setItems(res.data.items);
      setTotal(res.total);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const removeItem = useCallback(async (productId) => {
    setError(null);
    try {
      const res = await cartApi.remove(productId);
      setItems(res.data.items);
      setTotal(res.total);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      await cartApi.clear();
      setItems([]);
      setTotal(0);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    items,
    total,
    itemCount,
    loading,
    error,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};
