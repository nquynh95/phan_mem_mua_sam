import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const categories = ['Tất cả', 'Thời trang', 'Giày dép', 'Điện tử', 'Túi xách', 'Làm đẹp', 'Sách'];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (category && category !== 'Tất cả') params.category = category;
        const { data } = await api.get('/products', { params });
        setProducts(data.products || []);
      } catch {
        toast.error('Không thể tải sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, category]);

  return (
    <div>
      {/* Filter bar */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button key={cat}
            onClick={() => setSearchParams(cat === 'Tất cả' ? {} : { category: cat })}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              (cat === 'Tất cả' && !category) || category === cat
                ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-orange-50'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {search && <p className="text-gray-500 mb-3 text-sm">Kết quả tìm kiếm: "<strong>{search}</strong>"</p>}

      {loading ? (
        <div className="text-center py-16 text-gray-400">Đang tải sản phẩm...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Không tìm thấy sản phẩm nào</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {products.map(p => (
            <div key={p._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group">
              <Link to={`/products/${p._id}`}>
                <div className="aspect-square overflow-hidden bg-gray-50">
                  <img src={p.image || 'https://via.placeholder.com/300'} alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition" />
                </div>
                <div className="p-3">
                  <p className="text-sm text-gray-800 line-clamp-2 mb-1 font-medium">{p.name}</p>
                  <p className="text-primary font-bold">{p.price?.toLocaleString()}đ</p>
                  {p.originalPrice && p.originalPrice > p.price && (
                    <p className="text-xs text-gray-400 line-through">{p.originalPrice?.toLocaleString()}đ</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">Đã bán {p.sold || 0}</p>
                </div>
              </Link>
              <div className="px-3 pb-3">
                <button onClick={() => { addToCart(p); toast.success('Đã thêm vào giỏ!'); }}
                  className="w-full bg-primary text-white text-sm py-1.5 rounded-lg hover:bg-red-600 transition">
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
