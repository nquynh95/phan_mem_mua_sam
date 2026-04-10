const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// SCRUM-1: Đăng ký tài khoản
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Mật khẩu tối thiểu 6 ký tự' });
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// SCRUM-2: Đăng nhập tài khoản
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// Lấy thông tin người dùng hiện tại
router.get('/me', require('../middleware/authMiddleware').protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;
