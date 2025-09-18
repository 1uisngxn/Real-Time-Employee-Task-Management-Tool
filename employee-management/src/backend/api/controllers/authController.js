// in-memory email codes
const emailCodes = {}; // { email: { code, expiresAt } }

function gen6() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.loginEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'email required' });

  const code = gen6();
  const expiresAt = Date.now() + 5 * 60 * 1000;
  emailCodes[email] = { code, expiresAt };

  console.log(`[MOCK EMAIL] to ${email}: your login code is ${code}`);
  return res.json({ success: true, accessCode: code });
};

exports.validateAccessCode = async (req, res) => {
  const { email, accessCode } = req.body;
  if (!email || !accessCode) return res.status(400).json({ error: 'email & accessCode required' });

  const rec = emailCodes[email];
  if (!rec) return res.status(404).json({ success: false, message: 'No code found' });
  if (Date.now() > rec.expiresAt) {
    emailCodes[email] = { code: '' };
    return res.status(400).json({ success: false, message: 'Code expired' });
  }
  if (rec.code === accessCode) {
    emailCodes[email] = { code: '' };
    return res.json({ success: true });
  }
  return res.status(400).json({ success: false, message: 'Invalid code' });
};
