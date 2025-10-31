const pool = require("../config/db.config");

const executeQuery = async (sql, params = []) => {
  try {
    const result = await pool.query(sql, params);
    return result.rows; // PostgreSQL uses "rows" for returned data
  } catch (error) {
    console.error("Database query error:", error);
    throw new Error("Database operation failed.");
  }
};

class Product {
  static async create({ name, description, price }) {
    const sql =
      `INSERT INTO products (name, description, price) VALUES ($1, $2, $3)
       RETURNING id, name, description, price, quantity, created_at
       `;
    const result = await pool.query(sql, [name, description, price || 0]);
    return result.rows[0];
  }

  static async findAll() {
    const sql =
      `
      SELECT id, name, description, price, created_at
      FROM products
      ORDER BY id DESC
    `;
    return executeQuery(sql);
  }

  static async findById(id) {
    const sql =
      "SELECT id, name, description, price, created_at FROM products WHERE id = ?";
    const rows = await executeQuery(sql, [id]);
    return rows[0] || null;
  }

  static async update(id, { name, description, price }) {
    const sql =
      `
      UPDATE products
      SET name = $1, description = $2, price = $3
      WHERE id = $4
      RETURNING id
      `;
    const result = await pool.query(sql, [name, description, price || 0, id]);
    return result.rowCount === 1;
  }

  static async delete(id) {
    const sql = "DELETE FROM products WHERE id = $1";
    const [result] = await executeQuery(sql, [id]);
    return result.rowCount === 1;
  }
}


module.exports = Product;


