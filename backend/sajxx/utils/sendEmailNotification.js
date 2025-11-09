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

  // Format timestamp in Indian Standard Time (IST)
  const toIST = (date) => {
    try {
      return new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).format(date) + ' IST';
    } catch (_) {
      // Fallback: manual offset (+5:30)
      const offsetMs = (5 * 60 + 30) * 60 * 1000;
      const d = new Date(date.getTime() + offsetMs);
      return d.toISOString().replace('T', ' ').replace('Z', '') + ' IST';
    }
  };

  const submittedAt = toIST(new Date(message.createdAt || Date.now()));

  // Basic HTML escaping to prevent broken markup (email is trusted but sanitize minimal)
  const esc = (str = '') => String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const name = esc(message.name);
  const email = esc(message.email);
  const subject = esc(message.subject || 'New Inquiry');
  const body = esc(message.message).replace(/\n/g, '<br/>');

  const brand = {
    gradientStart: '#0f172a',
    gradientEnd: '#1e1b4b',
    accentPrimary: '#3b82f6',
    accentSecondary: '#8b5cf6',
    accentTertiary: '#ec4899'
  };

  const adminUrl = process.env.ADMIN_URL || process.env.FRONTEND_BASE_URL || '';

  const html = `<!DOCTYPE html>
  <html lang="en" style="background:${brand.gradientStart};">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>${subject}</title>
    <style>
      /* Some clients support this, Gmail may ignore but Apple Mail honors */
      @media (max-width: 600px) {
        .container { width: 94% !important; padding-left: 16px !important; padding-right: 16px !important; }
        .px { padding-left: 16px !important; padding-right: 16px !important; }
        .py { padding-top: 16px !important; padding-bottom: 16px !important; }
        h1 { font-size: 22px !important; }
        h2 { font-size: 18px !important; }
        .btn { padding: 12px 20px !important; font-size: 14px !important; }
      }
      /* Outlook.com dark mode tweaks */
      [data-ogsc] .panel { background:#0f172a !important; }
      [data-ogsc] .footer { background:#0b1220 !important; }
      [data-ogsc] .text, [data-ogsc] p, [data-ogsc] td { color:#e2e8f0 !important; }
    </style>
  </head>
  <body style="margin:0;padding:0;background-color:${brand.gradientStart};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#e2e8f0;">
    <!-- Preheader -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;visibility:hidden;mso-hide:all;">
      New inquiry from ${name} — ${subject}
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#0f172a" style="background-color:${brand.gradientStart};padding:24px 0;">
      <tr>
        <td align="center">
          <table class="container" width="600" cellpadding="0" cellspacing="0" bgcolor="#0f172a" style="width:600px;max-width:600px;border-radius:16px;overflow:hidden;background-color:#0f172a;border:1px solid rgba(255,255,255,0.08);">
            <tr>
              <td class="px py" style="padding:28px 32px;background:linear-gradient(135deg,${brand.accentPrimary} 0%,${brand.accentSecondary} 60%,${brand.accentTertiary} 100%);color:#fff;">
                <h1 style="margin:0;font-size:24px;line-height:1.3;font-weight:700;letter-spacing:.4px;">New Portfolio Inquiry</h1>
                <p style="margin:8px 0 0;font-size:13px;opacity:0.95;">Submitted at <strong>${submittedAt}</strong></p>
              </td>
            </tr>
            <tr>
              <td class="px" style="padding:24px 32px;background-color:#0f172a;">
                <h2 style="margin:0 0 14px;font-size:20px;font-weight:600;color:${brand.accentPrimary};">Contact Details</h2>
                <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin:0 0 20px;">
                  <tr>
                    <td class="text" style="padding:6px 0;font-size:14px;width:120px;color:#94a3b8;">Name:</td>
                    <td class="text" style="padding:6px 0;font-size:14px;font-weight:600;color:#e2e8f0;">${name}</td>
                  </tr>
                  <tr>
                    <td class="text" style="padding:6px 0;font-size:14px;width:120px;color:#94a3b8;">Email:</td>
                    <td class="text" style="padding:6px 0;font-size:14px;font-weight:600;color:#e2e8f0;">${email}</td>
                  </tr>
                  <tr>
                    <td class="text" style="padding:6px 0;font-size:14px;width:120px;color:#94a3b8;">Subject:</td>
                    <td class="text" style="padding:6px 0;font-size:14px;font-weight:600;color:#e2e8f0;">${subject}</td>
                  </tr>
                </table>

                <h2 style="margin:0 0 10px;font-size:20px;font-weight:600;color:${brand.accentSecondary};">Message</h2>
                <div class="panel" style="background-color:#101a34;border:1px solid rgba(255,255,255,0.08);padding:16px 18px;border-radius:12px;font-size:15px;line-height:1.6;color:#f8fafc;">
                  ${body}
                </div>

                ${adminUrl ? `<div style="margin-top:24px;text-align:center;">
                  <a class="btn" href="${adminUrl}" style="display:inline-block;padding:12px 24px;font-size:15px;font-weight:600;letter-spacing:.3px;color:#fff;text-decoration:none;border-radius:999px;background:linear-gradient(135deg,${brand.accentPrimary} 0%,${brand.accentSecondary} 50%,${brand.accentTertiary} 100%);box-shadow:0 8px 24px -6px rgba(59,130,246,0.4);">
                    Open Admin Dashboard
                  </a>
                  <div style="font-size:12px;color:#94a3b8;margin-top:8px;">Or paste this link in your browser: <span style="color:#cbd5e1;">${adminUrl}</span></div>
                </div>` : ''}
              </td>
            </tr>
            <tr>
              <td class="px footer" style="padding:20px 32px;background-color:#0b1220;border-top:1px solid rgba(255,255,255,0.06);">
                <p style="margin:0 0 6px;font-size:12px;letter-spacing:.3px;color:#94a3b8;">You received this email because someone submitted the contact form on your portfolio.</p>
                <p style="margin:0;font-size:12px;color:#94a3b8;">Reply directly to <strong style="color:#e2e8f0;">${email}</strong> to continue the conversation.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;

  const text = `${message.name} (${message.email})\nSubject: ${message.subject}\n\n${message.message}\n\nSubmitted at: ${submittedAt}${adminUrl ? `\nAdmin: ${adminUrl}` : ''}`;

  await transport.sendMail({
    to,
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    replyTo: message.email,
  subject: `Portfolio Inquiry: ${message.name} — ${message.subject || 'New Inquiry'}`,
    text,
    html
  });
};

module.exports = sendEmailNotification;
