import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminAmenities from './pages/AdminAmenities';
import CustomerReservations from './pages/CustomerReservations';
import Login from './pages/Login';
import Register from './pages/Register';
import SpaceDetail from './pages/SpaceDetail';
import Spaces from './pages/Spaces';
import VendorDashboard from './pages/VendorDashboard';
import VendorReservations from './pages/VendorReservations';
import AdminUsers from './pages/AdminUsers';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import AdminSpaces from './pages/AdminSpaces';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<MainLayout />}>
          <Route path="/spaces" element={<Spaces />} />
          <Route path="/spaces/:id" element={<SpaceDetail />} />

          <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
            <Route
              path="/customer/reservations"
              element={<CustomerReservations />}
            />
          </Route>

          <Route
            element={<ProtectedRoute allowedRoles={['VENDOR', 'ADMIN']} />}
          >
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            <Route
              path="/vendor/reservations"
              element={<VendorReservations />}
            />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/amenities" element={<AdminAmenities />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/spaces" element={<AdminSpaces />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
