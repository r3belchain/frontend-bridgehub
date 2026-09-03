import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validasi dasar
    if (password !== confirmPassword) {
      return setError('Password dan Konfirmasi Password tidak cocok!');
    }
    if (password.length < 8) {
      return setError('Password minimal harus 8 karakter.');
    }

    setLoading(true);
    try {
      await api.post(`/auth/reset-password?token=${token}`, { password });

      setMessage('Password berhasil diubah! Mengarahkan ke halaman login...');


      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        'Gagal mereset password. Token mungkin sudah kedaluwarsa.';
      setError(`Error: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 p-4">
        <div className="bg-base-100 p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-4">
          <h1 className="text-2xl font-bold text-error">Token Tidak Valid</h1>
          <p className="text-gray-500">
            Token keamanan tidak ditemukan. Pastikan Anda mengeklik tautan
            langsung dari email Anda.
          </p>
          <Link to="/login" className="btn btn-primary w-full">
            Kembali ke Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="bg-base-100 p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
        <p className="text-gray-500 mb-6 text-sm">
          Silakan masukkan password baru Anda. Pastikan untuk mengingatnya kali
          ini!
        </p>

        {error && <div className="alert alert-error text-sm mb-4">{error}</div>}
        {message && (
          <div className="alert alert-success text-white text-sm mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text font-semibold">Password Baru</span>
            </label>
            <input
              type="password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={loading || message} 
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text font-semibold">
                Konfirmasi Password
              </span>
            </label>
            <input
              type="password"
              className="input input-bordered w-full"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={loading || message}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full mt-2"
            disabled={loading || message}
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              'Simpan Password Baru'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
