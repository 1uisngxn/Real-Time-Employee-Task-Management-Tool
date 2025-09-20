import { db, admin } from "../../firebase.js";
import sgMail from "@sendgrid/mail";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL;

// Login email with OTP
export const loginEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "email required" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await db.collection("employeeCodes").doc(email).set({
    code,
    expiresAt: admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    ),
  });

  const msg = {
    to: email,
    from: FROM_EMAIL,
    subject: "🔐 Your One-Time Passcode (OTP)",
    html: `
      <h3>Secure Login Verification</h3>
      <p>Your OTP is:</p>
      <h2 style="letter-spacing:4px;">${code}</h2>
      <p>Code expires in <b>5 minutes</b>.</p>
    `,
  };

  try {
    await sgMail.send(msg);
    return res.json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    console.error("❌ Email send error:", err.response?.body || err.message);
    return res.status(500).json({ error: "Failed to send OTP email" });
  }
};

// Validate OTP
export const validateAccessCode = async (req, res) => {
  const { email, accessCode } = req.body;
  if (!email || !accessCode)
    return res.status(400).json({ error: "email & accessCode required" });

  const docRef = db.collection("employeeCodes").doc(email);
  const docSnap = await docRef.get();
  if (!docSnap.exists) return res.status(404).json({ error: "No code found" });

  const data = docSnap.data();
  if (data.code !== accessCode)
    return res.status(400).json({ error: "Invalid code" });
  if (data.expiresAt.toDate() < new Date())
    return res.status(400).json({ error: "Code expired" });

  // Clear code
  await docRef.delete();

  // Lấy thông tin nhân viên
  const snapshot = await db.collection("employees").where("email", "==", email).get();
  if (snapshot.empty) return res.status(404).json({ error: "Employee not found" });

  const employee = snapshot.docs[0].data();

  return res.json({
    success: true,
    employee: {
      id: employee.employeeId,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      hasAccount: !!employee.username,
    },
  });
};

// Setup account (username + password)
export const setupAccount = async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password)
    return res.status(400).json({ error: "email, username, password required" });

  try {
    // check mail
    const snapshot = await db.collection("employees").where("email", "==", email).get();
    if (snapshot.empty) return res.status(404).json({ error: "Employee not found" });

    const docRef = snapshot.docs[0].ref;
    const employee = snapshot.docs[0].data();

    if (employee.username) {
      return res.status(400).json({ error: "Account already setup" });
    }

    // check username
    const userCheck = await db.collection("employees").where("username", "==", username).get();
    if (!userCheck.empty) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await docRef.update({
      username,
      password: hashedPassword,
    });

    return res.json({ success: true, message: "Account setup successfully" });
  } catch (err) {
    console.error("❌ SetupAccount error:", err);
    return res.status(500).json({ error: "Server error during setup" });
  }
};

// Login with username + password
export const loginEmployee = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "username & password required" });

  try {
    const snapshot = await db.collection("employees").where("username", "==", username).get();
    if (snapshot.empty) {
      console.log("❌ Không tìm thấy username:", username);
      return res.status(404).json({ error: "Invalid username or password" });
    }

    const employee = snapshot.docs[0].data();

    const isMatch = await bcrypt.compare(password, employee.password);

    if (!isMatch) return res.status(400).json({ error: "Invalid username or password" });

    // Generate JWT
    const token = jwt.sign(
      { id: employee.employeeId, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      success: true,
      token,
      employee: {
        id: employee.employeeId,
        name: employee.name,
        email: employee.email,
        role: employee.role,
      },
    });
  } catch (err) {
    console.error("❌ LoginEmployee error:", err);
    return res.status(500).json({ error: "Server error during login" });
  }
};
