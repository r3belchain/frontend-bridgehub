import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      
      await api.post('/auth/forgot-password', { email });
      setMessage(
        'Tautan reset password telah dikirim! Silakan periksa Ethereal Email anda.'
      );
      setEmail(''); 
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        'Gagal mengirim email. Pastikan email terdaftar.';
      setError(`Error: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="bg-base-100 p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2">Lupa Password?</h1>
        <p className="text-gray-500 mb-6 text-sm">
          Masukkan email yang terdaftar pada akun Anda. Kami akan mengirimkan
          tautan untuk mereset password (Cek Ethereal Email).
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
              <span className="label-text font-semibold">Alamat Email</span>
            </label>
            <input
              type="email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="nama@email.com"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full mt-2"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              'Kirim Tautan Reset'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm font-semibold text-primary hover:underline"
          >
            &larr; Kembali ke halaman Login
          </Link>
        </div>
      </div>
    </div>
  );
}
