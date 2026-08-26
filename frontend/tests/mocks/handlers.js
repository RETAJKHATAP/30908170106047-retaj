import { http, HttpResponse } from 'msw';

const API_URL = 'http://localhost:5000/api';

export const mockProducts = [
  {
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
  },
  {
    _id: 'p2',
    name: 'Running Shoes',
    description: 'Comfortable shoes',
    price: 59.99,
    category: 'Footwear',
    brand: 'Strider',
    stock: 0,
    images: [],
    rating: 4.0,
    numReviews: 5,
  },
];

export const handlers = [
  http.get(`${API_URL}/products`, () => {
    return HttpResponse.json({
      success: true,
      data: mockProducts,
      pagination: { page: 1, limit: 8, total: mockProducts.length, pages: 1 },
    });
  }),

  http.get(`${API_URL}/products/categories`, () => {
    return HttpResponse.json({ success: true, data: ['Electronics', 'Footwear'] });
  }),

  http.get(`${API_URL}/products/:id`, ({ params }) => {
    const product = mockProducts.find((p) => p._id === params.id);
    if (!product) {
      return HttpResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    return HttpResponse.json({ success: true, data: product });
  }),

  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = await request.json();
    if (body.email === 'customer@example.com' && body.password === 'Customer@123') {
      return HttpResponse.json({
        success: true,
        token: 'fake-jwt-token',
        user: { _id: 'u1', name: 'Test Customer', email: body.email, role: 'customer' },
      });
    }
    return HttpResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
  }),

  http.post(`${API_URL}/auth/register`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      {
        success: true,
        token: 'fake-jwt-token',
        user: { _id: 'u2', name: body.name, email: body.email, role: 'customer' },
      },
      { status: 201 }
    );
  }),

  http.get(`${API_URL}/auth/me`, () => {
    return HttpResponse.json({
      success: true,
      user: { _id: 'u1', name: 'Test Customer', email: 'customer@example.com', role: 'customer' },
    });
  }),

  http.get(`${API_URL}/cart`, () => {
    return HttpResponse.json({ success: true, data: { items: [] }, total: 0 });
  }),

  http.post(`${API_URL}/cart`, async ({ request }) => {
    const body = await request.json();
    const product = mockProducts.find((p) => p._id === body.productId);
    return HttpResponse.json(
      {
        success: true,
        data: {
          items: [
            {
              product: body.productId,
              name: product?.name || 'Item',
              price: product?.price || 0,
              image: '',
              quantity: body.quantity || 1,
            },
          ],
        },
        total: (product?.price || 0) * (body.quantity || 1),
      },
      { status: 201 }
    );
  }),
];
