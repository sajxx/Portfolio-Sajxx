const Profile = require('../models/Profile');

const getProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({});
    if (!profile) {
      profile = await Profile.create({});
    }
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const update = req.body;
    const profile = await Profile.findOneAndUpdate({}, update, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    });

    res.json(profile);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile
};
