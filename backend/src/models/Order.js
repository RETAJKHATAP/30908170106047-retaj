const { query } = require('../config/db');
const normalize = (r) => r && ({ _id:r.id,id:r.id,user:r.user_id,items:r.items || [],shippingAddress:r.shipping_address || {},itemsPrice:Number(r.items_price),shippingPrice:Number(r.shipping_price),taxPrice:Number(r.tax_price),totalPrice:Number(r.total_price),status:r.status,isPaid:r.is_paid,paidAt:r.paid_at,createdAt:r.created_at,updatedAt:r.updated_at });
module.exports = { normalize, async findById(id){const {rows}=await query('SELECT * FROM orders WHERE id=$1',[id]);return normalize(rows[0]);} };
