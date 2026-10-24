import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BrowseVehicles from './pages/BrowseVehicles';
import VehicleDetail from './pages/VehicleDetail';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ListVehicle from './pages/ListVehicle';
import BookingConfirmation from './pages/BookingConfirmation';
import RequireAuth from './pages/RequireAuth';
import { AuthProvider } from './AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vehicles" element={<BrowseVehicles />} />
          <Route path="/vehicles/:id" element={<VehicleDetail />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/list-vehicle" element={<RequireAuth roles={['owner']}><ListVehicle /></RequireAuth>} />
          <Route path="/booking/:id" element={<RequireAuth><BookingConfirmation /></RequireAuth>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
