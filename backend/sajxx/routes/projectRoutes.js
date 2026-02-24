const express = require('express');
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects
} = require('../controllers/projectController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * GET /api/projects
 * Returns projects with optional query filters (?category=web&featured=true). Public endpoint.
 *
 * POST /api/projects
 * Creates a new project record. Requires admin token.
 * Body: {
 *   title: string,
 *   description: string,
 *   longDescription?: string,
 *   technologies?: string[] | comma-separated string,
 *   images?: string[] | comma-separated string,
 *   githubLink?: string,
 *   liveLink?: string,
 *   category?: 'web' | 'mobile' | 'desktop' | 'other',
 *   featured?: boolean,
 *   order?: number,
 *   problem?: string,
 *   architecture?: { frontend?, backend?, authentication?, database?, deployment? },
 *   engineeringDecisions?: Array<{ title, description }>,
 *   scalingConsiderations?: string[] | comma-separated string,
 *   metrics?: Array<{ label, value }>
 * }
 */
router
  .route('/')
  .get(getProjects)
  .post(protect, createProject);

/**
 * PATCH /api/projects/reorder
 * Bulk-updates the manual sort order. Requires admin token.
 * Body: Array<{ id: string, order: number }>
 */
router.patch('/reorder', protect, reorderProjects);

/**
 * GET /api/projects/:id
 * Fetches a single project document by id. Public endpoint.
 *
 * PUT /api/projects/:id
 * Updates a project. Requires admin token. Body matches POST schema.
 *
 * DELETE /api/projects/:id
 * Deletes a project permanently. Requires admin token.
 */
router
  .route('/:id')
  .get(getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

module.exports = router;
