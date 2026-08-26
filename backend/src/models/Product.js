const { query } = require('../config/db');
const normalize = (r) => r && ({ _id:r.id, id:r.id, name:r.name, description:r.description, price:Number(r.price), category:r.category, brand:r.brand, stock:r.stock, images:r.images || [], rating:Number(r.rating), numReviews:r.num_reviews, createdBy:r.created_by, createdAt:r.created_at, updatedAt:r.updated_at });
module.exports = {
  normalize,
  async findById(id){ const {rows}=await query('SELECT * FROM products WHERE id=$1',[id]); return normalize(rows[0]); },
  async count(filter={}){ return 0; },
};
