import { useEffect, useState } from 'react';
import Button from '../shared/components/Button';
import SiteHeader from '../shared/components/SiteHeader';
import { buttonStyles } from '../shared/components/Button.style';
import { globalStyles } from '../shared/styles/tokens';
import { homePageStyles } from './HomePage.style';
import { useAuth } from '../features/auth/AuthContext';
import { getMyAttempts, getProblems, solveProblem } from '../features/auth/api';
import type { Problem } from '../features/auth/types';

export default function HomePage() {
  const { user } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [solvedIds, setSolvedIds] = useState<Set<number>>(new Set());
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    void getProblems().then(setProblems).catch(() => setProblems([]));
  }, []);

  // 로그인 상태면 내가 푼 문제를 표시(비로그인 시 호출 안 함).
  useEffect(() => {
    if (!user) {
      setSolvedIds(new Set());
      return;
    }
    void getMyAttempts()
      .then((attempts) => setSolvedIds(new Set(attempts.map((a) => a.problemId))))
      .catch(() => setSolvedIds(new Set()));
  }, [user]);

  const handleSolve = async (problemId: number) => {
    setBusyId(problemId);
    try {
      await solveProblem(problemId);
      setSolvedIds((prev) => new Set(prev).add(problemId));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="page">
      <style>{globalStyles + buttonStyles + homePageStyles}</style>
      <SiteHeader />

      <section className="hero">
        <h1>
          PROMPT<br />
          <span className="accent">STUDIO</span> ↗
        </h1>
        <p>
          세션 + 쿠키 로그인 샌드박스. 로그인하면 "내가 푼 문제"가
          사용자별로 기록됩니다.
        </p>
        <div className="chips">
          <span className="chip">SESSION + COOKIE</span>
          <span className="chip">{user ? `@${user.username}` : 'ANONYMOUS'}</span>
          <span className="chip">PER-USER HISTORY</span>
        </div>
      </section>

      <div className="section-label">// PROBLEMS</div>

      {problems.map((problem) => {
        const solved = solvedIds.has(problem.id);
        return (
          <div className="problem-row" key={problem.id}>
            <div className="meta">
              <span className="id">{String(problem.id).padStart(2, '0')}</span>
              <span className="title">{problem.title}</span>
            </div>
            {user ? (
              solved ? (
                <span className="solved">SOLVED ✓</span>
              ) : (
                <Button
                  variant="secondary"
                  disabled={busyId === problem.id}
                  onClick={() => handleSolve(problem.id)}
                >
                  {busyId === problem.id ? '기록 중…' : 'MARK SOLVED'}
                </Button>
              )
            ) : (
              <span className="solved" style={{ background: 'transparent', color: 'var(--muted)' }}>
                LOGIN TO SOLVE
              </span>
            )}
          </div>
        );
      })}

      {!user && (
        <p className="hint">
          로그인하면 문제를 풀이로 기록하고 마이페이지에서 확인할 수 있습니다.{' '}
          <a href="/login">로그인 →</a>
        </p>
      )}
    </div>
  );
}
