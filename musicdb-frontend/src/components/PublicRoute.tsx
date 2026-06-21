import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '@/services/auth.service';

export default function PublicRoute() {
  if (authService.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
