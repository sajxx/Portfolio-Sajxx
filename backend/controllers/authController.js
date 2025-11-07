const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const buildToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const isHashed = (value) => typeof value === 'string' && value.startsWith('$2');

const login = async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const envPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    const envPassword = process.env.ADMIN_PASSWORD;

    let isValid = false;

    if (envPasswordHash) {
      isValid = await bcrypt.compare(password, envPasswordHash);
    } else if (envPassword) {
      if (isHashed(envPassword)) {
        isValid = await bcrypt.compare(password, envPassword);
      } else {
        isValid = password === envPassword;
      }
    }

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = buildToken({ role: 'admin' });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const token = buildToken({ role: 'admin' });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  refresh
};
