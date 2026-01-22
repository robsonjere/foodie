const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      req.userId = user.userId;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = authenticateToken;
