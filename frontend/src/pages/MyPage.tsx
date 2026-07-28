import { useEffect, useState } from 'react';
import SiteHeader from '../shared/components/SiteHeader';
import Button from '../shared/components/Button';
import { buttonStyles } from '../shared/components/Button.style';
import { globalStyles } from '../shared/styles/tokens';
import { homePageStyles } from './HomePage.style';
import { useAuth } from '../features/auth/AuthContext';
import { getMyAttempts, getProblems } from '../features/auth/api';
import type { Attempt } from '../features/auth/types';

export default function MyPage() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [titles, setTitles] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const [myAttempts, problems] = await Promise.all([getMyAttempts(), getProblems()]);
      setAttempts(myAttempts);
      setTitles(new Map(problems.map((p) => [p.id, p.title])));
      setLoading(false);
    })();
  }, []);

  return (
    <div className="page">
      <style>{globalStyles + buttonStyles + homePageStyles}</style>
      <SiteHeader />

      <section className="hero">
        <h1>MY <span className="accent">PAGE</span></h1>
        <p>@{user?.username} 님이 푼 문제 기록입니다. (본인 것만 조회됩니다)</p>
      </section>

      <div className="section-label">// 내가 푼 문제 ({attempts.length})</div>

      {loading ? (
        <p className="hint">불러오는 중…</p>
      ) : attempts.length === 0 ? (
        <p className="hint">
          아직 푼 문제가 없습니다. <a href="/">홈에서 문제를 풀어보세요 →</a>
        </p>
      ) : (
        attempts.map((attempt) => (
          <div className="problem-row" key={attempt.id}>
            <div className="meta">
              <span className="id">{String(attempt.problemId).padStart(2, '0')}</span>
              <span className="title">{titles.get(attempt.problemId) ?? `문제 #${attempt.problemId}`}</span>
            </div>
            <span className="solved">
              {new Date(attempt.solvedAt).toLocaleString('ko-KR')}
            </span>
          </div>
        ))
      )}

      <div style={{ marginTop: 32 }}>
        <Button to="/" variant="ghost">← 홈으로</Button>
      </div>
    </div>
  );
}
