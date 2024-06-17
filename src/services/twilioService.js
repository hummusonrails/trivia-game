const client = require('../config/twilioConfig');

async function sendSms(to, body) {
  return client.messages.create({
    body: body,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: to,
  });
}

async function makeCall(to, twimlUrl) {
  return client.calls.create({
    url: twimlUrl,
    to: to,
    from: process.env.TWILIO_PHONE_NUMBER,
  });
}

module.exports = { sendSms, makeCall };
