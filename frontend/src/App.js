import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import AllStores from './pages/AllStores';
import SearchStores from './pages/SearchStores';
import UpdatePassword from './pages/UpdatePassword';
import OwnerDashboard from './pages/OwnerDashboard';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        
        <Route
          path="/admin"
          element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>}
        />
        <Route
          path="/user"
          element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>}
        />
        <Route
          path="/owner"
          element={<ProtectedRoute role="store_owner"><OwnerDashboard /></ProtectedRoute>}
        />

        <Route path="/all-stores" element={<AllStores />} />
        <Route path="/search-stores" element={<SearchStores />} />
        <Route path="/update-password" element={<UpdatePassword />} />

        
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
