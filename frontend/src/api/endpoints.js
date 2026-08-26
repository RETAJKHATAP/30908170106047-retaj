import apiClient from './client';
import reviewClient from './reviewClient';

export const reviewApi = {
  list: (productId) => reviewClient.get(`/reviews/${productId}`).then((r) => r.data),
  add: (productId, text) => reviewClient.post('/reviews', { productId, text }).then((r) => r.data),
};


export const authApi = {
  register: (payload) => apiClient.post('/auth/register', payload).then((r) => r.data),
  login: (payload) => apiClient.post('/auth/login', payload).then((r) => r.data),
  me: () => apiClient.get('/auth/me').then((r) => r.data),
  updateMe: (payload) => apiClient.put('/auth/me', payload).then((r) => r.data),
};

export const productApi = {
  list: (params) => apiClient.get('/products', { params }).then((r) => r.data),
  getById: (id) => apiClient.get(`/products/${id}`).then((r) => r.data),
  categories: () => apiClient.get('/products/categories').then((r) => r.data),
  create: (formData) =>
    apiClient
      .post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data),
  update: (id, formData) =>
    apiClient
      .put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data),
  remove: (id) => apiClient.delete(`/products/${id}`).then((r) => r.data),
};

export const cartApi = {
  get: () => apiClient.get('/cart').then((r) => r.data),
  add: (productId, quantity = 1) => apiClient.post('/cart', { productId, quantity }).then((r) => r.data),
  update: (productId, quantity) =>
    apiClient.put(`/cart/${productId}`, { quantity }).then((r) => r.data),
  remove: (productId) => apiClient.delete(`/cart/${productId}`).then((r) => r.data),
  clear: () => apiClient.delete('/cart').then((r) => r.data),
};

export const orderApi = {
  checkout: (shippingAddress) => apiClient.post('/orders', { shippingAddress }).then((r) => r.data),
  mine: () => apiClient.get('/orders/mine').then((r) => r.data),
  getById: (id) => apiClient.get(`/orders/${id}`).then((r) => r.data),
  all: () => apiClient.get('/orders').then((r) => r.data),
  updateStatus: (id, status) => apiClient.put(`/orders/${id}/status`, { status }).then((r) => r.data),
};
