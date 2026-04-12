import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ fullName: user?.name || '', phone: '', address: '', city: '' });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [voucher, setVoucher] = useState('');
  const [discount, setDiscount] = useState(0);
  const [voucherMsg, setVoucherMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // SCRUM-6: Áp dụng voucher
  const applyVoucher = async () => {
    if (!voucher) return;
    try {
      const { data } = await api.post('/vouchers/apply', { code: voucher, orderTotal: totalPrice });
      setDiscount(data.discount);
      setVoucherMsg(data.message);
      toast.success(data.message);
    } catch (err) {
      setDiscount(0);
      setVoucherMsg(err.response?.data?.message || 'Voucher không hợp lệ');
      toast.error(err.response?.data?.message || 'Voucher không hợp lệ');
    }
  };

  // SCRUM-5: Đặt hàng
  const handleOrder = async () => {
    if (!address.fullName || !address.phone || !address.address || !address.city)
      return toast.error('Vui lòng điền đầy đủ địa chỉ');
    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        items: cart.map(i => ({ product: i.product, name: i.name, image: i.image, price: i.price, quantity: i.quantity })),
        shippingAddress: address, paymentMethod,
        totalPrice, discountAmount: discount,
        finalPrice: totalPrice - discount, voucher
      });
      clearCart();
      toast.success('Đặt hàng thành công!');
      navigate(`/orders/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đặt hàng thất bại');
    } finally {
      setLoading(false);
    }
  };

  const finalPrice = totalPrice - discount;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        {/* Địa chỉ */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-bold text-lg mb-4">📍 Địa chỉ giao hàng</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Họ tên người nhận', key: 'fullName', col: 'col-span-1' },
              { label: 'Số điện thoại', key: 'phone', col: 'col-span-1' },
              { label: 'Địa chỉ', key: 'address', col: 'col-span-2' },
              { label: 'Tỉnh / Thành phố', key: 'city', col: 'col-span-2' },
            ].map(({ label, key, col }) => (
              <div key={key} className={col}>
                <label className="text-sm text-gray-600 mb-1 block">{label}</label>
                <input value={address[key]} onChange={e => setAddress({ ...address, [key]: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            ))}
          </div>
        </div>

        {/* Phương thức thanh toán */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-bold text-lg mb-4">💳 Phương thức thanh toán</h2>
          <div className="space-y-2">
            {[{ value: 'COD', label: '💵 Thanh toán khi nhận hàng (COD)' },
              { value: 'banking', label: '🏦 Chuyển khoản ngân hàng' }].map(opt => (
              <label key={opt.value} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${paymentMethod === opt.value ? 'border-primary bg-orange-50' : 'border-gray-200'}`}>
                <input type="radio" value={opt.value} checked={paymentMethod === opt.value}
                  onChange={e => setPaymentMethod(e.target.value)} className="accent-primary" />
                <span className="text-sm font-medium">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Voucher - SCRUM-6 */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-bold text-lg mb-4">🎟️ Mã giảm giá</h2>
          <div className="flex gap-2">
            <input value={voucher} onChange={e => setVoucher(e.target.value.toUpperCase())}
              placeholder="Nhập mã voucher (VD: GIAM10)"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            <button onClick={applyVoucher}
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600">Áp dụng</button>
          </div>
          {voucherMsg && <p className={`text-sm mt-2 ${discount > 0 ? 'text-green-600' : 'text-red-500'}`}>{voucherMsg}</p>}
          <p className="text-xs text-gray-400 mt-1">Thử: GIAM10 · SALE20 · NEWUSER</p>
        </div>
      </div>

      {/* Tóm tắt */}
      <div className="bg-white rounded-xl shadow-sm p-5 h-fit sticky top-4">
        <h3 className="font-bold text-lg mb-3">Đơn hàng ({cart.length} sản phẩm)</h3>
        <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
          {cart.map(item => (
            <div key={item.product} className="flex justify-between text-sm">
              <span className="text-gray-600 line-clamp-1 flex-1">{item.name} x{item.quantity}</span>
              <span className="font-medium ml-2">{(item.price * item.quantity).toLocaleString()}đ</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-3 space-y-1 text-sm">
          <div className="flex justify-between"><span>Tạm tính:</span><span>{totalPrice.toLocaleString()}đ</span></div>
          {discount > 0 && <div className="flex justify-between text-green-600"><span>Giảm giá:</span><span>-{discount.toLocaleString()}đ</span></div>}
          <div className="flex justify-between font-bold text-base pt-2 border-t">
            <span>Tổng thanh toán:</span><span className="text-primary">{finalPrice.toLocaleString()}đ</span>
          </div>
        </div>
        <button onClick={handleOrder} disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-red-600 transition mt-4 disabled:opacity-50">
          {loading ? 'Đang xử lý...' : '✅ Đặt hàng'}
        </button>
      </div>
    </div>
  );
}
