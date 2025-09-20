require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { db } = require('./firebase');

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

app.use('/api/owner', ownerRoutes);
app.use('/api/employee', employeeRoutes);

// simple health check
app.get('/health', (req, res) => res.json({ ok: true }));

// error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 5000;

// 👉 thay vì app.listen, dùng http server
const server = http.createServer(app);

// 👉 setup socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  }
});

// 👉 lưu online users
const online = {};

function roomName(ownerId, empId) {
  return `owner_${ownerId}_emp_${empId}`;
}

io.on('connection', (socket) => {
  console.log('⚡ New socket connected:', socket.id);

  socket.on('join', ({ userId, role }) => {
    online[userId] = socket.id;
    socket.data.userId = userId;
    socket.data.role = role;
    console.log(`👤 ${role} ${userId} joined with socket ${socket.id}`);
  });

  // khi joinRoom thì lấy lịch sử từ Firestore
  socket.on('joinRoom', async ({ ownerId, empId }) => {
    const room = roomName(ownerId, empId);
    socket.join(room);

    try {
      const snap = await db
        .collection('chats')
        .doc(room)
        .collection('messages')
        .orderBy('ts')
        .get();

      const msgs = snap.docs.map(d => d.data());
      socket.emit('history', { room, messages: msgs });
      console.log(`📌 ${socket.id} joined room ${room}, loaded ${msgs.length} messages`);
    } catch (err) {
      console.error("🔥 Firestore load error:", err);
    }
  });

  // khi gửi message thì lưu vào Firestore và emit cho room
  socket.on('sendMessage', async ({ ownerId, empId, fromId, toId, text }) => {
    const room = roomName(ownerId, empId);
    const msg = { fromId, toId, text, ts: Date.now() };

    try {
      await db
        .collection('chats')
        .doc(room)
        .collection('messages')
        .add(msg);
    } catch (err) {
      console.error("🔥 Firestore save error:", err);
    }

    io.to(room).emit('newMessage', { room, message: msg });
  });

  socket.on('disconnect', () => {
    const uid = socket.data.userId;
    if (uid && online[uid]) delete online[uid];
    console.log('❌ Socket disconnected:', socket.id);
  });
});

// 🚀 start server
server.listen(PORT, () => 
  console.log(`✅ Server + Socket running on http://localhost:${PORT}`)
);
