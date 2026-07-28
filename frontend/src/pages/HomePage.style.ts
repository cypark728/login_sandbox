export const homePageStyles = `
  .hero { padding: 20px 0 44px; border-bottom: 1px solid var(--line); }

  .hero h1 {
    font: 800 clamp(44px, 8vw, 84px)/0.98 var(--font-sans);
    letter-spacing: -.04em;
    margin: 0 0 18px;
  }
  .hero h1 .accent { color: var(--accent); }

  .hero p {
    max-width: 520px;
    color: var(--muted);
    font: 500 14px/1.6 var(--font-mono);
    margin: 0;
  }

  .chips { display: flex; gap: 10px; margin-top: 24px; flex-wrap: wrap; }
  .chip {
    font: 700 10px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: .08em;
    color: var(--accent);
    border: 1px solid var(--line);
    padding: 8px 12px;
  }

  .section-label {
    font: 700 11px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: .1em;
    color: var(--muted);
    margin: 40px 0 16px;
  }

  .problem-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 18px 0;
    border-bottom: 1px solid var(--line);
  }
  .problem-row .meta { display: flex; align-items: baseline; gap: 14px; }
  .problem-row .id {
    font: 800 13px/1 var(--font-mono);
    color: var(--accent);
    min-width: 28px;
  }
  .problem-row .title { font: 600 16px/1 var(--font-sans); }
  .problem-row .solved {
    font: 700 10px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: .06em;
    color: var(--black);
    background: var(--accent);
    padding: 6px 8px;
  }

  .hint {
    margin-top: 20px;
    color: var(--muted);
    font: 500 13px/1.5 var(--font-mono);
  }
  .hint a { color: var(--accent); text-decoration: none; }
`;
