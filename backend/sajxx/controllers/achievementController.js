const Achievement = require('../models/Achievement');

const getAchievements = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;

    const achievements = await Achievement.find(filter).sort({ order: 1, date: -1 });
    res.json(achievements);
  } catch (error) {
    next(error);
  }
};

const createAchievement = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    const achievementCount = await Achievement.countDocuments();
    if (typeof payload.order !== 'number') {
      payload.order = achievementCount;
    }

    const achievement = await Achievement.create(payload);
    res.status(201).json(achievement);
  } catch (error) {
    next(error);
  }
};

const updateAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    res.json(achievement);
  } catch (error) {
    next(error);
  }
};

const deleteAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    await achievement.deleteOne();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const reorderAchievements = async (req, res, next) => {
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

    await Achievement.bulkWrite(bulkOps);
    const achievements = await Achievement.find({}).sort({ order: 1, date: -1 });
    res.json(achievements);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  reorderAchievements
};
