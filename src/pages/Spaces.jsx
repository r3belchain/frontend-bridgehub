import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Spaces() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    name: '',
    minPrice: '',
    minCapacity: '',
  });

  const fetchSpaces = async (filterParams = {}) => {
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(filterParams).filter(([_, v]) => v !== '')
      );

      const queryString = new URLSearchParams(cleanParams).toString();
      const url = queryString ? `/spaces?${queryString}` : '/spaces';

      const res = await api.get(url);
      setSpaces(res.data?.results || res.data || []);
    } catch (error) {
      console.error('Gagal memuat katalog:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadInitialSpaces = async () => {
      try {
        const res = await api.get('/spaces');
        if (isMounted) {
          setSpaces(res.data?.results || res.data || []);
        }
      } catch (error) {
        console.error('Gagal memuat katalog:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadInitialSpaces();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchSpaces(filters);
  };

  return (
    <div className="space-y-6">
      <div className="bg-primary text-white p-8 rounded-2xl shadow-sm text-center">
        <h1 className="text-3xl font-bold mb-2">Temukan Ruang Kerja Idealmu</h1>
        <p className="mb-6 opacity-80">
          Jelajahi berbagai pilihan Coworking Space terbaik di Surabaya
        </p>

        <form
          onSubmit={handleSearch}
          className="flex justify-center gap-2 max-w-md mx-auto"
        >
          <input
            type="text"
            placeholder="Cari nama space..."
            className="input input-bordered w-full text-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-neutral">
            Cari
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-10">Memuat katalog...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              Tidak ada space yang ditemukan.
            </div>
          ) : (
            spaces.map((space) => (
              <div
                key={space.id || space._id}
                className="card bg-base-100 shadow-md border border-base-200"
              >
                <div className="card-body">
                  <h2 className="card-title">{space.name}</h2>
                  <p className="text-xs text-gray-500 mb-2">
                    📍 {space.address}
                  </p>

                  {space.amenities && space.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {space.amenities.slice(0, 3).map((item) => (
                        <span
                          key={item.id}
                          className="badge badge-outline text-[10px]"
                        >
                          {item.amenity?.name}
                        </span>
                      ))}
                      {space.amenities.length > 3 && (
                        <span className="text-[10px] text-gray-400">
                          +{space.amenities.length - 3} lagi
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-end mt-4">
                    <div>
                      <p className="text-sm text-gray-500">Mulai dari</p>
                      <span className="font-bold text-primary">
                        Rp{' '}
                        {Number(space.pricePerHour || 0).toLocaleString(
                          'id-ID'
                        )}{' '}
                        / jam
                      </span>
                    </div>
                    <Link
                      to={`/spaces/${space.id || space._id}`}
                      className="btn btn-primary btn-sm text-white"
                    >
                      Lihat Detail
                    </Link>
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
