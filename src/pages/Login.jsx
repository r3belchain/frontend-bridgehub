import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user && user.role === "VENDOR") {
        navigate("/vendor/dashboard");
      } else {
        navigate("/spaces");
      }
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Login gagal. Periksa kembali email dan password Anda.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center justify-center mb-2">
            Bridge Hub
          </h2>
          <p className="text-center text-sm text-gray-500 mb-6">
            Masuk ke akun Coworking Space Anda
          </p>

          {error && (
            <div className="alert alert-error text-sm py-2 mb-4 rounded-lg">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                type="email"
                placeholder="nama@email.com"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
                <Link
                  to="/forgot-password"
                  className="label-text-alt link link-hover text-primary"
                >
                  Lupa password?
                </Link>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-6"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <div className="divider my-4">ATAU</div>

          <p className="text-center text-sm">
            Belum punya akun?{' '}
            <Link to="/register" className="link link-primary font-semibold">
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
