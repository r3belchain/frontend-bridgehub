import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await register({ name, email, password, role });
      if (user && user.role === "VENDOR") {
        navigate("/vendor/dashboard");
      } else {
        navigate("/spaces");
      }
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Pendaftaran gagal. Pastikan data terisi dengan benar.";
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
            Daftar Bridge Hub
          </h2>
          <p className="text-center text-sm text-gray-500 mb-6">
            Buat akun baru untuk mulai beraktivitas
          </p>

          {error && (
            <div className="alert alert-error text-sm py-2 mb-4 rounded-lg">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Nama Lengkap</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="input input-bordered w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
              </label>
              <input
                type="password"
                placeholder="Minimal 8 karakter"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Tipe Akun</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="CUSTOMER">Customer (Penyewa Space)</option>
                <option value="VENDOR">Vendor (Penyedia Space)</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-6"
              disabled={loading}
            >
              {loading ? "Mendaftar..." : "Daftar Sekarang"}
            </button>
          </form>

          <div className="divider my-4">ATAU</div>

          <p className="text-center text-sm">
            Sudah punya akun?{" "}
            <Link to="/login" className="link link-primary font-semibold">
              Masuk Di Sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
