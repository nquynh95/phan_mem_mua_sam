import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then(r => setOrder(r.data)).catch(() => toast.error('Không tìm thấy đơn hàng'));
  }, [id]);

  if (!order) return <div className="text-center py-16 text-gray-400">Đang tải...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <Link to="/orders" className="text-gray-400 hover:text-primary text-sm">← Đơn hàng của tôi</Link>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
        <p className="text-2xl mb-1">✅</p>
        <p className="font-bold text-green-700">Đặt hàng thành công!</p>
        <p className="text-sm text-green-600">Mã đơn: #{order._id.slice(-8).toUpperCase()}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold mb-3">📍 Địa chỉ giao hàng</h3>
        <p className="text-sm text-gray-700">{order.shippingAddress?.fullName} · {order.shippingAddress?.phone}</p>
        <p className="text-sm text-gray-500">{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold mb-3">Sản phẩm đã đặt</h3>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <img src={item.image || 'https://via.placeholder.com/60'} alt={item.name}
                className="w-14 h-14 object-cover rounded-lg bg-gray-50" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-400">x{item.quantity}</p>
              </div>
              <p className="font-semibold text-gray-700">{(item.price * item.quantity).toLocaleString()}đ</p>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-3 space-y-1 text-sm">
          <div className="flex justify-between"><span>Tạm tính:</span><span>{order.totalPrice?.toLocaleString()}đ</span></div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-green-600"><span>Giảm giá:</span><span>-{order.discountAmount?.toLocaleString()}đ</span></div>
          )}
          <div className="flex justify-between font-bold text-base pt-1 border-t">
            <span>Tổng thanh toán:</span><span className="text-primary">{order.finalPrice?.toLocaleString()}đ</span>
          </div>
          <div className="flex justify-between text-gray-500 pt-1">
            <span>Phương thức:</span><span>{order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản'}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Trạng thái:</span>
            <span className="font-semibold text-blue-600">{order.status}</span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link to="/products" className="bg-primary text-white px-8 py-2 rounded-lg hover:bg-red-600 transition font-semibold">
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
}
