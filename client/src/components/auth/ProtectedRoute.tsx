import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          className="animate-spin"
          style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--color-border-light)', borderTopColor: 'var(--color-brand)' }}
        />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
