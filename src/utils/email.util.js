import nodemailer from 'nodemailer';

/**
 * sendPendingLinkEmail(email, token)
 * - Uses SMTP settings if provided:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE (true/false)
 * - Falls back to logging the email for development if SMTP not configured.
 * - Constructs a frontend confirm URL: `${FRONTEND_URL}/auth/confirm-google-link?token=...`
 */
export const sendPendingLinkEmail = async (email, token) => {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_SECURE,
    EMAIL_FROM,
    FRONTEND_URL,
    BACKEND_URL
  } = process.env;

  const confirmUrl = FRONTEND_URL
    ? `${FRONTEND_URL.replace(/\/$/, '')}/auth/confirm-google-link?token=${encodeURIComponent(token)}`
    : `${(BACKEND_URL || '').replace(/\/$/, '')}/auth/confirm-google-link`;

  const subject = 'Confirm linking your Google account';
  const text = `We received a request to link your Google account.\n\nClick to confirm:\n${confirmUrl}\n\nIf you didn't request this, ignore this email.`;
  const html = `
    <p>We received a request to link your Google account.</p>
    <p><a href="${confirmUrl}">Confirm account link</a></p>
    <p>If you didn't request this, ignore this email.</p>
  `;

  // If SMTP not configured, print to console for local/dev use.
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    // Safe log: do not print secret info, only the URL and recipient
    console.warn('[sendPendingLinkEmail] SMTP not configured — printing email to console (dev):', {
      to: email,
      subject,
      confirmUrl
    });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: SMTP_SECURE === 'true' || false,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: EMAIL_FROM || SMTP_USER,
    to: email,
    subject,
    text,
    html
  });
};

export default sendPendingLinkEmail;