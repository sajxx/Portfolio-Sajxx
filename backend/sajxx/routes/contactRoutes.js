const express = require('express');
const rateLimit = require('express-rate-limit');

const {
  submitMessage,
  getMessages,
  updateMessageStatus,
  deleteMessage
} = require('../controllers/contactController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: Number(process.env.CONTACT_RATE_LIMIT) || 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many submissions from this IP, please try again later.'
});

/**
 * POST /api/contact
 * Public contact form submission with rate limiting.
 * Body: {
 *   name: string,
 *   email: string,
 *   subject?: string,
 *   message: string
 * }
 * Returns the stored message document.
 */
router.post('/', publicLimiter, submitMessage);

/**
 * GET /api/contact
 * Lists stored contact messages (newest first). Requires admin token.
 * Optional query: ?status=new|in-progress|closed.
 */
router.get('/', protect, getMessages);

/**
 * PATCH /api/contact/:id/status
 * Updates message status. Requires admin token.
 * Body: { status: 'new' | 'in-progress' | 'closed' }
 */
router.patch('/:id/status', protect, updateMessageStatus);

/**
 * DELETE /api/contact/:id
 * Removes a contact message permanently. Requires admin token.
 */
router.delete('/:id', protect, deleteMessage);

module.exports = router;
