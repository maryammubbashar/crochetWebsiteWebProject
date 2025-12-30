// const jwt = require('jsonwebtoken');
// const JWT_SECRET = 'my_super_secret_key';

// module.exports = function verifyToken(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   if (!authHeader) return res.status(403).json({ message: 'Token required' });

//   const token = authHeader.split(' ')[1];

//   jwt.verify(token, JWT_SECRET, (err, decoded) => {
//     if (err) return res.status(401).json({ message: 'Invalid token' });
//     req.user = decoded;
//     next();
//   });
// };
