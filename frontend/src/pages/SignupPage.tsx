import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../shared/components/Button';
import SiteHeader from '../shared/components/SiteHeader';
import { buttonStyles } from '../shared/components/Button.style';
import { globalStyles } from '../shared/styles/tokens';
import { authFormStyles } from './authForm.style';
import { useAuth } from '../features/auth/AuthContext';
import { register } from '../features/auth/api';
import { ApiError } from '../shared/api/apiClient';

export default function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register({ username, password });
      // 가입 직후 바로 로그인시켜 세션을 발급받는다.
      await login({ username, password });
      navigate('/mypage', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '회원가입에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <style>{globalStyles + buttonStyles + authFormStyles}</style>
      <SiteHeader />

      <div className="auth-wrap">
        <h1 className="auth-title">SIGN UP<span className="dot">.</span></h1>
        <p className="auth-sub">사용자명 3~30자 / 비밀번호 8자 이상</p>

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
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="auth-actions">
            <Button type="submit" fullWidth disabled={submitting}>
              {submitting ? '가입 중…' : 'CREATE ACCOUNT'}
            </Button>
          </div>
        </form>

        <p className="auth-alt">
          이미 계정이 있나요? <Link to="/login">로그인 →</Link>
        </p>
      </div>
    </div>
  );
}
