import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) { toast.error('Vui lòng đăng nhập trước'); return navigate('/login'); }
    if (cart.length === 0) return toast.error('Giỏ hàng trống');
    navigate('/checkout');
  };

  if (cart.length === 0) return (
    <div className="text-center py-20">
      <p className="text-5xl mb-4">🛒</p>
      <p className="text-gray-400 text-lg mb-4">Giỏ hàng của bạn đang trống</p>
      <Link to="/products" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-600">Mua sắm ngay</Link>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-3">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="font-bold text-lg mb-4">Giỏ hàng ({cart.length} sản phẩm)</h2>
          {cart.map(item => (
            <div key={item.product} className="flex items-center gap-4 py-3 border-b last:border-0">
              <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name}
                className="w-16 h-16 object-cover rounded-lg bg-gray-50" />
              <div className="flex-1">
                <p className="font-medium text-gray-800 line-clamp-2">{item.name}</p>
                <p className="text-primary font-bold">{item.price?.toLocaleString()}đ</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.product, item.quantity - 1)}
                  className="w-7 h-7 rounded border hover:border-primary flex items-center justify-center">−</button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product, item.quantity + 1)}
                  className="w-7 h-7 rounded border hover:border-primary flex items-center justify-center">+</button>
              </div>
              <p className="font-bold text-gray-700 w-24 text-right">{(item.price * item.quantity).toLocaleString()}đ</p>
              <button onClick={() => removeFromCart(item.product)}
                className="text-gray-400 hover:text-red-500 ml-2">✕</button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 h-fit sticky top-4">
        <h3 className="font-bold text-lg mb-4">Tóm tắt đơn hàng</h3>
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between"><span>Tạm tính:</span><span>{totalPrice.toLocaleString()}đ</span></div>
          <div className="flex justify-between"><span>Phí ship:</span><span className="text-green-600">Miễn phí</span></div>
          <div className="flex justify-between font-bold text-base pt-2 border-t">
            <span>Tổng cộng:</span><span className="text-primary">{totalPrice.toLocaleString()}đ</span>
          </div>
        </div>
        <button onClick={handleCheckout}
          className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-red-600 transition">
          Tiến hành thanh toán
        </button>
        <Link to="/products" className="block text-center text-sm text-gray-500 mt-3 hover:text-primary">
          ← Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
}
