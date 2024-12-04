import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../lib/hooks/useAuth';

interface RoleGuardProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireChef?: boolean;
}

export const RoleGuard = ({ children, requireAdmin, requireChef }: RoleGuardProps) => {
  const { roles, loading, error } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <Navigate to="/" />;
  }

  if (requireAdmin && !roles.isAdmin) {
    return <Navigate to="/" />;
  }

  if (requireChef && !roles.isChef) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};
