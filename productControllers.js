// const pool = require('../config/db');

// exports.getProducts = async (req, res) => {
//   const result = await pool.query('SELECT * FROM products ORDER BY product_id');
//   res.json(result.rows);
// };

// exports.addProduct = async (req, res) => {
//   const { name, image_url, price, stock } = req.body;
//   const result = await pool.query(
//     'INSERT INTO products (name,image_url,price,stock) VALUES ($1,$2,$3,$4) RETURNING *',
//     [name, image_url, price, stock]
//   );
//   res.json(result.rows[0]);
// };
