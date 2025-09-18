const { db, admin } = require("../../firebase");

// CREATE employee
exports.createEmployee = async (req, res) => {
  try {
    const { name, phone, email, role, address } = req.body;
    if (!name || !phone || !email || !role) {
      return res.status(400).json({ error: "name, phone, email, role are required" });
    }

    // check duplicate email
    const snapshot = await db.collection("employees").where("email", "==", email).get();
    if (!snapshot.empty) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const employeeRef = db.collection("employees").doc();
    const employeeData = {
      employeeId: employeeRef.id,
      name,
      phone,
      email,
      role,
      address: address || "",
      status: "Active",
      createdAt: admin.firestore.Timestamp.now(),
    };

    await employeeRef.set(employeeData);

    console.log(`[EMAIL MOCK] to ${email}: account created for ${name}`);

    return res.json({ success: true, employee: employeeData });
  } catch (err) {
    console.error("createEmployee error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// GET employee by ID
exports.getEmployee = async (req, res) => {
  try {
    const { employeeId } = req.body;
    if (!employeeId) return res.status(400).json({ error: "employeeId required" });

    const doc = await db.collection("employees").doc(employeeId).get();
    if (!doc.exists) return res.status(404).json({ error: "Employee not found" });

    const data = doc.data();
    return res.json({
      employee: {
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
      },
    });
  } catch (err) {
    console.error("getEmployee error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// LIST all employees
exports.listEmployees = async (req, res) => {
  try {
    const snapshot = await db.collection("employees").orderBy("createdAt", "desc").get();
    const employees = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate().toISOString(),
      };
    });

    return res.json({ employees });
  } catch (err) {
    console.error("listEmployees error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// UPDATE employee
exports.updateEmployee = async (req, res) => {
  try {
    const { employeeId, name, phone, email, role, address, status } = req.body;
    if (!employeeId) return res.status(400).json({ error: "employeeId required" });

    const docRef = db.collection("employees").doc(employeeId);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: "Employee not found" });

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (address) updateData.address = address;
    if (status) updateData.status = status;

    await docRef.update(updateData);

    return res.json({ success: true, updated: updateData });
  } catch (err) {
    console.error("updateEmployee error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// DELETE employee
exports.deleteEmployee = async (req, res) => {
  try {
    const { employeeId } = req.body;
    if (!employeeId) return res.status(400).json({ error: "employeeId required" });

    const docRef = db.collection("employees").doc(employeeId);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: "Employee not found" });

    await docRef.delete();
    console.log(`Employee deleted: ${employeeId}`);

    return res.json({ success: true });
  } catch (err) {
    console.error("deleteEmployee error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
