import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSpaces: 0,
    totalReservations: 0,
    totalRevenue: 0,
    activeVendors: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardStats = async () => {
      try {
        const res = await api.get('/dashboard');

        if (!isMounted) return;

        setStats(res.data);
        setError('');
      } catch (err) {
        if (isMounted) {
          setError('Gagal memuat data statistik dashboard.');
          console.error('Dashboard error:', err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Sapaan */}
      <div className="bg-primary text-white p-8 rounded-2xl shadow-sm">
        <h1 className="text-3xl font-bold mb-2">Dashboard Admin</h1>
        <p className="opacity-90">
          Haloo {user?.name}. Berikut adalah
          ringkasan sistem hari ini.
        </p>
      </div>

      {loading && (
        <div className="text-center py-10">Memuat statistik satelit...</div>
      )}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && (
        <>
          {/* Kartu Statistik */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="stat bg-base-100 shadow-sm border border-base-200 rounded-2xl">
              <div className="stat-figure text-primary">
              </div>
              <div className="stat-title">Total Pengguna</div>
              <div className="stat-value text-primary">{stats.totalUsers}</div>
              <div className="stat-desc">
                Termasuk {stats.activeVendors} Vendor aktif
              </div>
            </div>

            <div className="stat bg-base-100 shadow-sm border border-base-200 rounded-2xl">
              <div className="stat-figure text-secondary">
                
              </div>
              <div className="stat-title">Ruangan Terdaftar</div>
              <div className="stat-value text-secondary">
                {stats.totalSpaces}
              </div>
              <div className="stat-desc">Di seluruh platform</div>
            </div>

            <div className="stat bg-base-100 shadow-sm border border-base-200 rounded-2xl">
              <div className="stat-figure text-accent">
              
              </div>
              <div className="stat-title">Total Reservasi</div>
              <div className="stat-value text-accent">
                {stats.totalReservations} 
              </div>
              <div className="stat-desc">Semua status tiket</div>
            </div>

            <div className="stat bg-base-100 shadow-sm border border-base-200 rounded-2xl">
              <div className="stat-figure text-success">
              </div>
              <div className="stat-title">Estimasi Perputaran Uang</div>
              <div className="stat-value text-success text-2xl">
                Rp {stats.totalRevenue.toLocaleString('id-ID')}
              </div>
              <div className="stat-desc">Dari pesanan disetujui</div>
            </div>
          </div>

          {/* Quick Access Menu */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Link
              to="/admin/users"
              className="card bg-base-100 shadow-sm border border-base-200 hover:border-primary transition-colors cursor-pointer"
            >
              <div className="card-body py-6">
                <h2 className="card-title">Manajemen Pengguna</h2>
                <p className="text-sm text-gray-500">
                  Awasi dan hapus akun yang bermasalah.
                </p>
              </div>
            </Link>

            <Link
              to="/admin/spaces"
              className="card bg-base-100 shadow-sm border border-base-200 hover:border-primary transition-colors cursor-pointer"
            >
              <div className="card-body py-6">
                <h2 className="card-title">Moderasi Ruangan</h2>
                <p className="text-sm text-gray-500">
                  Take-down ruangan yang melanggar standar platform.
                </p>
              </div>
            </Link>

            <Link
              to="/admin/amenities"
              className="card bg-base-100 shadow-sm border border-base-200 hover:border-primary transition-colors cursor-pointer"
            >
              <div className="card-body py-6">
                <h2 className="card-title">Master Fasilitas</h2>
                <p className="text-sm text-gray-500">
                  Kelola tag fasilitas yang bisa dipilih oleh Vendor.
                </p>
              </div>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
