require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Cho phép frontend http://localhost:3000 gọi API
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// routes
const ownerRoutes = require('./api/routes/ownerRoutes');
const employeeRoutes = require('./api/routes/employeeRoutes');
const authRoutes = require('./api/routes/authRoutes');

app.use('/api/owner', ownerRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/auth', authRoutes);

// simple health
app.get('/health', (req, res) => res.json({ ok: true }));

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
