const pool = require("../config/db.config");

// Helper to execute queries safely
const executeQuery = async (sql, params = []) => {
  try {
    const result = await pool.query(sql, params);
    return result; // ✅ return full result object
  } catch (error) {
    console.error("Database query error:", error);
    throw new Error("Database operation failed.");
  }
};

class Product {
  // ✅ Create new product
  static async create({ name, description, price }) {
    const sql = `
      INSERT INTO products (name, description, price)
      VALUES ($1, $2, $3)
      RETURNING id, name, description, price, created_at
    `;
    const result = await pool.query(sql, [name, description, price || 0]);
    return result.rows[0];
  }

  // ✅ Get all products
  static async findAll() {
    const sql = `
      SELECT id, name, description, price, created_at
      FROM products
      ORDER BY id DESC
    `;
    const result = await pool.query(sql);
    return result.rows;
  }

  // ✅ Find product by ID
  static async findById(id) {
    const sql = `
      SELECT id, name, description, price, created_at
      FROM products
      WHERE id = $1
    `;
    const result = await pool.query(sql, [id]);
    return result.rows[0] || null;
  }

  // ✅ Update product
  static async update(id, { name, description, price }) {
    const sql = `
      UPDATE products
      SET name = $1, description = $2, price = $3
      WHERE id = $4
      RETURNING id, name, description, price
    `;
    const result = await pool.query(sql, [name, description, price || 0, id]);
    return result.rows[0] || null; // ✅ if null → not found
  }

  // ✅ Delete product
  static async delete(id) {
    const sql = `
      DELETE FROM products
      WHERE id = $1
      RETURNING id
    `;
    const result = await pool.query(sql, [id]);
    return result.rowCount === 1;
  }
}

module.exports = Product;
