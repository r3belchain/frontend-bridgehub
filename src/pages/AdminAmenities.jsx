import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function AdminAmenities() {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // State Form
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success',
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: '', type: 'success' }),
      3000
    );
  };

  // Fetch Data Amenities
  useEffect(() => {
    let isMounted = true;
    api
      .get('/amenities')
      .then((res) => {
        if (isMounted) {
          setAmenities(res.data?.results || res.data || []);
          setError('');
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Gagal memuat data fasilitas.');
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  // Modal Add
  const openAddModal = () => {
    setName('');
    setEditId(null);
    setIsModalOpen(true);
  };

  // Modal Edit
  const handleEdit = (amenity) => {
    setName(amenity.name);
    setEditId(amenity.id || amenity._id);
    setIsModalOpen(true);
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      if (editId) {
        await api.patch(`/amenities/${editId}`, { name });
        showToast('Fasilitas berhasil diperbarui!', 'success');
      } else {
        await api.post('/amenities', { name });
        showToast('Fasilitas baru berhasil ditambahkan!', 'success');
      }
      setName('');
      setIsModalOpen(false);
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      showToast('Gagal menyimpan fasilitas.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Delete Data
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        'Hapus fasilitas ini? Semua space yang memakai fasilitas ini mungkin akan terpengaruh.'
      )
    )
      return;
    try {
      await api.delete(`/amenities/${id}`);
      showToast('Fasilitas berhasil dihapus!', 'success');
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      showToast('Gagal menghapus fasilitas.', 'error');
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-base-100 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">Master Amenities</h1>
          <p className="text-sm text-gray-500">
            Kelola daftar fasilitas untuk semua Coworking Space
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="btn btn-primary text-white mt-4 sm:mt-0"
        >
          + Tambah Fasilitas
        </button>
      </div>


      {loading && <div className="text-center py-8">Memuat data...</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && (
        <div className="bg-base-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="tablew-full">
            <thead className="bg-base-200">
              <tr>
                <th>ID</th>
                <th>Nama Fasilitas</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {amenities.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-8 text-gray-500">
                    Belum ada data fasilitas.
                  </td>
                </tr>
              ) : (
                amenities.map((item, index) => (
                  <tr key={item.id || item._id} className="hover">
                    <td>{index + 1}</td>
                    <td className="font-semibold">{item.name}</td>
                    <td className="text-right space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="btn btn-sm btn-info btn-outline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id || item._id)}
                        className="btn btn-sm btn-error btn-outline"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              {editId ? 'Edit Fasilitas' : 'Tambah Fasilitas'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text">Nama Fasilitas</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Wi-Fi 100Mbps, AC, Proyektor"
                  required
                />
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
                  {submitLoading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="toast toast-top toast-end z-[9999]">
          <div
            className={`alert ${toast.type === 'success' ? 'alert-success' : 'alert-error'} text-white`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
