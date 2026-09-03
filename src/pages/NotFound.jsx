import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-9xl font-extrabold text-primary">404</h1>
        <h2 className="text-3xl font-bold">Yahhh! Halamannya menghilang</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          URL yang Anda tuju entah dibawa ke mana. 
        </p>
        <Link to="/" className="btn btn-primary text-white mt-4">
         Kembali ke Pelukan Beranda
        </Link>
      </div>
    </div>
  );
}
