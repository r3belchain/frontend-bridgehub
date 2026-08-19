import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VendorDashboard from './pages/VendorDashboard';
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'VENDOR', 'ADMIN']} />
          }
        >
          <Route element={<MainLayout />}>
            <Route
              path="/spaces"
              element={
                <div className="card bg-base-100 shadow-xl p-6">
                  <h1 className="text-2xl font-bold">Katalog Space</h1>
                  <p className="mt-2 text-gray-600">
                    Daftar tempat coworking space akan dimuat di sini.
                  </p>
                </div>
              }
            />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['VENDOR', 'ADMIN']} />}>
          <Route element={<MainLayout />}>
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
