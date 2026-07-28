import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../shared/components/Button';
import SiteHeader from '../shared/components/SiteHeader';
import { buttonStyles } from '../shared/components/Button.style';
import { globalStyles } from '../shared/styles/tokens';
import { authFormStyles } from './authForm.style';
import { useAuth } from '../features/auth/AuthContext';
import { ApiError } from '../shared/api/apiClient';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/mypage';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login({ username, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '로그인에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <style>{globalStyles + buttonStyles + authFormStyles}</style>
      <SiteHeader />

      <div className="auth-wrap">
        <h1 className="auth-title">LOG IN<span className="dot">.</span></h1>
        <p className="auth-sub">세션 + 쿠키 기반 로그인 연습</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              value={username}
              autoComplete="username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="auth-actions">
            <Button type="submit" fullWidth disabled={submitting}>
              {submitting ? '로그인 중…' : 'LOG IN'}
            </Button>
          </div>
        </form>

        <p className="auth-alt">
          계정이 없나요? <Link to="/signup">회원가입 →</Link>
        </p>
      </div>
    </div>
  );
}
