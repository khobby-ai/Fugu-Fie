import fetch from 'node-fetch';

/**
 * Sends a WhatsApp text message to the store owner via CallMeBot's free
 * personal-use API. Silently no-ops (just logs) if not configured, so
 * missing credentials never break order creation or checkout.
 */
export async function notifyWhatsApp(text) {
  const phone = process.env.CALLMEBOT_PHONE;
  const apikey = process.env.CALLMEBOT_APIKEY;

  if (!phone || !apikey) {
    console.log('[WhatsApp notify skipped — CALLMEBOT_PHONE/APIKEY not set]', text);
    return;
  }

  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apikey)}`;
    await fetch(url);
  } catch (err) {
    console.error('WhatsApp notification failed:', err.message);
  }
}

/**
 * Sends an email notification to the store owner via Resend's free API.
 * Same silent-skip behavior if not configured.
 */
export async function notifyEmail(subject, text) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL_TO;
  // Resend's shared test sender — works with no domain setup required.
  // Swap in your own verified domain address later if you want emails to
  // arrive "from" your own brand instead of Resend's.
  const from = process.env.NOTIFY_EMAIL_FROM || 'Fugu Fie <onboarding@resend.dev>';

  if (!apiKey || !to) {
    console.log('[Email notify skipped — RESEND_API_KEY/NOTIFY_EMAIL_TO not set]', subject);
    return;
  }

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        text,
      }),
    });
  } catch (err) {
    console.error('Email notification failed:', err.message);
  }
}

/**
 * Fires both notification channels at once. Each fails independently —
 * a WhatsApp outage won't block the email, and vice versa.
 */
export async function notifyOwner(subject, text) {
  await Promise.allSettled([notifyWhatsApp(text), notifyEmail(subject, text)]);
}
