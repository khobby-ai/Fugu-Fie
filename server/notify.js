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
    // Never let a failed notification break the actual order/request flow.
    console.error('WhatsApp notification failed:', err.message);
  }
}
