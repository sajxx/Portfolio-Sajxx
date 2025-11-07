const ContactMessage = require('../models/ContactMessage');
const sendEmailNotification = require('../utils/sendEmailNotification');

const submitMessage = async (req, res, next) => {
  try {
    const message = await ContactMessage.create(req.body);

    if (process.env.CONTACT_NOTIFICATION_EMAIL) {
      sendEmailNotification(message).catch((error) => {
        console.error('Failed to send notification email', error);
      });
    }

    res.status(201).json({ message: 'Message received', data: message });
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const messages = await ContactMessage.find(filter).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

const updateMessageStatus = async (req, res, next) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    next(error);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await message.deleteOne();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitMessage,
  getMessages,
  updateMessageStatus,
  deleteMessage
};
