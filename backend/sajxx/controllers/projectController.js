const Project = require('../models/Project');

const normalizeListField = (payload, field) => {
  if (!payload[field]) return;
  if (Array.isArray(payload[field])) return;
  const value = payload[field];
  payload[field] = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const getProjects = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.featured) filter.featured = req.query.featured === 'true';

    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    normalizeListField(payload, 'technologies');
    normalizeListField(payload, 'images');

    const projectCount = await Project.countDocuments();
    if (typeof payload.order !== 'number') {
      payload.order = projectCount;
    }

    const project = await Project.create(payload);
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    normalizeListField(payload, 'technologies');
    normalizeListField(payload, 'images');

    const project = await Project.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.deleteOne();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const reorderProjects = async (req, res, next) => {
  try {
    const updates = req.body;
    if (!Array.isArray(updates)) {
      return res.status(400).json({ message: 'Payload must be an array' });
    }

    const bulkOps = updates.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: id },
        update: { order }
      }
    }));

    if (!bulkOps.length) {
      return res.json({ message: 'No updates applied' });
    }

    await Project.bulkWrite(bulkOps);
    const projects = await Project.find({}).sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects
};
