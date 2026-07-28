/**
 * 전역 디자인 토큰 + 리셋 + 공통 헤더.
 * 본 프로젝트는 :root 변수를 HomePage.style.ts 에 뒀지만, 여기서는
 * "홈을 거치지 않고 진입해도 변수가 살아있도록" 공용 파일로 분리해 모든 페이지에서 주입한다.
 * (스타일 규약 자체 — 문자열 + <style> 주입 — 는 본 프로젝트와 동일)
 */
export const globalStyles = `
  :root {
    --accent: #d6ff50;
    --black: #090909;
    --panel: #171717;
    --line: #343434;
    --white: #f5f5ef;
    --muted: #a3a3a3;
    --font-sans: Arial, "Noto Sans KR", sans-serif;
    --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  }

  * { box-sizing: border-box; }

  body {
    margin: 0;
    background: var(--black);
    color: var(--white);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }

  a { color: inherit; }

  .page {
    min-height: 100vh;
    max-width: 960px;
    margin: 0 auto;
    padding: 0 24px 80px;
  }

  .site-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 0;
    border-bottom: 1px solid var(--line);
    margin-bottom: 40px;
  }

  .site-header .brand {
    font: 800 15px/1 var(--font-mono);
    letter-spacing: -.02em;
    text-decoration: none;
    color: var(--white);
  }

  .site-header .brand .dot { color: var(--accent); }

  .site-header nav {
    display: flex;
    gap: 18px;
    align-items: center;
    font: 700 12px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: .02em;
  }

  .site-header nav a { text-decoration: none; color: var(--muted); }
  .site-header nav a:hover { color: var(--accent); }
  .site-header nav .who { color: var(--white); }
`;
