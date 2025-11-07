const express = require('express');
const { getProfile, updateProfile } = require('../controllers/profileController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * GET /api/profile
 * Returns the portfolio owner profile, auto-creating a default document if none exists. Public endpoint.
 */
router.get('/', getProfile);

/**
 * PUT /api/profile
 * Upserts the profile document. Requires admin token.
 * Body: {
 *   name?: string,
 *   role?: string,
 *   headline?: string,
 *   about?: string,
 *   location?: string,
 *   email?: string,
 *   phone?: string,
 *   socials?: Array<{ label: string, url: string, icon?: string }>,
 *   resumeUrl?: string,
 *   heroImage?: string,
 *   available?: boolean
 * }
 */
router.put('/', protect, updateProfile);

module.exports = router;
