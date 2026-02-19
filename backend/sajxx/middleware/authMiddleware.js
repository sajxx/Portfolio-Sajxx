const jwt = require('jsonwebtoken');
const getSecret = require('../utils/getSecret');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  try {
    const decoded = jwt.verify(token, getSecret('JWT_SECRET'));
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};
module.exports = protect;