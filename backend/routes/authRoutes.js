const express = require('express');
const { login, refresh } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * POST /api/auth/login
 * Exchanges an admin password for a JWT.
 * Body: { password: string }
 * Response: { token: string }
 */
router.post('/login', login);

/**
 * POST /api/auth/refresh
 * Issues a fresh JWT when the current token is still valid. Requires admin token.
 * Body: none. Response: { token: string }
 */
router.post('/refresh', protect, refresh);

module.exports = router;
