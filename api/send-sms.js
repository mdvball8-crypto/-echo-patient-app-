// Vercel Serverless Function for Twilio SMS
// Environment variables required:
// - TWILIO_ACCOUNT_SID
// - TWILIO_AUTH_TOKEN
// - TWILIO_PHONE_NUMBER (format: +1XXXXXXXXXX)

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { to, message, audioUrl } = req.body;

  // Validate required fields
  if (!to || !message) {
    return res.status(400).json({ error: 'Missing required fields: to, message' });
  }

  // Check environment variables
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    console.error('Missing Twilio environment variables');
    return res.status(500).json({ error: 'SMS service not configured' });
  }

  try {
    // Use Twilio REST API directly (no SDK dependency needed)
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    const formData = new URLSearchParams();
    formData.append('To', to);
    formData.append('From', fromNumber);
    formData.append('Body', message);

    // If audio URL provided, send as MMS
    if (audioUrl) {
      formData.append('MediaUrl', audioUrl);
    }

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Twilio error:', data);
      return res.status(response.status).json({
        error: 'Failed to send SMS',
        details: data.message || 'Unknown error'
      });
    }

    // Success
    return res.status(200).json({
      success: true,
      messageSid: data.sid,
      status: data.status
    });

  } catch (error) {
    console.error('SMS send error:', error);
    return res.status(500).json({ error: 'Failed to send SMS', details: error.message });
  }
}
