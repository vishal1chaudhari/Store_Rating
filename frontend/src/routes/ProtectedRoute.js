import { Navigate } from 'react-router-dom';
import { getToken, getRole } from '../utils/auth';

const ProtectedRoute = ({ children, role }) => {
  const token = getToken();
  const userRole = getRole();

  if (!token || userRole !== role) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
