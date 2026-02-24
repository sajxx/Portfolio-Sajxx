const EngineeringApproach = require('../models/EngineeringApproach');

const getEngineeringApproaches = async (req, res, next) => {
  try {
    const docs = await EngineeringApproach.find({}).sort({ order: 1, createdAt: -1 });
    res.json(docs);
  } catch (error) {
    next(error);
  }
};

const getEngineeringApproachById = async (req, res, next) => {
  try {
    const doc = await EngineeringApproach.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: 'Engineering approach not found' });
    }
    res.json(doc);
  } catch (error) {
    next(error);
  }
};

const createEngineeringApproach = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    const count = await EngineeringApproach.countDocuments();
    if (typeof payload.order !== 'number') {
      payload.order = count;
    }
    const doc = await EngineeringApproach.create(payload);
    res.status(201).json(doc);
  } catch (error) {
    next(error);
  }
};

const updateEngineeringApproach = async (req, res, next) => {
  try {
    const doc = await EngineeringApproach.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!doc) {
      return res.status(404).json({ message: 'Engineering approach not found' });
    }
    res.json(doc);
  } catch (error) {
    next(error);
  }
};

const deleteEngineeringApproach = async (req, res, next) => {
  try {
    const doc = await EngineeringApproach.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: 'Engineering approach not found' });
    }
    await doc.deleteOne();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEngineeringApproaches,
  getEngineeringApproachById,
  createEngineeringApproach,
  updateEngineeringApproach,
  deleteEngineeringApproach
};
