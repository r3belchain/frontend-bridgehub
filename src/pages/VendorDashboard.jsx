import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function VendorDashboard() {
  const [spaces, setSpaces] = useState([]);
  const [amenitiesList, setAmenitiesList] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success',
  });

  const initialFormState = {
    name: '',
    address: '',
    capacity: '',
    pricePerHour: '',
    description: '',
    amenityIds: [],
  };
  const [formData, setFormData] = useState(initialFormState);
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: '', type: 'success' }),
      3000
    );
  };

  // Handle Input 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Checkbox Fasilitas
  const handleCheckboxChange = (amenityId) => {
    setFormData((prev) => {
      const currentIds = prev.amenityIds || [];
      if (currentIds.includes(amenityId)) {
 
        return {
          ...prev,
          amenityIds: currentIds.filter((id) => id !== amenityId),
        };
      } else {
      
        return { ...prev, amenityIds: [...currentIds, amenityId] };
      }
    });
  };

  const openAddModal = () => {
    setFormData(initialFormState);
    setEditId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (space) => {
   
    const existingAmenityIds = space.amenities
      ? space.amenities.map((item) => item.amenity.id || item.amenity._id)
      : [];

    setFormData({
      name: space.name,
      address: space.address,
      capacity: space.capacity,
      pricePerHour: space.pricePerHour,
      description: space.description,
      amenityIds: existingAmenityIds,
    });
    setEditId(space.id || space._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus space ini?')) return;
    try {
      await api.delete(`/spaces/${id}`);
      showToast('Space berhasil dihapus!', 'success');
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      showToast('Gagal menghapus space.', 'error');
    }
  };

  // Load Data Space + Master Amenities
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [spacesRes, amenitiesRes] = await Promise.all([
          api.get('/spaces'),
          api.get('/amenities'),
        ]);

        if (isMounted) {
          setSpaces(spacesRes.data?.results || spacesRes.data || []);
          setAmenitiesList(
            amenitiesRes.data?.results || amenitiesRes.data || []
          );
          setError('');
        }
      } catch (err) {
        if (isMounted) setError('Gagal memuat data dari server.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);


    const payload = {
      ...formData,
      capacity: Number(formData.capacity),
      pricePerHour: Number(formData.pricePerHour),
    };

    try {
      if (editId) {
        await api.patch(`/spaces/${editId}`, payload);
        showToast('Space berhasil diperbarui!', 'success');
      } else {
        await api.post('/spaces', payload);
        showToast('Space baru berhasil ditambahkan!', 'success');
      }
      setFormData(initialFormState);
      setIsModalOpen(false);
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      const errMsg =
        err.response?.data?.message || 'Gagal menyimpan data space.';
      showToast(`Error: ${errMsg}`, 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Vendor</h1>
          <p className="text-sm text-gray-500">
            Kelola tempat coworking space milik Anda
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
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

                  {/* Tampilkan Tag Fasilitas di Card */}
                  {space.amenities && space.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 my-2">
                      {space.amenities.map((item) => (
                        <span
                          key={item.id}
                          className="badge badge-outline text-[10px]"
                        >
                          {item.amenity?.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-gray-600 my-2 line-clamp-2">
                    {space.description}
                  </p>

                  <div className="flex justify-between items-center mt-2">
                    <span className="font-semibold text-primary">
                      Rp{' '}
                      {Number(space.pricePerHour || 0).toLocaleString('id-ID')}{' '}
                      / jam
                    </span>
                    <span className="badge badge-success badge-sm text-white">
                      Aktif
                    </span>
                  </div>

                  <div className="card-actions justify-end mt-4 pt-4 border-t border-base-200 gap-2">
                    <button
                      onClick={() => handleEdit(space)}
                      className="btn btn-sm btn-outline btn-info"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(space.id || space._id)}
                      className="btn btn-sm btn-outline btn-error"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg mb-4">
              {editId ? 'Edit Space' : 'Tambah Space Baru'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nama Space</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="input input-bordered w-full"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Alamat Lengkap</span>
                </label>
                <input
                  type="text"
                  name="address"
                  className="input input-bordered w-full"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Kapasitas</span>
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    className="input input-bordered w-full"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Harga/Jam (Rp)</span>
                  </label>
                  <input
                    type="number"
                    name="pricePerHour"
                    className="input input-bordered w-full"
                    value={formData.pricePerHour}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Cekbox Fasilitas Dinamis */}
              <div className="form-control border border-base-200 p-3 rounded-lg bg-base-50">
                <label className="label pb-1">
                  <span className="label-text font-semibold">
                    Pilih Fasilitas
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {amenitiesList.length === 0 ? (
                    <span className="text-xs text-gray-400">
                      Belum ada data fasilitas dari Admin.
                    </span>
                  ) : (
                    amenitiesList.map((amenity) => (
                      <label
                        key={amenity.id || amenity._id}
                        className="cursor-pointer label justify-start gap-3 p-1"
                      >
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary checkbox-sm"
                          checked={formData.amenityIds.includes(
                            amenity.id || amenity._id
                          )}
                          onChange={() =>
                            handleCheckboxChange(amenity.id || amenity._id)
                          }
                        />
                        <span className="label-text text-sm">
                          {amenity.name}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Deskripsi</span>
                </label>
                <textarea
                  name="description"
                  className="textarea textarea-bordered w-full h-20"
                  value={formData.description}
                  onChange={handleInputChange}
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
                  {submitLoading ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast.show && (
        <div className="toast toast-top toast-end z-[9999]">
          <div
            className={`alert ${toast.type === 'success' ? 'alert-success' : 'alert-error'} text-white shadow-lg`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
