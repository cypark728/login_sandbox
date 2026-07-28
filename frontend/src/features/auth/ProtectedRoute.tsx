import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';

/**
 * 보호 라우트. 로그인 안 됐으면 /login 으로 보내고, 로그인 후 원래 위치로 복귀시킨다.
 * 초기 GET /me 확인이 끝나기 전(loading)에는 판단을 보류한다.
 */
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="page"><p style={{ color: 'var(--muted)' }}>확인 중…</p></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
