const express = require('express');
const {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills
} = require('../controllers/skillController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * GET /api/skills
 * Returns skills optionally filtered by category (?category=frontend). Public endpoint.
 *
 * POST /api/skills
 * Creates a new skill entry. Requires admin token.
 * Body: {
 *   name: string,
 *   proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert',
 *   category?: string,
 *   icon?: string,
 *   description?: string,
 *   order?: number
 * }
 */
router
  .route('/')
  .get(getSkills)
  .post(protect, createSkill);

/**
 * PATCH /api/skills/reorder
 * Bulk-updates display order for skill cards. Requires admin token.
 * Body: Array<{ id: string, order: number }>
 */
router.patch('/reorder', protect, reorderSkills);

/**
 * PUT /api/skills/:id
 * Updates fields on a skill. Requires admin token; body matches POST schema.
 *
 * DELETE /api/skills/:id
 * Removes a skill. Requires admin token.
 */
router
  .route('/:id')
  .put(protect, updateSkill)
  .delete(protect, deleteSkill);

module.exports = router;
