import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="bg-primary shadow-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-white text-2xl font-bold">🛍️ MuaSắm</Link>

        <div className="flex-1 mx-8">
          <form onSubmit={e => { e.preventDefault(); navigate(`/products?search=${e.target.search.value}`); }}
            className="flex">
            <input name="search" placeholder="Tìm kiếm sản phẩm..."
              className="w-full px-4 py-2 rounded-l-md text-sm outline-none" />
            <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded-r-md text-sm hover:bg-orange-700">
              Tìm
            </button>
          </form>
        </div>

        <div className="flex items-center gap-4 text-white text-sm">
          <Link to="/cart" className="relative flex flex-col items-center hover:text-orange-200">
            <span className="text-xl">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-yellow-400 text-red-700 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
            <span>Giỏ hàng</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/orders" className="flex flex-col items-center hover:text-orange-200">
                <span className="text-xl">📦</span>
                <span>Đơn hàng</span>
              </Link>
              <div className="flex flex-col items-center">
                <span className="text-xl">👤</span>
                <span>{user.name?.split(' ').pop()}</span>
              </div>
              <button onClick={handleLogout} className="bg-white text-primary px-3 py-1 rounded text-xs font-semibold hover:bg-orange-100">
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/register" className="hover:text-orange-200 flex flex-col items-center">
                <span className="text-xl">📝</span><span>Đăng ký</span>
              </Link>
              <Link to="/login" className="hover:text-orange-200 flex flex-col items-center">
                <span className="text-xl">🔑</span><span>Đăng nhập</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
