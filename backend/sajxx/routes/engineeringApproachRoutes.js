const express = require('express');
const {
  getEngineeringApproaches,
  getEngineeringApproachById,
  createEngineeringApproach,
  updateEngineeringApproach,
  deleteEngineeringApproach
} = require('../controllers/engineeringApproachController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * GET /api/engineering-approach
 * Returns all engineering approach documents. Public endpoint.
 *
 * POST /api/engineering-approach
 * Creates a new engineering approach. Requires admin token.
 * Body: {
 *   title: string,
 *   points?: Array<{ heading: string, description: string }>,
 *   order?: number
 * }
 */
router
  .route('/')
  .get(getEngineeringApproaches)
  .post(protect, createEngineeringApproach);

/**
 * GET /api/engineering-approach/:id
 * Fetches a single engineering approach by id. Public endpoint.
 *
 * PUT /api/engineering-approach/:id
 * Updates an engineering approach. Requires admin token.
 *
 * DELETE /api/engineering-approach/:id
 * Removes an engineering approach. Requires admin token.
 */
router
  .route('/:id')
  .get(getEngineeringApproachById)
  .put(protect, updateEngineeringApproach)
  .delete(protect, deleteEngineeringApproach);

module.exports = router;
