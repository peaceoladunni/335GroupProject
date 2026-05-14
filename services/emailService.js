"use strict";

const emailjs = require("@emailjs/nodejs");

/* pull config from env */
const SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
const PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;

if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY || !PRIVATE_KEY) {
  console.warn("warning: one or more EMAILJS_* env vars are not set, emails will fail");
}

/* send a quote email via EmailJS, returns { success: true } or { success: false, error: "..." } */
async function sendQuoteEmail(toEmail, quote, author) {
  /* fail loud on bad input */
  if (!toEmail || !quote || !author) {
    return { success: false, error: "missing toEmail, quote, or author" };
  }

  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY || !PRIVATE_KEY) {
    return { success: false, error: "EmailJS env vars not configured" };
  }

  /* template params — keys MUST match the {{placeholders}} in your EmailJS template */
  const templateParams = {
    to_email: toEmail,
    quote: quote,
    author: author
  };

  try {
    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, {
      publicKey: PUBLIC_KEY,
      privateKey: PRIVATE_KEY
    });

    if (response.status == 200) {
      return { success: true };
    }
    return { success: false, error: `unexpected response: ${response.status} ${response.text}` };
  } catch (err) {
    const detail = err.text ? `${err.status}: ${err.text}` : err.message;
    console.error("emailjs error:", detail);
    return { success: false, error: detail };
  }
}

module.exports = { sendQuoteEmail };