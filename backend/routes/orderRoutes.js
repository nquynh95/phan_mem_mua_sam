const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

// SCRUM-5: Đặt hàng và thanh toán
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalPrice, discountAmount, finalPrice, voucher } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ message: 'Giỏ hàng trống' });

    const order = await Order.create({
      user: req.user._id, items, shippingAddress,
      paymentMethod, totalPrice, discountAmount, finalPrice, voucher
    });

    // Trừ tồn kho
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, sold: item.quantity }
      });
    }
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// SCRUM-7: Theo dõi đơn hàng - lấy danh sách đơn của tôi
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name image');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Xem chi tiết đơn hàng
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Không có quyền' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
