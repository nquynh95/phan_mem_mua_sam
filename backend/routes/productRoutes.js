const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

// SCRUM-3: Xem danh sách và tìm kiếm sản phẩm
router.get('/', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.category = category;
    if (minPrice || maxPrice) query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip((page - 1) * limit).limit(Number(limit))
      .sort({ createdAt: -1 });
    res.json({ products, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// Xem chi tiết sản phẩm
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Thêm sản phẩm mới (seller)
router.post('/', protect, async (req, res) => {
  try {
    const product = await Product.create({ ...req.body, seller: req.user._id });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// Seed dữ liệu mẫu
router.post('/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    const products = [
      { name: 'Áo thun nam basic', description: 'Áo thun cotton 100%', price: 150000, originalPrice: 200000, category: 'Thời trang', image: 'https://via.placeholder.com/300x300?text=Ao+Thun', stock: 100 },
      { name: 'Giày sneaker trắng', description: 'Giày thể thao năng động', price: 450000, originalPrice: 600000, category: 'Giày dép', image: 'https://via.placeholder.com/300x300?text=Giay+Sneaker', stock: 50 },
      { name: 'Tai nghe bluetooth', description: 'Âm thanh chất lượng cao', price: 350000, originalPrice: 500000, category: 'Điện tử', image: 'https://via.placeholder.com/300x300?text=Tai+Nghe', stock: 30 },
      { name: 'Balo laptop 15 inch', description: 'Chống nước, nhiều ngăn', price: 280000, originalPrice: 350000, category: 'Túi xách', image: 'https://via.placeholder.com/300x300?text=Balo', stock: 60 },
      { name: 'Kem dưỡng da mặt', description: 'Dưỡng ẩm 24h', price: 120000, originalPrice: 180000, category: 'Làm đẹp', image: 'https://via.placeholder.com/300x300?text=Kem+Duong', stock: 200 },
      { name: 'Sách lập trình Python', description: 'Học Python từ cơ bản', price: 85000, originalPrice: 120000, category: 'Sách', image: 'https://via.placeholder.com/300x300?text=Sach+Python', stock: 40 },
    ];
    await Product.insertMany(products);
    res.json({ message: 'Đã thêm dữ liệu mẫu thành công', count: products.length });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi', error: err.message });
  }
});

module.exports = router;
