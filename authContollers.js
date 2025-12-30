// const pool = require('../config/db');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');

// const JWT_SECRET = 'my_super_secret_key';

// exports.signup = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     if (!name || !email || !password || !role)
//       return res.status(400).json({ message: 'All fields are required' });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const result = await pool.query(
//       `INSERT INTO users (name, email, password_hash, role, created_at)
//        VALUES ($1,$2,$3,$4,$5)
//        RETURNING user_id,name,email,role`,
//       [name, email, hashedPassword, role, new Date()]
//     );

//     const user = result.rows[0];

//     const token = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });

//     res.json({ message: 'Signup successful', token, user });

//   } catch (err) {
//     if (err.code === '23505')
//       res.status(400).json({ message: 'Email already exists' });
//     else
//       res.status(500).json({ message: err.message });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password, role } = req.body;

//     const result = await pool.query(
//       'SELECT * FROM users WHERE email=$1 AND role=$2',
//       [email, role]
//     );

//     const user = result.rows[0];
//     if (!user) return res.status(401).json({ message: 'Invalid credentials' });

//     const match = await bcrypt.compare(password, user.password_hash);
//     if (!match) return res.status(401).json({ message: 'Invalid credentials' });

//     const token = jwt.sign(
//       { user_id: user.user_id, email: user.email, role: user.role },
//       JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     res.json({ message: 'Login successful', token, user });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
