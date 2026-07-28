import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';

/**
 * 본 프로젝트는 페이지마다 <header className="site-header"> 를 복붙하지만,
 * 여기서는 로그인 상태에 따라 메뉴가 달라지므로 공용 컴포넌트로 뺐다.
 */
export default function SiteHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="site-header">
      <Link className="brand" to="/">
        login<span className="dot">.</span>sandbox
      </Link>
      <nav>
        {user ? (
          <>
            <span className="who">@{user.username}</span>
            <Link to="/mypage">MY PAGE</Link>
            <a href="#logout" onClick={(e) => { e.preventDefault(); void handleLogout(); }}>
              LOGOUT
            </a>
          </>
        ) : (
          <>
            <Link to="/login">LOGIN</Link>
            <Link to="/signup">SIGN UP</Link>
          </>
        )}
      </nav>
    </header>
  );
}
