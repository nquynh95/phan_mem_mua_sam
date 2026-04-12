import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const statusColors = {
  'Chờ xác nhận': 'bg-yellow-100 text-yellow-700',
  'Đang giao': 'bg-blue-100 text-blue-700',
  'Đã nhận': 'bg-green-100 text-green-700',
  'Đã hủy': 'bg-red-100 text-red-700',
};

const statusSteps = ['Chờ xác nhận', 'Đang giao', 'Đã nhận'];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get('/orders/my-orders')
      .then(r => setOrders(r.data))
      .catch(() => toast.error('Không thể tải đơn hàng'))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="text-center py-16 text-gray-400">Đang tải đơn hàng...</div>;

  if (orders.length === 0) return (
    <div className="text-center py-20">
      <p className="text-5xl mb-4">📦</p>
      <p className="text-gray-400 text-lg mb-4">Bạn chưa có đơn hàng nào</p>
      <Link to="/products" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-600">Mua sắm ngay</Link>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="font-bold text-xl">📦 Đơn hàng của tôi</h2>
      {orders.map(order => (
        <div key={order._id} className="bg-white rounded-xl shadow-sm p-5">
          {/* Status bar */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">#{order._id.slice(-8).toUpperCase()}</span>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.status]}`}>
              {order.status}
            </span>
          </div>

          {/* Progress steps */}
          {order.status !== 'Đã hủy' && (
            <div className="flex items-center mb-4">
              {statusSteps.map((step, i) => {
                const active = statusSteps.indexOf(order.status) >= i;
                return (
                  <div key={step} className="flex items-center flex-1 last:flex-none">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${active ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
                      {active ? '✓' : i + 1}
                    </div>
                    <p className={`text-xs ml-1 ${active ? 'text-primary font-medium' : 'text-gray-400'}`}>{step}</p>
                    {i < statusSteps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${active ? 'bg-primary' : 'bg-gray-200'}`} />}
                  </div>
                );
              })}
            </div>
          )}

          {/* Items */}
          <div className="space-y-2 mb-3">
            {order.items.slice(0, 2).map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <img src={item.image || 'https://via.placeholder.com/50'} alt={item.name}
                  className="w-10 h-10 object-cover rounded-lg bg-gray-50" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700 line-clamp-1">{item.name}</p>
                  <p className="text-xs text-gray-400">x{item.quantity} · {item.price?.toLocaleString()}đ</p>
                </div>
              </div>
            ))}
            {order.items.length > 2 && <p className="text-xs text-gray-400">+{order.items.length - 2} sản phẩm khác</p>}
          </div>

          <div className="flex items-center justify-between pt-3 border-t">
            <div className="text-sm">
              <span className="text-gray-500">Tổng: </span>
              <span className="font-bold text-primary">{order.finalPrice?.toLocaleString()}đ</span>
            </div>
            <Link to={`/orders/${order._id}`}
              className="text-sm border border-primary text-primary px-4 py-1.5 rounded-lg hover:bg-orange-50 transition">
              Xem chi tiết
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
