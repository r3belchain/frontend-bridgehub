import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function VendorReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load Data
  const fetchReservations = async () => {
    try {
      const res = await api.get('/reservations');
      setReservations(res.data?.results || res.data || []);
      setError('');
    } catch (err) {
      setError('Gagal memuat daftar pesanan.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchReservations = async () => {
      try {
        const res = await api.get('/reservations');
        if (isMounted) {
          setReservations(res.data?.results || res.data || []);
          setError('');
        }
      } catch (err) {
        if (isMounted) {
          setError('Gagal memuat daftar pesanan.');
          console.error(err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchReservations();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  // Format Tanggal
  const formatDateTime = (isoString) => {
    return new Date(isoString).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Badge Status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="badge badge-warning badge-sm text-white">
            Menunggu
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="badge badge-success badge-sm text-white">
            Disetujui
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="badge badge-error badge-sm text-white">
            Ditolak/Batal
          </span>
        );
      default:
        return <span className="badge badge-ghost badge-sm">{status}</span>;
    }
  };

  // Fungsi Approve / Reject
  const handleUpdateStatus = async (id, newStatus) => {
    const isConfirm = newStatus === 'CONFIRMED';
    const actionText = isConfirm ? 'menyetujui' : 'menolak';

    if (!window.confirm(`Apakah Anda yakin ingin ${actionText} pesanan ini?`))
      return;

    setActionLoading(id);
    try {
      // CATATAN ARSITEK: Sesuaikan URL ini jika di backend-mu route-nya berbeda
      // Contoh lain: api.patch(`/reservations/${id}/status`, { status: newStatus })
      await api.patch(`/reservations/${id}/status`, { status: newStatus });

      alert(`Pesanan berhasil ${isConfirm ? 'disetujui' : 'ditolak'}!`);
      fetchReservations(); // Refresh data setelah update
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        'Terjadi kesalahan saat mengupdate status.';
      alert(`Gagal: ${errMsg}`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200">
        <h1 className="text-2xl font-bold">Kelola Pesanan Masuk</h1>
        <p className="text-gray-500 mt-1">
          Setujui atau tolak permintaan reservasi dari Customer.
        </p>
      </div>

      {loading && <div className="text-center py-10">Memuat pesanan...</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && (
        <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-200 text-sm">
              <tr>
                <th>Tanggal Order</th>
                <th>Pemesan</th>
                <th>Ruangan</th>
                <th>Jadwal Sewa</th>
                <th>Total (Rp)</th>
                <th>Status</th>
                <th className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">
                    Belum ada pesanan masuk.
                  </td>
                </tr>
              ) : (
                reservations.map((resv) => (
                  <tr key={resv.id || resv._id} className="hover">
                    <td className="text-xs text-gray-500">
                      {new Date(resv.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td>
                      <p className="font-semibold">
                        {resv.customer?.name || 'User Anonim'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {resv.customer?.email}
                      </p>
                    </td>
                    <td className="font-semibold text-primary">
                      {resv.space?.name}
                    </td>
                    <td className="text-xs">
                      <p>Mulai: {formatDateTime(resv.startTime)}</p>
                      <p>Selesai: {formatDateTime(resv.endTime)}</p>
                    </td>
                    <td className="font-bold">
                      {Number(resv.totalPrice || 0).toLocaleString('id-ID')}
                    </td>
                    <td>{getStatusBadge(resv.status)}</td>
                    <td className="text-center space-x-2">
                      {/* Tombol Aksi HANYA muncul jika statusnya PENDING */}
                      {resv.status === 'PENDING' ? (
                        <>
                          <button
                            onClick={() =>
                              handleUpdateStatus(
                                resv.id || resv._id,
                                'CONFIRMED'
                              )
                            }
                            disabled={actionLoading === (resv.id || resv._id)}
                            className="btn btn-sm btn-success text-white"
                          >
                            Terima
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(
                                resv.id || resv._id,
                                'CANCELLED'
                              )
                            }
                            disabled={actionLoading === (resv.id || resv._id)}
                            className="btn btn-sm btn-error text-white"
                          >
                            Tolak
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          Selesai
                        </span>
                      )}
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
