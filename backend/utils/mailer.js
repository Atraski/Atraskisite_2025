const nodemailer = require("nodemailer");

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST) return null; // not configured
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
  return transporter;
}

async function sendInviteEmail(to, link) {
  const tx = getTransporter();
  if (!tx) return false;
  const from = process.env.APP_FROM || process.env.SMTP_USER;
  const app = process.env.APP_NAME || "Admin";
  await tx.sendMail({
    from, to,
    subject: `${app} Invite`,
    html: `<p>You are invited to ${app}.</p><p><a href="${link}">Click here to set your password</a> (valid 24 hours)</p>`
  });
  return true;
}

module.exports = { sendInviteEmail };
