const asyncHandler = require('express-async-handler');
const { query } = require('../config/db');
const { normalize } = require('../models/Product');
const axios = require("axios"); // 🔥 مهم

// 🔹 GET all products
const getProducts = asyncHandler(async (req, res) => {
  const { keyword, category, minPrice, maxPrice, sort } = req.query;

  const where = [];
  const params = [];

  if (keyword) {
    params.push(`%${keyword}%`);
    where.push(`(name ILIKE $${params.length} OR description ILIKE $${params.length} OR brand ILIKE $${params.length})`);
  }

  if (category) {
    params.push(category);
    where.push(`category=$${params.length}`);
  }

  if (minPrice) {
    params.push(Number(minPrice));
    where.push(`price >= $${params.length}`);
  }

  if (maxPrice) {
    params.push(Number(maxPrice));
    where.push(`price <= $${params.length}`);
  }

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 12));
  const offset = (page - 1) * limit;

  const order = {
    price_asc: 'price ASC',
    price_desc: 'price DESC',
    newest: 'created_at DESC',
    rating: 'rating DESC',
    name_asc: 'name ASC'
  }[sort] || 'created_at DESC';

  const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const count = await query(
    `SELECT COUNT(*)::int AS count FROM products ${clause}`,
    params
  );

  const rows = await query(
    `SELECT * FROM products ${clause} ORDER BY ${order} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  );

  const total = count.rows[0].count;

  res.json({
    success: true,
    data: rows.rows.map(normalize),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1
    }
  });
});

// 🔥 GET product by ID + Reviews from Microservice
const getProductById = asyncHandler(async (req, res) => {
  const { rows } = await query(
    'SELECT * FROM products WHERE id=$1',
    [req.params.id]
  );

  if (!rows[0]) {
    res.status(404);
    throw new Error('Product not found');
  }

  const product = normalize(rows[0]);

  // 🔥 call Review Service
  const reviewsRes = await axios.get(
    "https://30908170106047-shopsphere-review-service-production.up.railway.app/reviews"
  );

  // 🔥 filter reviews for this product
  const productReviews = reviewsRes.data.filter(
    r => r.productId == product.id
  );

  res.json({
    success: true,
    data: {
      ...product,
      reviews: productReviews
    }
  });
});

// 🔹 GET categories
const getCategories = asyncHandler(async (req, res) => {
  const { rows } = await query(
    'SELECT DISTINCT category FROM products ORDER BY category'
  );

  res.json({
    success: true,
    data: rows.map(r => r.category)
  });
});

// 🔹 CREATE product
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, brand, stock } = req.body;

  if (!name || !description || price === undefined || !category) {
    res.status(400);
    throw new Error('Name, description, price and category are required');
  }

  const images = (req.files || []).map(f => `/uploads/${f.filename}`);

  const { rows } = await query(
    `INSERT INTO products(name,description,price,category,brand,stock,images,created_by)
     VALUES($1,$2,$3,$4,$5,$6,$7::jsonb,$8) RETURNING *`,
    [
      name,
      description,
      Number(price),
      category,
      brand || 'Generic',
      Number(stock) || 0,
      JSON.stringify(images),
      req.user._id
    ]
  );

  res.status(201).json({
    success: true,
    data: normalize(rows[0])
  });
});

// 🔹 UPDATE product
const updateProduct = asyncHandler(async (req, res) => {
  const fields = ['name', 'description', 'price', 'category', 'brand', 'stock'];
  const sets = [];
  const params = [];

  for (const f of fields) {
    if (req.body[f] !== undefined) {
      params.push(f === 'price' || f === 'stock' ? Number(req.body[f]) : req.body[f]);
      sets.push(`${f}=$${params.length}`);
    }
  }

  const files = req.files || [];

  if (files.length) {
    const { rows } = await query('SELECT images FROM products WHERE id=$1', [req.params.id]);

    if (!rows[0]) {
      res.status(404);
      throw new Error('Product not found');
    }

    const images = [
      ...(rows[0].images || []),
      ...files.map(f => `/uploads/${f.filename}`)
    ];

    params.push(JSON.stringify(images));
    sets.push(`images=$${params.length}::jsonb`);
  }

  if (!sets.length) {
    const { rows } = await query('SELECT * FROM products WHERE id=$1', [req.params.id]);

    if (!rows[0]) {
      res.status(404);
      throw new Error('Product not found');
    }

    return res.json({
      success: true,
      data: normalize(rows[0])
    });
  }

  params.push(req.params.id);

  const { rows } = await query(
    `UPDATE products SET ${sets.join(',')},updated_at=NOW() WHERE id=$${params.length} RETURNING *`,
    params
  );

  if (!rows[0]) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({
    success: true,
    data: normalize(rows[0])
  });
});

// 🔹 DELETE product
const deleteProduct = asyncHandler(async (req, res) => {
  const result = await query('DELETE FROM products WHERE id=$1', [req.params.id]);

  if (!result.rowCount) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({
    success: true,
    message: 'Product removed'
  });
});

module.exports = {
  getProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct
};