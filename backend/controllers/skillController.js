const Skill = require('../models/Skill');

const getSkills = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;

    const skills = await Skill.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(skills);
  } catch (error) {
    next(error);
  }
};

const createSkill = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    const skillCount = await Skill.countDocuments();
    if (typeof payload.order !== 'number') {
      payload.order = skillCount;
    }

    const skill = await Skill.create(payload);
    res.status(201).json(skill);
  } catch (error) {
    next(error);
  }
};

const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    res.json(skill);
  } catch (error) {
    next(error);
  }
};

const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    await skill.deleteOne();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const reorderSkills = async (req, res, next) => {
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

    await Skill.bulkWrite(bulkOps);
    const skills = await Skill.find({}).sort({ order: 1, createdAt: -1 });
    res.json(skills);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills
};
