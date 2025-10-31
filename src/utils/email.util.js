import nodemailer from 'nodemailer';

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_SECURE,
  EMAIL_FROM,
  FRONTEND_URL,
  BACKEND_URL,
  NODE_ENV
} = process.env;

let cachedTransporter = null;

const isValidEmail = (s = '') => {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(String(s).trim());
};

async function createTransporter() {
  if (cachedTransporter) return cachedTransporter;

  // Prefer explicit SMTP when configured
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    cachedTransporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: SMTP_SECURE === 'true' || SMTP_SECURE === '1' || false,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });
    return cachedTransporter;
  }

  // In non-production, create an Ethereal test account so devs can preview emails
  if (NODE_ENV !== 'production') {
    try {
      const testAccount = await nodemailer.createTestAccount();
      cachedTransporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.warn('[email.util] Using ethereal test account for emails (dev only).');
      return cachedTransporter;
    } catch (err) {
      console.warn('[email.util] Failed to create ethereal account, falling back to console logging:', err?.message);
      cachedTransporter = null;
      return null;
    }
  }

  // In production without SMTP, we intentionally return null
  return null;
}

/**
 * sendPendingLinkEmail(email, token)
 * - Uses SMTP settings if provided
 * - Falls back to Ethereal in dev for preview URLs
 * - Otherwise logs safe info to console in dev
 * - Returns an object with { sent: boolean, info, previewUrl? } or throws on unexpected failure
 */
export const sendPendingLinkEmail = async (email, token) => {
  if (!email || !isValidEmail(email)) {
    throw new Error('Invalid email address');
  }
  if (!token) {
    throw new Error('Missing token');
  }

  const confirmUrl = FRONTEND_URL
    ? `${FRONTEND_URL.replace(/\/$/, '')}/auth/confirm-google-link?token=${encodeURIComponent(token)}`
    : `${(BACKEND_URL || '').replace(/\/$/, '')}/auth/confirm-google-link?token=${encodeURIComponent(token)}`;

  const subject = 'Confirm linking your Google account';
  const text = `We received a request to link your Google account.\n\nClick to confirm:\n${confirmUrl}\n\nIf you didn't request this, ignore this email.`;
  const html = `
    <p>We received a request to link your Google account.</p>
    <p><a href="${confirmUrl}">Confirm account link</a></p>
    <p>If you didn't request this, ignore this email.</p>
  `;

  const transporter = await createTransporter();

  // If no transporter available, print safe info for local/dev use
  if (!transporter) {
    console.warn('[sendPendingLinkEmail] SMTP not configured — logging email (dev):', {
      to: email,
      subject,
      confirmUrl
    });
    return { sent: false, info: null, previewUrl: null };
  }

  try {
    const info = await transporter.sendMail({
      from: EMAIL_FROM || SMTP_USER || 'no-reply@example.com',
      to: email,
      subject,
      text,
      html
    });

    // If using Ethereal, return preview URL for developer convenience
    const previewUrl = nodemailer.getTestMessageUrl(info) || null;
    if (previewUrl) {
      console.info('[sendPendingLinkEmail] Preview URL (dev):', previewUrl);
    }

    return { sent: true, info, previewUrl };
  } catch (err) {
    console.error('[sendPendingLinkEmail] Failed to send email:', err?.message || err);
    // rethrow so callers (controllers) can handle/report the error properly
    throw err;
  }
};

export default sendPendingLinkEmail;
