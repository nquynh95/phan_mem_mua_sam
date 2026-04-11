import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/products/${id}`).then(r => setProduct(r.data)).catch(() => toast.error('Không tìm thấy sản phẩm'));
  }, [id]);

  if (!product) return <div className="text-center py-16 text-gray-400">Đang tải...</div>;

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden">
          <img src={product.image || 'https://via.placeholder.com/500'} alt={product.name}
            className="w-full h-full object-contain" />
        </div>
        <div>
          <span className="text-xs bg-orange-100 text-primary px-2 py-1 rounded font-medium">{product.category}</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-3">{product.name}</h1>
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-3xl font-bold text-primary">{product.price?.toLocaleString()}đ</span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-gray-400 line-through text-lg">{product.originalPrice?.toLocaleString()}đ</span>
                <span className="bg-primary text-white text-sm px-2 py-0.5 rounded">-{discount}%</span>
              </>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-4">Còn lại: {product.stock} sản phẩm | Đã bán: {product.sold}</p>
          <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm text-gray-600">Số lượng:</span>
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-full border border-gray-300 hover:border-primary flex items-center justify-center font-bold">−</button>
            <span className="w-10 text-center font-semibold">{quantity}</span>
            <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
              className="w-8 h-8 rounded-full border border-gray-300 hover:border-primary flex items-center justify-center font-bold">+</button>
          </div>

          <div className="flex gap-3">
            <button onClick={() => { addToCart(product, quantity); toast.success('Đã thêm vào giỏ!'); }}
              className="flex-1 border-2 border-primary text-primary py-3 rounded-lg font-semibold hover:bg-orange-50 transition">
              🛒 Thêm vào giỏ
            </button>
            <button onClick={() => { addToCart(product, quantity); navigate('/checkout'); }}
              className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition">
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
