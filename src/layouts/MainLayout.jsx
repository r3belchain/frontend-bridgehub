import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <Navbar />
      <main className="flex-1 p-4 md:p-8 container mx-auto max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
}
