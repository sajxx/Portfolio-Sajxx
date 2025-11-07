let transporter;

const ensureTransporter = async () => {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;
  if (!SMTP_HOST) {
    return null;
  }

  const nodemailer = require('nodemailer');
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: SMTP_SECURE === 'true',
    auth: SMTP_USER
      ? {
          user: SMTP_USER,
          pass: SMTP_PASS
        }
      : undefined
  });

  return transporter;
};

const sendEmailNotification = async (message) => {
  const transport = await ensureTransporter();
  if (!transport) {
    console.info('Email notification skipped (SMTP not configured)');
    return;
  }

  const to = process.env.CONTACT_NOTIFICATION_EMAIL;
  if (!to) {
    console.info('Email notification skipped (CONTACT_NOTIFICATION_EMAIL not set)');
    return;
  }

  const submittedAt = message.createdAt ? new Date(message.createdAt).toISOString() : new Date().toISOString();

  await transport.sendMail({
    to,
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    subject: `New portfolio inquiry from ${message.name}`,
    text: `${message.name} (${message.email}) says:\n\n${message.message}\n\nSubmitted at: ${submittedAt}`,
    html: `<p><strong>${message.name}</strong> (${message.email}) sent a new message.</p><p><em>${message.subject}</em></p><p>${message.message}</p><p>Submitted at: ${submittedAt}</p>`
  });
};

module.exports = sendEmailNotification;
