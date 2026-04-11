const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// SCRUM-4: Giỏ hàng lưu ở client (localStorage), backend chỉ validate
// Validate sản phẩm còn hàng không
const Product = require('../models/Product');

router.post('/validate', protect, async (req, res) => {
  try {
    const { items } = req.body;
    const results = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) { results.push({ ...item, valid: false, message: 'Sản phẩm không tồn tại' }); continue; }
      if (product.stock < item.quantity) { results.push({ ...item, valid: false, message: 'Không đủ hàng' }); continue; }
      results.push({ ...item, valid: true, price: product.price, name: product.name, image: product.image });
    }
    res.json({ items: results });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
