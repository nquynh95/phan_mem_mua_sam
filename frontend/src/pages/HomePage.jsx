import { Link } from 'react-router-dom';

const categories = ['Thời trang', 'Giày dép', 'Điện tử', 'Túi xách', 'Làm đẹp', 'Sách'];
const banners = ['🛍️ SALE 50% Thời trang', '⚡ Flash Sale Điện tử', '🎁 Voucher miễn phí ship'];

export default function HomePage() {
  return (
    <div>
      {/* Banner */}
      <div className="bg-gradient-to-r from-primary to-orange-400 rounded-xl p-8 mb-6 text-white text-center">
        <h1 className="text-3xl font-bold mb-2">Chào mừng đến MuaSắm!</h1>
        <p className="mb-4 text-orange-100">Mua sắm thông minh, tiết kiệm tối đa</p>
        <Link to="/products" className="bg-white text-primary font-bold px-6 py-2 rounded-full hover:bg-orange-50 transition">
          Mua sắm ngay
        </Link>
      </div>

      {/* Flash sale banners */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {banners.map((b, i) => (
          <div key={i} className="bg-white rounded-lg p-4 text-center shadow-sm font-semibold text-primary border border-orange-100">
            {b}
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl p-5 mb-6 shadow-sm">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Danh mục sản phẩm</h2>
        <div className="grid grid-cols-6 gap-3">
          {categories.map(cat => (
            <Link key={cat} to={`/products?category=${cat}`}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-orange-50 transition border border-gray-100">
              <span className="text-2xl">{
                cat === 'Thời trang' ? '👕' : cat === 'Giày dép' ? '👟' :
                cat === 'Điện tử' ? '📱' : cat === 'Túi xách' ? '👜' :
                cat === 'Làm đẹp' ? '💄' : '📚'
              }</span>
              <span className="text-xs text-gray-600 text-center">{cat}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-4">
        <Link to="/products" className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-red-600 transition text-lg">
          Xem tất cả sản phẩm →
        </Link>
      </div>
    </div>
  );
}
