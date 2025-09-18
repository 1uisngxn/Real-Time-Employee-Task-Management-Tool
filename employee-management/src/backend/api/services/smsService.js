const MOCK = process.env.MOCK_MODE === 'true';

async function sendSmsMock(to, message) {
  console.log(`[MOCK SMS] to=${to} message=${message}`);
  return { success: true };
}

// export unified method; replace implementation if Twilio configured
module.exports = {
  sendSms: async (to, message) => {
    if (MOCK) return sendSmsMock(to, message);
    // implement Twilio here if desired
    return sendSmsMock(to, message);
  }
};
