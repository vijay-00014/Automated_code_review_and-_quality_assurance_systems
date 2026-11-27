import React from 'react';
import { generateLineDiff } from '../utils/diffGenerator';
import { Check, ArrowRight, Sparkles, Copy } from 'lucide-react';

export function DiffViewer({ originalCode, refactoredCode, onApplyFix }) {
  const [applied, setApplied] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const diffs = generateLineDiff(originalCode, refactoredCode);

  const handleApply = () => {
    onApplyFix(refactoredCode);
    setApplied(true);
    setTimeout(() => setApplied(false), 2500);
  };

  const handleCopyRefactored = () => {
    navigator.clipboard.writeText(refactoredCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--critical)' }}>
            ■ Red = Deletions
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--success)' }}>
            ■ Green = Additions / Fixes
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={handleCopyRefactored} style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
            {copied ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
            <span>{copied ? 'Copied Refactored Code' : 'Copy Fixed Code'}</span>
          </button>

          <button className="btn btn-primary" onClick={handleApply} style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
            {applied ? <Check size={14} /> : <Sparkles size={14} />}
            <span>{applied ? 'Fix Applied to Editor!' : 'Apply Suggested Fix'}</span>
          </button>
        </div>
      </div>

      <div className="diff-container">
        {diffs.map((item, idx) => (
          <div key={idx} className={`diff-line ${item.type}`}>
            <span style={{ width: '35px', userSelect: 'none', opacity: 0.5, fontSize: '0.75rem' }}>
              {item.origLine ? item.origLine : item.refLine}
            </span>
            <span style={{ width: '20px', userSelect: 'none', fontWeight: 'bold' }}>
              {item.type === 'added' ? '+' : item.type === 'removed' ? '-' : ' '}
            </span>
            <span>{item.content || ' '}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
