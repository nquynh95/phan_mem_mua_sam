const express = require('express');
const router = express.Router();
const Voucher = require('../models/Voucher');
const { protect } = require('../middleware/authMiddleware');

// SCRUM-6: Kiểm tra và áp dụng voucher
router.post('/apply', protect, async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    const voucher = await Voucher.findOne({ code: code.toUpperCase(), isActive: true });
    if (!voucher) return res.status(404).json({ message: 'Mã voucher không hợp lệ' });
    if (new Date() > voucher.expiresAt) return res.status(400).json({ message: 'Voucher đã hết hạn' });
    if (orderTotal < voucher.minOrder)
      return res.status(400).json({ message: `Đơn hàng tối thiểu ${voucher.minOrder.toLocaleString()}đ` });

    const discount = Math.min((orderTotal * voucher.discountPercent) / 100, voucher.maxDiscount);
    res.json({ valid: true, discount, discountPercent: voucher.discountPercent, message: `Giảm ${discount.toLocaleString()}đ` });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Seed voucher mẫu
router.post('/seed', async (req, res) => {
  try {
    await Voucher.deleteMany({});
    await Voucher.insertMany([
      { code: 'GIAM10', discountPercent: 10, maxDiscount: 50000, minOrder: 100000, expiresAt: new Date('2025-12-31') },
      { code: 'SALE20', discountPercent: 20, maxDiscount: 100000, minOrder: 200000, expiresAt: new Date('2025-12-31') },
      { code: 'NEWUSER', discountPercent: 15, maxDiscount: 75000, minOrder: 0, expiresAt: new Date('2025-12-31') },
    ]);
    res.json({ message: 'Đã thêm voucher mẫu' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi', error: err.message });
  }
});

module.exports = router;
