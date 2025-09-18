// simple in-memory employee store
const employees = {}; // { empId: { employeeId, name, email, department } }
let nextId = 1;

exports.createEmployee = async (req, res) => {
  const { name, email, department } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'name & email required' });

  const employeeId = `emp_${nextId++}`;
  employees[employeeId] = { employeeId, name, email, department: department || '' };

  // mock sending email with credentials (log)
  console.log(`[MOCK EMAIL] to ${email}: account created for ${name} (id=${employeeId})`);

  return res.json({ success: true, employeeId });
};

exports.getEmployee = async (req, res) => {
  const { employeeId } = req.body;
  if (!employeeId || !employees[employeeId]) return res.status(404).json({ error: 'Employee not found' });
  return res.json({ employee: employees[employeeId] });
};

exports.deleteEmployee = async (req, res) => {
  const { employeeId } = req.body;
  if (!employeeId || !employees[employeeId]) return res.status(404).json({ error: 'Employee not found' });
  delete employees[employeeId];
  console.log(`Employee deleted: ${employeeId}`);
  return res.json({ success: true });
};
