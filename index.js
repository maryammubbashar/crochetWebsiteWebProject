// const express = require('express');
// const cors = require('cors');
// const path = require('path');

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(express.static(path.join(__dirname, '../FrontEnd')));

// app.use(require('./routes/auth.routes'));
// app.use(require('./routes/product.routes'));
// app.use(require('./routes/page.routes'));

// module.exports = app;

// ABOVE ONE IS FOR FOLDER STRUCTURES
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const port = 3000;

const JWT_SECRET = 'my_super_secret_key';

app.use(express.json());
app.use(cors());

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "rabbani",
  database: "Project",
});



// Serve static files from FrontEnd folder
app.use(express.static(path.join(__dirname, 'FrontEnd')));
/* ===================== SIGNUP ===================== */
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ message: "Role must be 'admin' or 'user'" });
    }
// // ACCESSING HOME PAGE
//     app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'FrontEnd', 'home.html'), (err) => {
//     if (err) {
//       console.error(err);
//       res.status(404).send('404 Error: Home page not found');
//     }
//   });
// });

// // ACCESSING ABOUTUS PAGE
//     app.get('/aboutUs', (req, res) => {
//   res.sendFile(path.join(__dirname, 'FrontEnd', 'aboutUs.html'), (err) => {
//     if (err) {
//       console.error(err);
//       res.status(404).send('404 Error: aboutUs page not found');
//     }
//   });
// });
// // ACCESSING Products PAGE
//     app.get('/product', (req, res) => {
//   res.sendFile(path.join(__dirname, 'FrontEnd', 'product.html'), (err) => {
//     if (err) {
//       console.error(err);
//       res.status(404).send('404 Error: product page not found');
//     }
//   });
// });
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const created_at = new Date();

    const insert_query = `
      INSERT INTO users (name, email, password_hash, role, created_at)
      VALUES ($1, $2, $3, $4, $5) RETURNING user_id, name, role, email
    `;

    const result = await pool.query(insert_query, [name, email, hashedPassword, role, created_at]);
    const user = result.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Signup successful', token, user });

  } catch (err) {
    if (err.code === '23505') {
      res.status(400).json({ message: 'Email already exists' });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
});

/* ===================== LOGIN ===================== */
app.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const result = await pool.query(
      `SELECT user_id, name, email, role, password_hash 
       FROM users 
       WHERE email=$1 AND role=$2`,
      [email, role]
    );

    const user = result.rows[0];
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token, user: { name: user.name, role: user.role } });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===================== PROTECTED ROUTE ===================== */
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(403).json({ message: 'Token required' });

  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
}

app.get('/dashboard', verifyToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.role}`, user: req.user });
});

/* ===================== LOGOUT ===================== */
app.post('/logout', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const logoutTime = new Date();

    await pool.query('UPDATE users SET last_logout=$1 WHERE user_id=$2', [logoutTime, userId]);
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Middleware to verify admin
function verifyAdmin(req, res, next) {
  if (!req.user) return res.status(403).json({ message: 'Token required' });
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access only' });
  next();
}

// GET all products
app.get('/admin/products', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY product_id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD new product
app.post('/admin/products', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, image_url, price, stock } = req.body;
    if (!name || !image_url || !price || stock == null) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const result = await pool.query(
      'INSERT INTO products (name, image_url, price, stock) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, image_url, price, stock]
    );
    res.json({ message: 'Product added', product: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// EDIT product price
app.put('/admin/products/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const productId = req.params.id;
    const { price, stock } = req.body;
    if (price == null && stock == null) {
      return res.status(400).json({ message: 'Provide new price or stock' });
    }

    const existing = await pool.query('SELECT * FROM products WHERE product_id=$1', [productId]);
    if (!existing.rows[0]) return res.status(404).json({ message: 'Product not found' });

    const updatedPrice = price ?? existing.rows[0].price;
    const updatedStock = stock ?? existing.rows[0].stock;

    const result = await pool.query(
      'UPDATE products SET price=$1, stock=$2 WHERE product_id=$3 RETURNING *',
      [updatedPrice, updatedStock, productId]
    );
    res.json({ message: 'Product updated', product: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE product
app.delete('/admin/products/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const productId = req.params.id;
    const existing = await pool.query('SELECT * FROM products WHERE product_id=$1', [productId]);
    if (!existing.rows[0]) return res.status(404).json({ message: 'Product not found' });

    await pool.query('DELETE FROM products WHERE product_id=$1', [productId]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));




// Fetch all products
app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY product_id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Handle allowed pages
app.get('/:page', (req, res) => {
  const page = req.params.page;
  const allowedPages = ['home', 'product', 'aboutUs'];

  if (allowedPages.includes(page)) {
    const filePath = path.join(__dirname, 'FrontEnd', `${page}.html`);
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error(err);
        // send plain text message if file missing
        res.status(404).send(`404 Error: Page "${page}" not found`);
      }
    });
  } else {
    // send plain text message
    res.status(404).send(`404 Error: Page "${page}" not found`);
  }
});
// 404 handler for anything else (optional, catches deeper paths)
app.use((req, res) => {
  res.status(404).send(`404 Error: Path "${req.path}" not found`);
});


