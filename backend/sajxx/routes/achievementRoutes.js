const express = require('express');
const {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  reorderAchievements
} = require('../controllers/achievementController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * GET /api/achievements
 * Returns all achievements sorted by manual order then most recent date. Public endpoint.
 *
 * POST /api/achievements
 * Creates a new achievement. Requires admin token.
 * Body: {
 *   title: string,
 *   description?: string,
 *   issuedBy?: string,
 *   date?: string (ISO 8601),
 *   link?: string,
 *   category?: string,
 *   order?: number
 * }
 */
router
  .route('/')
  .get(getAchievements)
  .post(protect, createAchievement);

/**
 * PATCH /api/achievements/reorder
 * Bulk-updates the display order. Requires admin token.
 * Body: Array<{ id: string, order: number }>
 */
router.patch('/reorder', protect, reorderAchievements);

/**
 * PUT /api/achievements/:id
 * Updates a single achievement by id. Requires admin token.
 * Body mirrors the POST schema; send only fields to change.
 *
 * DELETE /api/achievements/:id
 * Removes an achievement permanently. Requires admin token.
 */
router
  .route('/:id')
  .put(protect, updateAchievement)
  .delete(protect, deleteAchievement);

module.exports = router;
