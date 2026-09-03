import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');

        if (isMounted) {
          const rawData = res.data?.data;
          setUsers(rawData);
          setError('');
        }
      } catch (err) {
        if (isMounted) {
          setError('Gagal memuat data pengguna.');
          console.error('Error fetching users:', err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  // Fungsi Hapus 
  const handleDeleteUser = async (id, role) => {
    if (role === 'ADMIN') {
      alert('Anda tidak bisa menghapus sesama Admin dari panel ini.');
      return;
    }

    if (
      !window.confirm(
        'PERINGATAN BAHAYA: Yakin ingin menghapus user ini secara permanen? Semua data terkait (space/reservasi) mungkin akan ikut terhapus atau error.'
      )
    ) {
      return;
    }

    try {
      await api.delete(`/users/${id}`);
      alert('User berhasil dihapus!');
      setRefreshKey((prev) => prev + 1); 
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Gagal menghapus user.';
      alert(`Error: ${errMsg}`);
    }
  };

  // Pewarnaan Badge Role
  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="badge badge-error text-white font-bold">ADMIN</span>
        );
      case 'VENDOR':
        return <span className="badge badge-primary text-white">VENDOR</span>;
      case 'CUSTOMER':
        return <span className="badge badge-success text-white">CUSTOMER</span>;
      default:
        return <span className="badge badge-ghost">{role}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200">
        <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
        <p className="text-gray-500 mt-1">
          Awasi dan kelola seluruh entitas di dalam platform Bridge Hub.
        </p>
      </div>

      {loading && (
        <div className="text-center py-10">Memuat data pengguna...</div>
      )}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && (
        <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-200 text-sm">
              <tr>
                <th>No</th>
                <th>Nama Pengguna</th>
                <th>Email</th>
                <th>Role</th>
                <th className="text-center">Aksi Moderasi</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-500">
                    Belum ada data pengguna.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user.id || user._id} className="hover">
                    <td className="text-gray-500">{index + 1}</td>
                    <td className="font-semibold">{user.name}</td>
                    <td>{user.email}</td>
                    <td>{getRoleBadge(user.role)}</td>
                    <td className="text-center">
                      <button
                        onClick={() =>
                          handleDeleteUser(user.id || user._id, user.role)
                        }
                        className={`btn btn-sm btn-outline btn-error ${user.role === 'ADMIN' ? 'btn-disabled opacity-50' : ''}`}
                      >
                        Hapus Akun
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
