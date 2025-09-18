// mock in-memory store for owner phone codes
const phoneCodes = {}; // { phoneNumber: { code, expiresAt } }

function gen6() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.createNewAccessCode = async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) return res.status(400).json({ error: 'phoneNumber required' });

  const code = gen6();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  phoneCodes[phoneNumber] = { code, expiresAt };

  // mock sending SMS: log to console
  console.log(`[MOCK SMS] to ${phoneNumber}: your access code is ${code}`);

  // return mock code for testing (MOCK_MODE true)
  return res.json({ success: true, accessCode: code });
};

exports.validateAccessCode = async (req, res) => {
  const { phoneNumber, accessCode } = req.body;
  if (!phoneNumber || !accessCode) return res.status(400).json({ error: 'phoneNumber & accessCode required' });

  const record = phoneCodes[phoneNumber];
  if (!record) return res.status(404).json({ success: false, message: 'No code found' });

  if (Date.now() > record.expiresAt) {
    phoneCodes[phoneNumber] = { code: '' };
    return res.status(400).json({ success: false, message: 'Code expired' });
  }

  if (record.code === accessCode) {
    phoneCodes[phoneNumber] = { code: '' }; // clear per requirement
    return res.json({ success: true });
  }

  return res.status(400).json({ success: false, message: 'Invalid code' });
};
