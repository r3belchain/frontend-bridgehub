import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function VendorDashboard() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [capacity, setCapacity] = useState('');
  const [pricePerHour, setPricePerHour] = useState('');
  const [description, setDescription] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  // Load Data Space milik Vendor
  const fetchVendorSpaces = async () => {
    try {
      setLoading(true);
      const res = await api.get('/spaces');
      setSpaces(res.data?.results || res.data || []);
    } catch (err) {
      setError('Gagal memuat daftar space.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorSpaces();
  }, []);

  // Handle Submit Tambah Space Baru
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      await api.post('/spaces', {
        name,
        address,
        capacity: Number(capacity),
        pricePerHour: Number(pricePerHour),
        description,
      });

      
      setName('');
      setAddress('');
      setCapacity('');
      setPricePerHour('');
      setDescription('');
      setIsModalOpen(false);
      fetchVendorSpaces();
    } catch (err) {
      const errMsg =
        err.response?.data?.message || 'Gagal menambahkan space baru.';
      alert(`Error: ${errMsg}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Vendor</h1>
          <p className="text-sm text-gray-500">
            Kelola tempat coworking space milik Anda
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary text-white"
        >
          + Tambah Space Baru
        </button>
      </div>

    
      {loading && <div className="text-center py-8">Memuat data...</div>}
      {error && <div className="alert alert-error text-sm mb-4">{error}</div>}

    
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-base-100 rounded-2xl border border-dashed">
              <p className="text-gray-500">Belum ada space yang didaftarkan.</p>
            </div>
          ) : (
            spaces.map((space) => (
              <div
                key={space.id || space._id}
                className="card bg-base-100 shadow-md border border-base-200"
              >
                <div className="card-body">
                  <h2 className="card-title text-lg font-bold">{space.name}</h2>
                  <p className="text-xs text-gray-500">📍 {space.address}</p>
                  <p className="text-xs text-gray-500">
                    👥 Kapasitas: {space.capacity} orang
                  </p>
                  <p className="text-sm text-gray-600 my-2 line-clamp-2">
                    {space.description}
                  </p>
                  <div className="card-actions justify-between items-center mt-4 pt-4 border-t border-base-200">
                    <span className="font-semibold text-primary">
                      Rp{' '}
                      {Number(space.pricePerHour || 0).toLocaleString('id-ID')}{' '}
                      / jam
                    </span>
                    <span className="badge badge-success badge-sm text-white">
                      Aktif
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

  
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md">
            <h3 className="font-bold text-lg mb-4">Tambah Space Baru</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nama Space</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Contoh: Digital Hub Room A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Alamat Lengkap</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Contoh: Jl. Sudirman No. 12, Jakarta"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Kapasitas (Orang)</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  placeholder="10"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Harga Per Jam (Rp)</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  placeholder="50000"
                  value={pricePerHour}
                  onChange={(e) => setPricePerHour(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Deskripsi</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-24"
                  placeholder="Fasilitas AC, Wi-Fi High Speed, Proyektor..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-white"
                  disabled={submitLoading}
                >
                  {submitLoading ? 'Menyimpan...' : 'Simpan Space'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
