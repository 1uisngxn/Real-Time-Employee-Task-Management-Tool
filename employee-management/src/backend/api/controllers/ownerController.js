const { formatPhoneNumber } = require ("../../../utils/phoneUtils.js");
const { db, admin } = require("../../firebase");
const { getAuth } = require("firebase-admin/auth");
const sgMail = require("@sendgrid/mail");

// SendGrid setup
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL;

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

// 👨‍💼 CRUD EMPLOYEES 
exports.createEmployee = async (req, res) => {
  try {
    const { name, phone, email, role, address } = req.body;
    if (!name || !phone || !email || !role) {
      return res
        .status(400)
        .json({ error: "name, phone, email, role are required" });
    }

    // Check email duplicate
    const snapshot = await db
      .collection("employees")
      .where("email", "==", email)
      .get();
    if (!snapshot.empty) {
      return res.status(400).json({ error: "Email already exists" });
    }
    // format phone
    const formattedPhone = formatPhoneNumber(phone);

     // Create user with temp password
    const auth = getAuth();
    const userRecord = await auth.createUser({
      email,
      phoneNumber: formattedPhone,
      password: "TempPass123!", 
      displayName: name,
    });
    
    // Generate login token
    const loginToken = Math.random().toString(36).substring(2, 15);
    const expiresAt = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
    );

    // Save to Firestore
    const employeeRef = db.collection("employees").doc();
    const employeeData = {
      employeeId: employeeRef.id,
      name,
      phone: formattedPhone,
      email,
      role,
      address: address || "",
      status: "Pending",
      loginToken,
      expiresAt,
      createdAt: admin.firestore.Timestamp.now(),
      authUid: userRecord.uid,
    };
    await employeeRef.set(employeeData);

    // Send email with setup link
    const loginLink = `http://localhost:3000/authEmployee?loginToken=${loginToken}`;
    const msg = {
    to: email,
    from: process.env.FROM_EMAIL,
    subject: "Welcome to Our Company - Set up your account",
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        
        <!-- Header -->
        <div style="background: #4f46e5; color: #fff; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">Welcome to Our Company 🎉</h2>
        </div>

        <!-- Body -->
        <div style="padding: 20px;">
          <p>Hi <strong>${name}</strong>,</p>
          <p>Your account has been created successfully. To complete the setup, please log in using the button below.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginLink}" 
              style="display: inline-block; padding: 12px 24px; background: #4f46e5; color: #fff; 
                      text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
              Set Up Your Account
            </a>
          </div>

          <p>This link will expire in <strong>24 hours</strong>.</p>
          <p>If you didn’t expect this email, please ignore it.</p>
        </div>

        <!-- Footer -->
        <div style="background: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          <p>© ${new Date().getFullYear()} HR Team - Our Company</p>
        </div>
      </div>
    </div>
    `,
  };

    try {
      await sgMail.send(msg);
      console.log(" Setup email sent to:", email);
    } catch (err) {
      console.error(" SendGrid error:", err.response?.body || err.message);
    }

    return res.json({ success: true, employee: employeeData });
  } catch (err) {
    console.error(" createEmployee error:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { employeeId, name, phone, email, role, address, status } = req.body;
    if (!employeeId)
      return res.status(400).json({ error: "employeeId required" });

    const docRef = db.collection("employees").doc(employeeId);
    const doc = await docRef.get();
    if (!doc.exists)
      return res.status(404).json({ error: "Employee not found" });

    const data = doc.data();
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (address) updateData.address = address;
    if (status) updateData.status = status;

    await docRef.update(updateData);

    // Update Firebase Auth 
    if (email && data.authUid) {
      const auth = getAuth();
      await auth.updateUser(data.authUid, { email });
    }

    return res.json({ success: true, updated: updateData });
  } catch (err) {
    console.error(" updateEmployee error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId)
      return res.status(400).json({ error: "employeeId required" });

    // get document employee
    const docRef = db.collection("employees").doc(employeeId);
    const doc = await docRef.get();

    if (!doc.exists)
      return res.status(404).json({ error: "Employee not found" });

    const data = doc.data();
    const authUid = data.authUid;

    // Delete Firestore
    await docRef.delete();
    console.log(` Firestore employee deleted: ${employeeId}`);

    // Delete Firebase Auth 
    if (authUid) {
      try {
        await admin.auth().deleteUser(authUid);
        console.log(` Firebase Auth user deleted: ${authUid}`);
      } catch (authErr) {
        console.error(` Failed to delete Firebase Auth user: ${authUid}`, authErr);
      }
    } else {
      console.log(" No authUid found for this employee, skipping Firebase Auth deletion.");
    }

    return res.json({ success: true });
  } catch (err) {
    console.error(" deleteEmployee error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};

exports.listEmployees = async (req, res) => {
  try {
    const snapshot = await db
      .collection("employees")
      .orderBy("createdAt", "desc")
      .get();

    const employees = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
      };
    });

    return res.json({ employees });
  } catch (err) {
    console.error(" listEmployees error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.getEmployee = async (req, res) => {
  try {
    const { employeeId } = req.body;
    if (!employeeId)
      return res.status(400).json({ error: "employeeId required" });

    const doc = await db.collection("employees").doc(employeeId).get();
    if (!doc.exists)
      return res.status(404).json({ error: "Employee not found" });

    const data = doc.data();
    return res.json({
      employee: {
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
      },
    });
  } catch (err) {
    console.error(" getEmployee error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
