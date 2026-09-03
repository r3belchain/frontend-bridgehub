import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';

export default function SpaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);


  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    api
      .get(`/spaces/${id}`)
      .then((res) => {
        setSpace(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);


  const duration = useMemo(() => {
    if (!startTime || !endTime) return 0;
    const startHour = parseInt(startTime.split(':')[0], 10);
    const endHour = parseInt(endTime.split(':')[0], 10);
    return endHour > startHour ? endHour - startHour : 0;
  }, [startTime, endTime]);

  const totalPrice = duration * (space?.pricePerHour || 0);


  const handleBookingSubmit = async (e) => {
    e.preventDefault();


    if (!user) {
      alert('Silakan login sebagai Customer terlebih dahulu untuk memesan.');
      navigate('/login');
      return;
    }

    if (duration <= 0) {
      alert('Jam Selesai harus lebih besar dari Jam Mulai!');
      return;
    }

  
    const combinedStartTime = new Date(`${date}T${startTime}:00`);
    const combinedEndTime = new Date(`${date}T${endTime}:00`);

   
    if (combinedStartTime <= new Date()) {
      alert('Waktu mulai harus di masa depan (lebih dari jam sekarang)!');
      return;
    }

    setBookingLoading(true);
    try {
    
      const payload = {
        spaceId: space.id || space._id,
        startTime: combinedStartTime.toISOString(),
        endTime: combinedEndTime.toISOString(),
      };

      await api.post('/reservations', payload);
      alert('Reservasi Berhasil! Cek menu riwayat pesanan Anda.');

      // Reset form
      setDate('');
      setStartTime('');
      setEndTime('');
    } catch (error) {
    
      const errMsg =
        error.response?.data?.message || 'Terjadi kesalahan saat memesan.';
      alert(`Gagal: ${errMsg}`);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading)
    return <div className="text-center py-20">Memuat detail space...</div>;
  if (!space)
    return (
      <div className="text-center py-20 text-error">Space tidak ditemukan!</div>
    );

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/*  Informasi Space */}
      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-4xl font-bold">{space.name}</h1>
          <p className="text-gray-500 mt-2">📍 {space.address}</p>
        </div>

        <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200">
          <h2 className="text-xl font-semibold mb-2">Deskripsi</h2>
          <p className="text-gray-600 whitespace-pre-wrap">
            {space.description}
          </p>
        </div>

        <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200">
          <h2 className="text-xl font-semibold mb-4">Fasilitas Tersedia</h2>
          <div className="flex flex-wrap gap-2">
            {space.amenities && space.amenities.length > 0 ? (
              space.amenities.map((item) => (
                <span
                  key={item.id}
                  className="badge badge-primary badge-outline p-3"
                >
                  {item.amenity?.name}
                </span>
              ))
            ) : (
              <span className="text-gray-400">Tidak ada info fasilitas.</span>
            )}
          </div>
        </div>
      </div>

      {/* Form Reservasi  */}
      <div className="w-full md:w-[350px]">
        <div className="bg-base-100 p-6 rounded-2xl shadow-md border border-base-200 sticky top-6">
          <h3 className="text-gray-500 text-sm">Harga Sewa</h3>
          <p className="text-3xl font-bold text-primary my-2">
            Rp {Number(space.pricePerHour || 0).toLocaleString('id-ID')}
            <span className="text-sm text-gray-500 font-normal"> / jam</span>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            👥 Kapasitas: {space.capacity} Orang
          </p>

          <div className="divider"></div>

          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Tanggal Reservasi</span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Mulai</span>
                </label>
                <input
                  type="time"
                  className="input input-bordered w-full"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Selesai</span>
                </label>
                <input
                  type="time"
                  className="input input-bordered w-full"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            {duration > 0 && (
              <div className="bg-base-200 p-4 rounded-lg mt-4 text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Durasi:</span>
                  <span className="font-semibold">{duration} Jam</span>
                </div>
                <div className="flex justify-between text-primary text-lg font-bold pt-2 border-t border-gray-300 mt-2">
                  <span>Total:</span>
                  <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full text-white mt-4"
              disabled={bookingLoading}
            >
              {bookingLoading
                ? 'Memproses...'
                : user
                  ? 'Pesan Ruangan Ini'
                  : 'Login untuk Memesan'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
