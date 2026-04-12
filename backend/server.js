const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/vouchers', require('./routes/voucherRoutes'));

app.get('/', (req, res) => res.json({ message: 'Phần mềm mua sắm API đang chạy!' }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Kết nối MongoDB thành công');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server chạy tại port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.error('Lỗi kết nối MongoDB:', err));
