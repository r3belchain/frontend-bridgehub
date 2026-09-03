import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';

export default function CustomerReservations() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchReservations = async () => {
      try {
        const res = await api.get('/reservations');
        if (isMounted) {
          setReservations(res.data?.results || res.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError('Gagal memuat riwayat pesanan Anda.');
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
  }, []);


  const formatDateTime = (isoString) => {
    const dateObj = new Date(isoString);
    return dateObj.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };


  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="badge badge-warning text-white">
            Menunggu Konfirmasi
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="badge badge-success text-white">Disetujui</span>
        );
      case 'CANCELLED':
        return <span className="badge badge-error text-white">Dibatalkan</span>;
      default:
        return <span className="badge badge-ghost">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200">
        <h1 className="text-2xl font-bold">Riwayat Pesanan Saya</h1>
        <p className="text-gray-500 mt-1">
          Halo {user?.name}, pantau status reservasi ruanganmu di sini.
        </p>
      </div>

      {loading && (
        <div className="text-center py-10">Memuat riwayat pesanan...</div>
      )}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4">
          {reservations.length === 0 ? (
            <div className="text-center py-16 bg-base-100 rounded-2xl border border-dashed text-gray-500">
              <p>Anda belum pernah melakukan reservasi.</p>
              <Link
                to="/spaces"
                className="btn btn-primary btn-sm mt-4 text-white"
              >
                Cari Ruangan Sekarang
              </Link>
            </div>
          ) : (
            reservations.map((resv) => (
              <div
                key={resv.id || resv._id}
                className="card bg-base-100 shadow-sm border border-base-200"
              >
                <div className="card-body p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  {/* Info Ruangan & Waktu */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h2 className="card-title text-xl">
                        {resv.space?.name || 'Ruangan Dihapus'}
                      </h2>
                      {getStatusBadge(resv.status)}
                    </div>
                    <p className="text-sm text-gray-500 font-medium">
                      Penyedia:{' '}
                      {resv.space?.vendor?.name || 'Vendor Tidak Diketahui'}
                    </p>

                    <div className="bg-base-200 p-3 rounded-lg mt-2 inline-block">
                      <p className="text-xs text-gray-600 mb-1">
                        Jadwal Mulai:
                      </p>
                      <p className="font-semibold text-sm">
                        {formatDateTime(resv.startTime)}
                      </p>
                      <p className="text-xs text-gray-600 mt-2 mb-1">
                        Jadwal Selesai:
                      </p>
                      <p className="font-semibold text-sm">
                        {formatDateTime(resv.endTime)}
                      </p>
                    </div>
                  </div>

                  {/* Info Harga & Aksi */}
                  <div className="text-left md:text-right w-full md:w-auto">
                    <p className="text-sm text-gray-500">Total Pembayaran</p>
                    <p className="text-2xl font-bold text-primary mb-2">
                      Rp {Number(resv.totalPrice || 0).toLocaleString('id-ID')}
                    </p>

  
                    {resv.space && (
                      <Link
                        to={`/spaces/${resv.space.id || resv.space._id}`}
                        className="btn btn-sm w-full md:w-auto"
                      >
                        Lihat Kembali Ruangan
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
