import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Mật khẩu xác nhận không khớp');
    if (form.password.length < 6) return toast.error('Mật khẩu tối thiểu 6 ký tự');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Đăng ký thành công! Chào mừng bạn!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">Đăng ký tài khoản</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Họ và tên', key: 'name', type: 'text', placeholder: 'Nguyễn Văn A' },
            { label: 'Email', key: 'email', type: 'email', placeholder: 'email@example.com' },
            { label: 'Mật khẩu', key: 'password', type: 'password', placeholder: 'Tối thiểu 6 ký tự' },
            { label: 'Xác nhận mật khẩu', key: 'confirm', type: 'password', placeholder: 'Nhập lại mật khẩu' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type={type} required value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={placeholder} />
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50">
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Đã có tài khoản? <Link to="/login" className="text-primary font-semibold hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
