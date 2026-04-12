const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    image: String,
    price: Number,
    quantity: Number
  }],
  shippingAddress: {
    fullName: String,
    phone: String,
    address: String,
    city: String
  },
  paymentMethod: { type: String, enum: ['COD', 'banking'], default: 'COD' },
  totalPrice: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  finalPrice: { type: Number, required: true },
  voucher: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Chờ xác nhận', 'Đang giao', 'Đã nhận', 'Đã hủy'],
    default: 'Chờ xác nhận'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
