// 로그인/회원가입 공용 폼 스타일 (본 프로젝트의 입력/카드 톤을 따름)
export const authFormStyles = `
  .auth-wrap {
    max-width: 380px;
    margin: 40px auto 0;
  }

  .auth-title {
    font: 800 clamp(32px, 6vw, 44px)/1.05 var(--font-sans);
    letter-spacing: -.03em;
    margin: 0 0 6px;
  }

  .auth-title .dot { color: var(--accent); }

  .auth-sub {
    color: var(--muted);
    font: 500 13px/1.5 var(--font-mono);
    margin: 0 0 28px;
  }

  .auth-field { margin-bottom: 16px; }

  .auth-field label {
    display: block;
    font: 700 11px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: .06em;
    color: var(--muted);
    margin-bottom: 8px;
  }

  .auth-field input {
    width: 100%;
    height: 46px;
    padding: 0 14px;
    background: var(--panel);
    border: 1px solid var(--line);
    color: var(--white);
    font: 500 14px/1 var(--font-mono);
    outline: none;
    transition: border-color .18s ease;
  }

  .auth-field input:focus { border-color: var(--accent); }

  .auth-actions { margin-top: 24px; }

  .auth-error {
    margin: 4px 0 18px;
    padding: 12px 14px;
    border: 1px solid #6b2b2b;
    background: #1c1010;
    color: #ff9d9d;
    font: 600 12px/1.4 var(--font-mono);
  }

  .auth-alt {
    margin-top: 22px;
    color: var(--muted);
    font: 500 12px/1.5 var(--font-mono);
  }

  .auth-alt a { color: var(--accent); text-decoration: none; }
`;
