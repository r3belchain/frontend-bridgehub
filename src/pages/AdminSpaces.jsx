import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function AdminSpaces() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchSpaces = async () => {
      try {
        const res = await api.get('/spaces');

        if (isMounted) {
          const rawData = res.data;
          setSpaces(rawData);
          setError('');
        }
      } catch (err) {
        if (isMounted) {
          setError('Gagal memuat data space.');
          console.error('Error fetching spaces:', err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSpaces();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  
  const handleDeleteSpace = async (id, name) => {
    if (
      !window.confirm(
        `TAKE DOWN: Anda yakin ingin menghapus paksa space "${name}"? Tindakan ini tidak bisa dibatalkan.`
      )
    ) {
      return;
    }

    try {
      await api.delete(`/spaces/${id}`);
      alert(`Space "${name}" berhasil dihapus dari sistem!`);
      setRefreshKey((prev) => prev + 1); 
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Gagal menghapus space.';
      alert(`Error: ${errMsg}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200">
        <h1 className="text-2xl font-bold text-error">
          Moderasi Space
        </h1>
        <p className="text-gray-500 mt-1">
          Pantau seluruh Coworking Space dari semua Vendor.
        </p>
      </div>

      {loading && (
        <div className="text-center py-10">Memuat data ruangan...</div>
      )}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && (
        <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-200 text-sm">
              <tr>
                <th>No</th>
                <th>Nama Ruangan</th>
                <th>Pemilik (Vendor)</th>
                <th>Harga / Jam</th>
                <th className="text-center">Aksi Moderasi</th>
              </tr>
            </thead>
            <tbody>
              {spaces.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-500">
                    Belum ada space yang terdaftar di platform ini.
                  </td>
                </tr>
              ) : (
                spaces.map((space, index) => (
                  <tr key={space.id || space._id} className="hover">
                    <td className="text-gray-500">{index + 1}</td>
                    <td>
                      <p className="font-semibold">{space.name}</p>
                      <p
                        className="text-xs text-gray-500 truncate max-w-[200px]"
                        title={space.address}
                      >
                        {space.address}
                      </p>
                    </td>
                    <td>
                      <span className="badge badge-primary badge-outline text-xs">
                        {space.vendor?.name || 'Vendor Tidak Diketahui'}
                      </span>
                    </td>
                    <td className="font-bold text-success">
                      Rp{' '}
                      {Number(space.pricePerHour || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="text-center space-x-2">
                      
                      <Link
                        to={`/spaces/${space.id || space._id}`}
                        className="btn btn-sm btn-ghost"
                        target="_blank" 
                      >
                        Lihat
                      </Link>
                 
                      <button
                        onClick={() =>
                          handleDeleteSpace(space.id || space._id, space.name)
                        }
                        className="btn btn-sm btn-outline btn-error"
                      >
                        Take Down
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
