const { query } = require('../config/db');
const normalize = (r) => r && ({ _id:r.id, id:r.id, user:r.user_id, items:r.items || [], createdAt:r.created_at, updatedAt:r.updated_at });
const total = (cart) => (cart?.items || []).reduce((s,i)=>s+Number(i.price)*Number(i.quantity),0);
module.exports = { normalize, total,
  async findByUser(userId){ const {rows}=await query('SELECT * FROM carts WHERE user_id=$1',[userId]); return normalize(rows[0]); },
  async upsert(userId, items){ const {rows}=await query(`INSERT INTO carts(user_id,items) VALUES($1,$2::jsonb) ON CONFLICT(user_id) DO UPDATE SET items=EXCLUDED.items,updated_at=NOW() RETURNING *`,[userId,JSON.stringify(items)]); return normalize(rows[0]); }
};
