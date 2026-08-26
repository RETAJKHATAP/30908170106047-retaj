const bcrypt = require('bcryptjs');
const { query } = require('../config/db');

const publicUser = (row) => {
  if (!row) return null;
  const user = {
    _id: row.id,
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    address: {
      street: row.street || '', city: row.city || '', state: row.state || '',
      postalCode: row.postal_code || '', country: row.country || '',
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
  return user;
};

const withPassword = (row) => ({ ...publicUser(row), password: row.password });

const User = {
  async findOne({ email }) {
    const { rows } = await query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
    return rows[0] ? withPassword(rows[0]) : null;
  },
  async findById(id) {
    const { rows } = await query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
    return rows[0] ? publicUser(rows[0]) : null;
  },
  async create({ name, email, password, role = 'customer' }) {
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await query(
      'INSERT INTO users (name,email,password,role) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, email.toLowerCase(), hash, role]
    );
    return publicUser(rows[0]);
  },
  async update(id, { name, address, password }) {
    const current = await query('SELECT * FROM users WHERE id = $1', [id]);
    if (!current.rows[0]) return null;
    const row = current.rows[0];
    const hash = password ? await bcrypt.hash(password, 10) : row.password;
    const a = address || {};
    const { rows } = await query(
      `UPDATE users SET name=$1, street=$2, city=$3, state=$4, postal_code=$5, country=$6, password=$7, updated_at=NOW()
       WHERE id=$8 RETURNING *`,
      [name || row.name, a.street ?? row.street, a.city ?? row.city, a.state ?? row.state, a.postalCode ?? row.postal_code, a.country ?? row.country, hash, id]
    );
    return publicUser(rows[0]);
  },
  async comparePassword(id, candidate) {
    const { rows } = await query('SELECT password FROM users WHERE id=$1', [id]);
    return rows[0] ? bcrypt.compare(candidate, rows[0].password) : false;
  },
  publicUser,
  withPassword,
};
module.exports = User;
